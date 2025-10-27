import { Button } from '@/ui/components/button'
import { Sparkles, Download, Grid3x3 } from 'lucide-react'

interface ToolbarProps {
  onRefine: () => void
  onExport: () => void
  onToggleGrid: () => void
  gridEnabled: boolean
}

export default function Toolbar({ onRefine, onExport, onToggleGrid, gridEnabled }: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border glass-panel px-6 py-4 backdrop-blur-xl">
      <Button variant="secondary" size="sm" onClick={onRefine} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Refine
      </Button>
      <Button variant="secondary" size="sm" onClick={onExport} className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
      <Button 
        variant={gridEnabled ? 'default' : 'secondary'} 
        size="sm" 
        onClick={onToggleGrid}
        className="gap-2"
      >
        <Grid3x3 className="h-4 w-4" />
        Grid
      </Button>
    </div>
  )
}

