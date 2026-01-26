# Mintlify Documentation Guidelines

## Running the Dev Server

```bash
npx mintlify dev
```

The server runs on port 3000 (or 3001 if 3000 is in use).

## MDX Syntax Rules

### No Self-Closing Tags

Mintlify's MDX parser does not support self-closing JSX tags. This is the most common source of build errors.

**Error message:** `Unexpected closing slash '/' in tag, expected an open tag first`

```mdx
<!-- WRONG - will cause build error -->
<Card title="Example" href="/path" />
<Icon icon="star" />
<img src="/image.png" alt="Example" />
<br/>

<!-- CORRECT - use opening and closing tags -->
<Card title="Example" href="/path">
  Description content here
</Card>

<!-- CORRECT - use markdown for images -->
![Example](/image.png)

<!-- CORRECT - use markdown for line breaks or just blank lines -->
```

### Component Syntax

Always use proper opening/closing tag pairs for Mintlify components:

```mdx
<CardGroup cols={2}>

<Card title="Title" icon="icon-name" href="/path">
  Card description content
</Card>

<Card title="Another" href="/path">
  More content
</Card>

</CardGroup>
```

## Styling Approach

### Priority Order

1. **Use Mintlify's native components first** - CardGroup, Card, Badge, Tabs, Accordion, etc.
2. **Use Mintlify's built-in props** - icons, colors, columns
3. **Fall back to custom CSS only when native options don't work**

### Custom Style Files

- `style.css` - Static CSS loaded by Mintlify
- `styles.js` - JavaScript-injected CSS for dev mode (some styles only work via JS injection)

Both files should have the same styles for consistency between dev and production.

### Card Border Fix

Cards have overflow clipping issues. The fix requires:

```css
.card-group {
  overflow: visible !important;
  contain: none !important;
  padding: 4px !important;
  margin: -4px !important;
}

.mdx-content {
  contain: none !important;
  overflow: visible !important;
}
```

### Light/Dark Mode Targeting

```css
/* Light mode only */
:root:not(.dark) .selector { }

/* Dark mode only */
.dark .selector { }
```

## Available Badge Colors

Mintlify supports these badge colors:
- `green`, `red`, `blue`, `yellow`, `orange`, `purple`, `cyan`

```mdx
<Badge shape="pill" color="green">Recommended</Badge>
<Badge shape="rounded" icon="circle-check" color="green" size="lg">Latest</Badge>
```

## Common Patterns

### Model Card Layout

```mdx
## Section Title &nbsp;&nbsp;<Badge shape="rounded" color="green">Label</Badge>

<CardGroup cols={2}>

<Card title="Model Name" href="https://huggingface.co/...">
  1.2B · <Badge shape="pill" color="green">Recommended</Badge>

  Short description of the model.
</Card>

</CardGroup>
```

### Accent Color

The purple accent color used throughout: `#864bc4`

```css
/* For backgrounds */
background-color: rgba(134, 75, 196, 0.1);

/* For text/borders */
color: #864bc4;
border-color: #864bc4;
```

## Debugging

### Build Errors

If you get MDX parsing errors:
1. Search for `/>` in all `.mdx` and `.md` files
2. Convert self-closing tags to proper open/close pairs
3. Check for `<img>`, `<br>`, `<Icon>`, `<Card>` tags

```bash
# Find self-closing tags
grep -r '/>' --include="*.mdx" --include="*.md" .
```

### Style Not Applying

1. Check if the selector is specific enough
2. Try adding `!important`
3. Check if you need to target light/dark mode specifically
4. For icons using mask-image, set `background-color` instead of `color`
