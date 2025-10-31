# AI Model Usage Strategy

## Two-Tier Model System

The AI service now uses **two models** to optimize cost and performance:

### 🚀 AI_MODEL_PRO (Heavy Generations)
**Default:** `gpt-4o`

Used for complex, creative, and structured generation tasks:
- **Pass A (Layout Planning)** - Requires deep understanding of UI patterns and architecture
- **Pass B (Content Generation)** - Creative copy, labels, descriptions, form fields
- **Pass C (Theme Generation)** - Color harmony, typography, design token selection

These passes require:
- Strong reasoning capabilities
- Design knowledge
- Creativity and nuance
- Complex structured output

### ⚡ AI_MODEL_LITE (Light Operations)
**Default:** `gpt-4o-mini`

Used for smaller, focused operations:
- **Validation repairs** - Fixing specific schema violations
- **Simple transformations** - Currently not used, but reserved for future features
- **Quick fixes** - Post-processing adjustments

These operations require:
- Following specific instructions
- Making targeted edits
- Less creativity, more precision

## Configuration

### Environment Variables

Set in your `.env` file or docker-compose:

```bash
# Heavy model for main generation passes
AI_MODEL_PRO=gpt-4o

# Light model for repairs and simple operations
AI_MODEL_LITE=gpt-4o-mini
```

### Docker Compose

Already configured in `docker-compose.yml`:

```yaml
ai:
  environment:
    AI_MODEL_PRO: ${AI_MODEL_PRO:-gpt-4o}
    AI_MODEL_LITE: ${AI_MODEL_LITE:-gpt-4o-mini}
```

## Cost Optimization

This two-tier approach reduces costs while maintaining quality:

| Model | Input Cost | Output Cost | Use Case |
|-------|------------|-------------|----------|
| gpt-4o | $2.50/1M | $10.00/1M | Main passes (3x per request) |
| gpt-4o-mini | $0.15/1M | $0.60/1M | Repairs (~10% of requests) |

**Estimated savings:** ~40-50% compared to using gpt-4o for everything

## Alternative Models

You can use any model supported by LiteLLM:

```bash
# OpenAI models
AI_MODEL_PRO=gpt-4-turbo-preview
AI_MODEL_LITE=gpt-3.5-turbo

# Anthropic Claude
AI_MODEL_PRO=anthropic/claude-3-opus-20240229
AI_MODEL_LITE=anthropic/claude-3-haiku-20240307

# Local models (via Ollama)
AI_MODEL_PRO=ollama/llama2:70b
AI_MODEL_LITE=ollama/llama2:13b
```

## Monitoring

The system logs which models are being used:

```
Using PRO model: gpt-4o
Using LITE model: gpt-4o-mini
=== Pass A: Layout Plan (platform=mobile) ===
=== Pass B: Content ===
=== Pass C: Theme ===
```

## Best Practices

1. **Use PRO model for:** Creative tasks, complex reasoning, design decisions
2. **Use LITE model for:** Following rules, fixing known issues, simple edits
3. **Monitor costs:** Track token usage in logs
4. **Experiment:** Try different model combinations for your use case
5. **Fallback:** If LITE model fails repairs, consider using PRO for repairs too

## Future Enhancements

Potential uses for LITE model:
- Post-processing cleanups
- Schema transformations
- Quick validations
- Icon name normalization
- Color format conversions

