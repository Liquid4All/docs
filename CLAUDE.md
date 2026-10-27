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

## Sampling Parameters

Every inference example must use the correct sampling params from the upstream HF model cards. Do not use placeholder values like `temperature=0.7`. For new models not listed below, check the model card on Hugging Face (huggingface.co/LiquidAI) for recommended settings.

| Model Family | temp | top_k | top_p | min_p | repeat_penalty |
|---|---|---|---|---|---|
| LFM3-1.7B (general) | 0.1 | 50 | — | — | 1.1 |
| LFM3-1.7B (math & STEM) | 1.0 | 20 | 0.95 | — | 1.0 |
| LFM3-VL-2B | 0.1 | 50 | — | — | 1.1 |
| LFM3-Audio-2B (speech output) | audio_temperature=1.0 | audio_top_k=128 | — | — | audio_repetition_penalty=1.1, audio_repetition_window=4096 |
| LFM3-Omni-2B (speech output) | audio_temperature=0.4 | — | — | — | audio_repetition_penalty=1.2, audio_repetition_window=64 |
| LFM3-Omni-2B (text output) | 0 (greedy) | — | — | — | — |
| d1-2B, d1-omni-2B | n/a (single forward pass) | — | — | — | — |
| LFM2.5-1.2B-Instruct, LFM2.5-350M, LFM2.5-230M | 0.1 | 50 | — | — | 1.05 |
| LFM2.5-1.2B-Thinking | 0.05 | 50 | — | — | 1.05 |
| LFM2.5-1.2B-JP-202606 | 0.1 | 50 | — | — | 1.05 |
| LFM2.5-2.6B | 0.1 | 50 | — | — | 1.1 |
| LFM2.5-8B-A1B | 0.2 | 80 | — | — | 1.05 |
| LFM2.5-24B-A2B, LFM2-24B-A2B | 0.1 | 50 | — | — | 1.05 |
| General-purpose LFM2 text + LFM2.5-1.2B-JP (deprecated) | 0.3 | — | — | 0.15 | 1.05 |
| LFM2-350M-ENJP-MT | 0.5 | — | 1.0 | 0.1 | 1.05 |
| LFM2-350M-Math | 0.6 | — | 0.95 | 0.1 | 1.05 |
| LFM2 Extract, RAG, and PII Extract models | 0 (greedy) | — | — | — | — |
| LFM2-2.6B-Transcript | 0.3 | — | — | — | — |
| LFM2.5-VL-3B | 0.2 | 50 | — | — | 1.0 |
| Other VL models (LFM2.5-VL-1.6B, LFM2.5-VL-450M, LFM2-VL) | 0.1 | — | — | 0.15 | 1.05 |

### Engine-specific field names

- **Transformers, vLLM, llama-server, MLX**: `repetition_penalty`
- **Ollama, LM Studio**: `repeat_penalty`

### OpenAI Python client

Non-standard params (`top_k`, `min_p`, `repetition_penalty`/`repeat_penalty`) must go in `extra_body`, not as direct kwargs:

```python
extra_body={"top_k": 50, "repetition_penalty": 1.05}
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

## Link Snapshot Contract

`link-snapshot.yaml` is an append-only ledger of every URL the docs site has promised to keep resolving. The pre-commit hook keeps it in sync; [`check-link-snapshot.yaml`](.github/workflows/check-link-snapshot.yaml) fails any PR that would make a recorded URL stop resolving. Run `npm install` once to install the hook.

A URL in `active` resolves if any of these are true:
1. It is in the `docs.json` navigation tree.
2. A matching `.mdx`/`.md` file exists under `lfm/`, `leap/`, `examples/`, or `deployment/`.
3. It matches a `redirects[*].source` (literal or `:slug*` prefix) whose destination itself resolves (recursive, max depth 5).

When CI flags a URL, pick one (in order of preference):

1. **Add a redirect** in `docs.json` — best when a substitute page exists.
2. **Deprecate in place** — remove the page from `docs.json` navigation but leave the `.mdx` on disk (the URL stays served, just undiscoverable). Add a `<Note>` deprecation banner.
3. **Mark deleted** — move the URL from `active` to `deleted` in `link-snapshot.yaml`. Bare URLs are fine; commit history is the record. Use only when no substitute exists.

Don't edit `active` by hand — moving a URL to `deleted` causes the next `snapshot:update` (which the pre-commit hook runs automatically) to drop it from `active`. Manual commands: `npm run snapshot:update` to regenerate, `npm run snapshot:check` to run what CI runs. Both call `scripts/generateLinkSnapshot.ts` via `tsx`; new TypeScript scripts should follow the same `tsx scripts/<file>.ts` pattern.

## Git Commits

- Never create a single monolithic commit for multi-step work. Break commits into logical units (e.g., infrastructure/scaffolding, feature A, feature B, fixes).
- Each commit should be independently meaningful — a reviewer should understand each one on its own.
- When committing multi-file changes, unstage everything first (`git reset HEAD .`) then stage and commit files in logical groups.
