# Design Guide

The docs follow liquid.ai: neutral grays, one violet accent, sharp corners, little color. Most of the look comes from `style.css`; pages only pick the right component.

## Principles

1. Use Mintlify's built-in components first (Card, Badge, Tabs, Accordion, Steps, callouts).
2. Then their props (icon, columns, color).
3. Custom CSS only when neither works.
4. Avoid inline `style={{...}}` in MDX; never use it for colors or visual styling (the format buttons on model pages are the existing exception). Small layout tweaks are fine where no class exists.

## Color

- Don't introduce new colors. Use only the theme colors (the `--lfm-*` tokens in `style.css`).
- Most of the page is neutral. Use color only to emphasize important information or to draw attention (e.g. the violet accent for links and highlights, green for "available" ticks, Warning/Danger callouts).

## Corners

Elements are square by default (the `--lfm-radius` token is 2px). Step numbers and scrollbar handles retain Mintlify's native round corners; don't add other rounded shapes or a larger `border-radius`.

## Components

### Cards

Use a card to send the reader somewhere. Icon, title, one or two lines of text, two columns.

```mdx
<CardGroup cols={2}>

<Card title="Explore Models" icon="brain" href="/lfm/models/complete-library">
  Browse text, vision, audio, omni and decision models.
</Card>

</CardGroup>
```

- A single full-width `<Card>` (no CardGroup) for one main link, e.g. a cookbook.
- Cards that link to another site get a ↗ automatically.

### Model cards

For model grids on the model-category pages. Wrap the grid in `model-cards`; the first line is the size, a space, then the badge (no `·` before the badge). Two columns.

```mdx
<div className="model-cards">
<CardGroup cols={2}>

<Card title="LFM2.5-1.2B-Instruct" href="/lfm/models/lfm25-1.2b-instruct">
  1.2B <Badge shape="pill" color="blue">Chat</Badge>

  Instruction-tuned for chat and general-purpose tasks.
</Card>

</CardGroup>
</div>
```

### Use-case tiles

Small gray tiles that list what a model can do. Not clickable (no `href`). 3 columns on model pages, 2 on category pages.

```mdx
<div className="use-cases">
<CardGroup cols={3}>

<Card title="Math & Logic" icon="calculator">
  Strong arithmetic and logical reasoning
</Card>

</CardGroup>
</div>
```

### Badges

`color="green"` renders as the highlight (violet on lavender); use it only for "Recommended" and "Latest release". Every other color renders as the same neutral tag, so pick any for descriptive labels.

```mdx
<Badge shape="pill" color="green">Recommended</Badge>
<Badge shape="pill" color="blue">Chat</Badge>
```

### Callouts

- `<Note>`, `<Info>`, `<Tip>`, `<Check>`: flat gray panel, for side information.
- `<Warning>`, `<Danger>`: keep their color; only for things that can go wrong.

### Code

- A code block per command or file.
- `<CodeGroup>` for the same example in several languages.
- Inline code (`` `model_id` ``) for names, values and flags in text.

### Tabs, Steps, Accordion

- `<Tabs>`: alternatives the reader picks one of (OS, framework).
- `<Steps>`: a sequence the reader follows in order.
- `<Accordion>`: optional detail that most readers can skip.

### Model pages

The format buttons under the intro (HF, GGUF, MLX, ...) keep their existing inline-styled markup; copy the row from another model page. `style.css` turns their inline colors into one outlined chip.

### Colab badge

Keep the original branded badge artwork. The shared `.colab-link img` style sizes all badges to 24px high with their aspect ratio preserved.

```mdx
<div className="colab-link">
  <a href="https://colab.research.google.com/github/..." target="_blank">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open in Colab"></img>
  </a>
</div>
```

### Icons

- Font Awesome names (fontawesome.com/icons); Lucide names render as an empty box.
- Brand icons (`github`, `discord`): `iconType="brands"`.

## CSS

- Colors: only the `--lfm-*` tokens at the top of `style.css` (they switch in dark mode). No new tokens, no hex values in rules.
- Corners: use the `--lfm-radius` token (2px). Step numbers and scrollbar handles use `revert-layer` to keep Mintlify's native rounding. No hard-coded `border-radius`.
- Selectors: prefer Mintlify's attributes (`data-active`, `aria-selected`, `data-component-part`) over `[class*="..."]`, which also matches Tailwind variants like `hover:text-primary`.
- Light / dark only: `:root:not(.dark) .selector` / `.dark .selector`.
- Style not applying: make the selector more specific, add `!important`, check light/dark, and for mask-image icons set `background-color`, not `color`.
