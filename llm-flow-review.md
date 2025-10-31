# Superdesign LLM Flow Review

## Runtime Flow Overview

- **Extension activation** wires together the chat sidebar, canvas panel, and message handling. The activation function instantiates `CustomAgentService`, registers commands, and forwards webview messages through the sidebar provider callbacks.

```1336:1389:src/extension.ts
	// Set up message handler for auto-canvas functionality
	sidebarProvider.setMessageHandler((message) => {
		switch (message.command) {
			case 'checkCanvasStatus':
				// Check if canvas panel is currently open
				const isCanvasOpen = SuperdesignCanvasPanel.currentPanel !== undefined;
				sidebarProvider.sendMessage({
					command: 'canvasStatusResponse',
					isOpen: isCanvasOpen
				});
				break;
			case 'autoOpenCanvas':
				// Auto-open canvas if not already open
				SuperdesignCanvasPanel.createOrShow(context.extensionUri, sidebarProvider);
				break;
			case 'saveImageToMoodboard':
				// Save uploaded image to moodboard directory
				saveImageToMoodboard(message.data, sidebarProvider);
				break;
			case 'getBase64Image':
				// Convert saved image to base64 for AI SDK
				getBase64Image(message.filePath, sidebarProvider);
				break;
			case 'getCssFileContent':
				// Read CSS file content for theme preview
				getCssFileContent(message.filePath, sidebarProvider);
				break;
			case 'submitEmail':
				// Handle email submission from welcome screen
				submitEmailToSupabase(message.email, sidebarProvider);
				break;
		}
	});
```

- **Sidebar webview messaging** funnels chat requests into `ChatMessageService`, which streams responses and tool events back to the webview while also relaying provider changes and configuration prompts.

```58:118:src/providers/chatSidebarProvider.ts
		webviewView.webview.onDidReceiveMessage(
			async (message) => {
				// First try custom message handler for auto-canvas functionality
				if (this.customMessageHandler) {
					this.customMessageHandler(message);
				}

				switch (message.command) {
					case 'chatMessage':
						await this.messageHandler.handleChatMessage(message, webviewView.webview);
						break;
					case 'stopChat':
						await this.messageHandler.stopCurrentChat(webviewView.webview);
						break;
					case 'changeProvider':
						await this.handleChangeProvider(message.model, webviewView.webview);
						break;
				}
			}
		);
```

- **Chat streaming pipeline** converts webview requests into Core AI messages, manages aborts, and forwards streaming deltas. Every chunk received from `AgentService.query` is pushed immediately to the webview, including tool-call updates and tool results.

```70:287:src/services/chatMessageService.ts
		let response: any[];
		if (chatHistory.length > 0) {
			response = await this.agentService.query(
				undefined,
				chatHistory,
				undefined,
				this.currentRequestController,
				(streamMessage: any) => {
					this.handleStreamMessage(streamMessage, webview);
				}
			);
		} else {
			response = await this.agentService.query(
				latestMessage,
				undefined,
				undefined,
				this.currentRequestController,
				(streamMessage: any) => {
					this.handleStreamMessage(streamMessage, webview);
				}
			);
		}

		webview.postMessage({
			command: 'chatStreamEnd'
		});
```

- **Agent dispatch** in `CustomAgentService` selects the correct provider, injects working-directory aware tools, and orchestrates streaming across token deltas, tool-call deltas, and tool results.

```650:905:src/services/customAgentService.ts
		const tools = {
			read: createReadTool(executionContext),
			write: createWriteTool(executionContext),
			edit: createEditTool(executionContext),
			multiedit: createMultieditTool(executionContext),
			glob: createGlobTool(executionContext),
			grep: createGrepTool(executionContext),
			ls: createLsTool(executionContext),
			bash: createBashTool(executionContext),
			generateTheme: createThemeTool(executionContext)
		};

		const streamTextConfig: any = {
			model: this.getModel(),
			system: this.getSystemPrompt(),
			tools: tools,
			toolCallStreaming: true,
			maxSteps: 10,
			maxTokens: 32000
		};

		for await (const chunk of result.fullStream) {
			switch (chunk.type) {
				case 'text-delta':
					messageBuffer += chunk.textDelta;
					const textMessage: CoreMessage = {
						role: 'assistant',
						content: chunk.textDelta
					};
					onMessage?.(textMessage);
					responseMessages.push(textMessage);
					break;
				case 'tool-call-delta':
					// ... existing tool-call streaming logic ...
					break;
			}
		}
```

## Provider Behavior Snapshot

### `CustomAgentService`

- Dynamically chooses OpenAI, Anthropic, or OpenRouter based on user configuration, with fallbacks derived from provider defaults.

```83:171:src/services/customAgentService.ts
	const config = vscode.workspace.getConfiguration('superdesign');
	const specificModel = config.get<string>('aiModel');
	const provider = config.get<string>('aiModelProvider', 'anthropic');

	switch (effectiveProvider) {
		case 'openrouter':
			const openrouterKey = config.get<string>('openrouterApiKey');
			// ...
		case 'anthropic':
			const anthropicKey = config.get<string>('anthropicApiKey');
			// ...
		case 'openai':
		default:
			const openaiKey = config.get<string>('openaiApiKey');
```

- Streams tool calls with partial JSON buffering, emits VS Code notifications for API-key errors, and sets up a workspace-scoped `.superdesign` directory for generated assets.

### Claude Provider Stack

- `LLMProviderFactory` abstracts provider selection for Claude-specific flows, allowing the sidebar to switch between API and binary implementations without restarting the extension.

```21:47:src/providers/llmProviderFactory.ts
	if (this.providers.has(providerType)) {
		const provider = this.providers.get(providerType)!;
		if (provider.isReady()) {
			this.currentProvider = provider;
			return provider;
		}
	}

	const provider = await this.createProvider(providerType);
	await provider.waitForInitialization();
	this.providers.set(providerType, provider);
	this.currentProvider = provider;
```

- `ClaudeApiProvider` wraps the `@anthropic-ai/claude-code` SDK, pipes the system prompt through stdin, and streams SDK messages back via `LLMMessage` objects. `ClaudeCodeProvider` shells out to the local `claude` binary with similar system prompts and resume support when users choose the Claude Code pathway.

```172:227:src/providers/claudeApiProvider.ts
	const systemPrompt = options?.customSystemPrompt || `# Role
	You are a **senior front-end designer**.
	...

	const finalOptions: Partial<ClaudeCodeOptions> = {
		maxTurns: options?.maxTurns || 10,
		allowedTools: options?.allowedTools || [
			'Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'LS', 'Grep', 'Glob'
		],
		permissionMode: options?.permissionMode || 'acceptEdits',
		cwd: this.workingDirectory,
		customSystemPrompt: systemPrompt,
		...options
	};
```

```285:337:src/providers/claudeCodeProvider.ts
	const { args, systemPrompt: sysPrompt } = this.buildClaudeCodeArgs({
		systemPrompt,
		prompt,
		modelId: this.modelId,
		thinkingBudgetTokens: this.thinkingBudgetTokens,
		resume: this.currentSessionId,
		maxTurns: options?.maxTurns || 10,
		allowedTools: options?.allowedTools || [
			'Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'LS', 'Grep', 'Glob'
		],
		permissionMode: options?.permissionMode || 'acceptEdits'
	});
```

## Improvement Opportunities

- **Unify provider routing.** `CustomAgentService` implements its own OpenAI/Anthropic/OpenRouter selection, while the Claude flows use `LLMProviderFactory`. Establishing a single provider abstraction would eliminate duplication and simplify webview-side logic when adding future providers.
- **Centralize system prompts.** The same high-volume prompt text appears in `CustomAgentService`, `ClaudeApiProvider`, `ClaudeCodeProvider`, and `system-prompt.txt`. Moving the canonical prompt into a shared file or configuration module would prevent drift across providers.
- **Externalize Helicone credentials.** The repository ships with a live Helicone API key embedded in `CustomAgentService`. Loading this value from environment variables (and guarding logs) would prevent accidental leakage of shared credentials.
- **Harden tool-call streaming.** `CustomAgentService` buffers JSON deltas without timeout or size guards and silently skips malformed payloads. Adding defensive parsing (timeouts, max-size limits, structured error propagation) would improve resiliency when models emit partial JSON.
- **Factor shared workspace setup.** `CustomAgentService`, `ClaudeApiProvider`, and `ClaudeCodeProvider` each re-implement `.superdesign` folder creation. Promoting a shared utility (e.g., `ensureSuperdesignWorkspace`) would keep behavior consistent and make it easier to evolve directory layout rules.

## Next Steps

- Decide whether all chat interactions should flow through a single provider factory, potentially wrapping the AI SDK path behind the same interface used by the Claude providers.
- Extract prompts and external headers into configuration files, then reference them from providers to reduce maintenance friction.
- Add telemetry or logging around tool failures and command execution to surface error hotspots before they reach end users.

