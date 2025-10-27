import { Button } from '@/theme/components/button'
import { Sparkles, Download } from 'lucide-react'


export default function Toolbar() {
  const handleExportToFigma = () => {
    console.log('Export to Figma')
  }
  const handleDownloadAsPDF = () => {
    console.log('Download as PDF')
  }
  return (
    <div className="flex items-center justify-end gap-3 glass-panel px-3 backdrop-blur-xl h-[60px]">
      <Button variant="secondary" size="sm" onClick={handleExportToFigma} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Export to Figma
      </Button>
      <Button variant="secondary" size="sm" onClick={handleDownloadAsPDF} className="gap-2">
        <Download className="h-4 w-4" />
        Download as PDF
      </Button>
    </div>
  )
}

