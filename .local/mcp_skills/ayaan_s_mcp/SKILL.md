---
name: mcp-ayaan-s-mcp
description: 'Call tools from the ayaan''s mcp MCP server through code_execution callbacks. Available tools: mcpAyaanSMcp_getHtmlForReference, mcpAyaanSMcp_getScreenshotForReference. Reference skill for more information.'
---

# MCP Skill: ayaan's mcp

Use this skill when you need data or actions from this MCP server.

## Available Functions

### mcpAyaanSMcp_getHtmlForReference(...)

Get HTML code for a specific capture. This should only be called once. Then you should call get_screenshot_for_reference to get the screenshot. The class names used int eh reference wont be available in the current project. Hence do not rely on them. Create new classes based on the style attributes. Do not use inline styles in the generated code. Ignore the data attributes.

    Args:
        capture_slug: The UUID slug of the capture

    Returns:
        The HTML content of the capture

**Parameters:**

- `capture_slug` (string, required)

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpAyaanSMcp_getHtmlForReference({ capture_slug: "" });
console.log(result);
```

### mcpAyaanSMcp_getScreenshotForReference(...)

Get PNG screenshot for a specific capture. This should only be called after get_html_for_reference.

    Args:
        capture_slug: The UUID slug of the capture

    Returns:
        The PNG image data as base64-encoded string

**Parameters:**

- `capture_slug` (string, required)

**Returns:** Object with `status`, `content`, and optional metadata.

**Example:**

```javascript
const result = await mcpAyaanSMcp_getScreenshotForReference({ capture_slug: "" });
console.log(result);
```

## Blocked Tools

- None

## Notes

- Call these functions directly in `code_execution` JavaScript.
- These are pre-registered callbacks available in the sandbox; no imports needed.
