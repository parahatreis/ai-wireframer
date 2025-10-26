import os
import json
from datetime import datetime


def styles_to_css(styles: dict) -> str:
    """
    Convert styles dict to inline CSS string.
    Converts camelCase to kebab-case.
    """
    if not styles:
        return ""
    css_parts = []
    for key, value in styles.items():
        # Convert camelCase to kebab-case
        css_key = ''.join(['-' + c.lower() if c.isupper() else c for c in key]).lstrip('-')
        css_parts.append(f"{css_key}: {value}")
    return "; ".join(css_parts)


def render_element(element: dict, depth: int = 0) -> str:
    """
    Recursively render a wireframe element to HTML.
    
    Expected structure:
    {
      "type": "header|text|form|button|input|link|image|container|section|nav|footer",
      "content": "text content",
      "styles": {"camelCase": "value"},
      "attributes": {"id": "...", "class": "...", ...},
      "elements": [nested elements]
    }
    """
    elem_type = element.get("type", "div")
    content = element.get("content", "")
    styles = element.get("styles", {})
    attrs = element.get("attributes", {})
    children = element.get("elements", [])
    
    # Map wireframe types to HTML tags
    tag_map = {
        "header": "h1",
        "subheader": "h2",
        "text": "p",
        "button": "button",
        "input": "input",
        "form": "form",
        "link": "a",
        "image": "img",
        "container": "div",
        "section": "section",
        "nav": "nav",
        "footer": "footer",
    }
    
    tag = tag_map.get(elem_type, "div")
    
    # Build attributes string
    attr_str = ""
    for key, value in attrs.items():
        if isinstance(value, bool):
            if value:
                attr_str += f' {key}'
        else:
            # Escape quotes in attribute values
            escaped_value = str(value).replace('"', '&quot;')
            attr_str += f' {key}="{escaped_value}"'
    
    # Add inline styles
    if styles:
        css = styles_to_css(styles)
        attr_str += f' style="{css}"'
    
    # Handle self-closing tags
    if tag == "input" or tag == "img":
        return f'<{tag}{attr_str} />'
    
    # Render nested children
    children_html = ""
    if children:
        for child in children:
            children_html += render_element(child, depth + 1)
    
    # Combine content and children
    inner_content = content + children_html
    
    return f'<{tag}{attr_str}>{inner_content}</{tag}>'


def wireframe_to_html(wireframe_data: dict) -> str:
    """Convert wireframe JSON to HTML."""
    meta = wireframe_data.get("meta", {})
    pages = wireframe_data.get("pages", [])
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{meta.get('title', 'Wireframe')}</title>
    <style>
        * {{
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            line-height: 1.6;
        }}
        .wireframe-container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        .meta {{
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .meta h1 {{
            margin: 0 0 10px 0;
            color: #333;
        }}
        .page {{
            background: white;
            padding: 40px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .page > h2 {{
            margin-top: 0;
            color: #333;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
            margin-bottom: 30px;
        }}
        h1 {{
            font-size: 2em;
            margin: 20px 0;
            color: #222;
        }}
        h2 {{
            font-size: 1.5em;
            margin: 15px 0;
            color: #333;
        }}
        form {{
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-width: 400px;
        }}
        input {{
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }}
        input:focus {{
            outline: none;
            border-color: #007bff;
        }}
        button {{
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 500;
        }}
        button:hover {{
            background-color: #0056b3;
        }}
        a {{
            color: #007bff;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        p {{
            margin: 10px 0;
            color: #555;
        }}
        section {{
            margin: 20px 0;
        }}
        nav {{
            padding: 10px 0;
            margin-bottom: 20px;
        }}
        footer {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #777;
        }}
    </style>
</head>
<body>
    <div class="wireframe-container">
        <div class="meta">
            <h1>{meta.get('title', 'Wireframe')}</h1>
            <p><strong>Description:</strong> {meta.get('description', 'N/A')}</p>
        </div>
"""
    
    for idx, page in enumerate(pages, 1):
        page_name = page.get('name', f'Page {idx}')
        page_description = page.get('description', '')
        elements = page.get('elements', [])
        
        html += f"""        <div class="page">
            <h2>{page_name}</h2>
"""
        
        if page_description:
            html += f'            <p>{page_description}</p>\n'
        
        # Render elements
        for element in elements:
            html += '            ' + render_element(element) + '\n'
        
        html += '        </div>\n'
    
    html += """    </div>
</body>
</html>"""
    
    return html


def save_html_file(html_content: str, output_dir: str = "output") -> str:
    """Save HTML content to a file and return the file path."""
    os.makedirs(output_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"wireframe_{timestamp}.html"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    return filepath

