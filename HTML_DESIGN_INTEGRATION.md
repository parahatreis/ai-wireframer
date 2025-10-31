# HTML Design Integration Guide

## Overview
The superdesign system prompt has been integrated into the AI Designer platform, allowing you to generate pixel-perfect HTML designs with 3 parallel variations.

## What Was Added

### Backend (ai/)
- **`app/services/html_design_prompt.py`** - System prompt from superdesign
- **`app/services/html_design.py`** - Service for generating HTML variations
- **`app/routes/html_design.py`** - New `/generate-html-design` endpoint
- **`app/schemas.py`** - Request/response models

### Frontend (web/)
- **`src/services/api.ts`** - New `generateHtmlDesigns()` function
- **`src/components/HtmlDesignViewer.tsx`** - Component to preview HTML designs
- **`src/pages/File.tsx`** - Mode toggle between Wireframe & HTML Design

## Features

### HTML Design Mode
1. **3 Parallel Variations** - Get 3 different design approaches at once
2. **Live Preview** - See designs in iframe with full interactivity
3. **Zoom Controls** - Scale from 25% to 200%
4. **Thumbnail Navigation** - Quick preview of all variations
5. **Export Options**:
   - Download as `.html` file
   - Open in new tab

### Design Specifications
- **Tailwind CSS** via CDN
- **Responsive** - Mobile, tablet, desktop
- **4pt/8pt spacing system** - Pixel-perfect alignment
- **Black & white text** - High contrast
- **No images** - CSS-only placeholders
- **Modern minimal** aesthetic

## Usage

### Start the Services

**Backend:**
```bash
cd ai
make dev  # or docker-compose up
```

**Frontend:**
```bash
cd web
yarn dev
```

### Using the Web Interface

1. Navigate to the File page
2. Toggle between **Wireframe** and **HTML Design** modes (top toolbar)
3. Type your prompt in the chat
4. In HTML Design mode:
   - View 3 variations side-by-side (thumbnails at bottom)
   - Click thumbnails to switch between designs
   - Use zoom controls to inspect details
   - Download or open in new tab

### API Endpoint

**POST** `/generate-html-design`

**Request:**
```json
{
  "prompt": "Create a modern landing page for a SaaS product",
  "num_variations": 3
}
```

**Response:**
```json
{
  "designs": [
    "<!DOCTYPE html>...",
    "<!DOCTYPE html>...",
    "<!DOCTYPE html>..."
  ],
  "count": 3
}
```

## Comparison: Wireframe vs HTML Design

| Feature | Wireframe Mode | HTML Design Mode |
|---------|---------------|------------------|
| Output | JSON structure | Full HTML files |
| Framework | React + shadcn/ui | Pure HTML + Tailwind |
| Iterations | Conversational | 3 parallel variations |
| Use Case | App prototypes | Quick mockups |
| Export | Code generation | Direct HTML download |
| Interactivity | Component-based | Static preview |

## Example Prompts

**Landing Pages:**
```
Create a SaaS landing page with hero, features grid, and pricing
```

**Dashboards:**
```
Design a modern analytics dashboard with charts and metrics
```

**Forms:**
```
Build a multi-step signup form with validation states
```

**E-commerce:**
```
Create a product listing page with filters and cards
```

## Technical Details

### HTML Generation
- Uses `gpt-4o` by default (configurable via `AI_MODEL` env var)
- Temperature varies per variation (0.7, 0.8, 0.9) for diversity
- Generates single-file HTML with inline Tailwind CDN

### Preview Security
- iframes use `sandbox` attribute
- `allow-scripts` and `allow-same-origin` only
- No external resource loading

### Performance
- Parallel generation for all 3 variations
- Total time: ~30-60 seconds for 3 designs
- Each design is self-contained (no dependencies)

## Next Steps

### Possible Enhancements
- [ ] Save designs to project history
- [ ] Export to Figma/Sketch
- [ ] A/B test variant selection
- [ ] Mobile device preview modes
- [ ] Real-time collaborative editing
- [ ] Component extraction from designs

## Troubleshooting

**Designs not generating?**
- Check backend is running on `http://localhost:5566`
- Verify `AI_MODEL` env var is set
- Check API key in backend `.env`

**Blank iframes?**
- Check browser console for CSP errors
- Verify HTML is valid (view in new tab)
- Check sandbox attribute restrictions

**Slow generation?**
- Normal for 3 parallel LLM calls
- Consider reducing `num_variations`
- Use faster model if available

