import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/tabs'
import PromptForm from './PromptForm'
import ProgressFeed from './ProgressFeed'

interface AnalysisPanelProps {
  prompt: string
  isGenerating: boolean
  onRegenerate: (prompt: string) => void
  onComplete: () => void
}

export default function AnalysisPanel({ prompt, isGenerating, onRegenerate, onComplete }: AnalysisPanelProps) {
  return (
    <div className="flex h-screen w-full flex-col border-r border-border glass-panel lg:w-[30%]">
      <div className="border-b border-border px-6 py-5 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8">
          <PromptForm initialPrompt={prompt} onRegenerate={onRegenerate} isGenerating={isGenerating} />

          <div className="border-t border-border pt-8">
            <ProgressFeed isGenerating={isGenerating} onComplete={onComplete} />
          </div>

          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="analysis" className="flex-1">
                Analysis
              </TabsTrigger>
              <TabsTrigger value="json" className="flex-1">
                JSON
              </TabsTrigger>
              <TabsTrigger value="versions" className="flex-1">
                Versions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="analysis" className="text-sm text-muted-foreground">
              <div className="rounded-xl glass-panel border-dashed p-4">Analysis data will appear here after generation.</div>
            </TabsContent>
            <TabsContent value="json" className="text-sm text-muted-foreground">
              <div className="rounded-xl glass-panel border-dashed p-4">JSON output will appear here after generation.</div>
            </TabsContent>
            <TabsContent value="versions" className="text-sm text-muted-foreground">
              <div className="rounded-xl glass-panel border-dashed p-4">Version history will appear here.</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

