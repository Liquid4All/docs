// Custom styles for Liquid AI Documentation
// Injected via JS since CSS files aren't auto-loaded in Mintlify dev.
// Mirrors style.css (keep them in sync), plus a few dev-mode only fixes at the end.

(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Liquid AI brand mono font (body/heading font is set via \`fonts\` in docs.json) */
    @import url("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap");

    /* Fix Tabs component layout - ensure tabpanel appears below tablist */
    .tabs,
    .tab-container {
      flex-direction: column !important;
    }

    /* Global text color adjustments */
    /* Mintlify uses a div.antialiased wrapper with text-gray-500/dark:text-gray-400 */
    :root:not(.dark) body > div.antialiased {
      color: var(--lfm-fg) !important;
    }

    .dark body > div.antialiased {
      color: var(--lfm-fg) !important;
    }

    /* Discord navbar link styling - make icon less bright to match GitHub */
    .navbar-link a[href*="discord"] img,
    a[href*="discord.gg"] img {
      opacity: 0.6;
    }

    /* Hover state - turn purple accent color for both icon and text */
    .navbar-link a[href*="discord"]:hover,
    a[href*="discord.gg"]:hover {
      color: var(--lfm-accent) !important;
    }

    /* The icon is an <img>, so tint it to the accent with a filter (#7c3aed light, #ac8dff dark) */
    .navbar-link a[href*="discord"]:hover img,
    a[href*="discord.gg"]:hover img {
      opacity: 1;
      filter: brightness(0) saturate(100%) invert(23%) sepia(69%) saturate(7402%) hue-rotate(259deg) brightness(104%) contrast(86%);
    }

    .dark .navbar-link a[href*="discord"]:hover img,
    .dark a[href*="discord.gg"]:hover img {
      filter: brightness(0) saturate(100%) invert(63%) sepia(5%) saturate(6230%) hue-rotate(208deg) brightness(94%) contrast(148%);
    }

    /* Navbar "Try our API" button - foreground fill with inverse text, accent on hover (liquid.ai primary button) */
    #topbar-cta-button a > span[class*="bg-primary"] {
      background-color: var(--lfm-fg) !important;
      opacity: 1 !important;
      transition: background-color 0.15s ease !important;
    }

    #topbar-cta-button a:hover > span[class*="bg-primary"] {
      background-color: var(--lfm-accent) !important;
    }

    #topbar-cta-button a .text-white,
    #topbar-cta-button a svg {
      color: var(--lfm-fg-inverse) !important;
    }

    /* Hide the "Ask Assistant" box in the desktop header. The assistant stays on:
       it opens with Cmd/Ctrl+I, and the mobile header keeps its icon. */
    #assistant-entry {
      display: none !important;
    }

    /* Fix card border - consistent 2.5px border on all sides */
    .card-group {
      overflow: visible !important;
      contain: none !important;
      padding: 4px !important;
    }

    /* Card border styling */
    [class*="block"][class*="rounded"][class*="border"]:not(.use-cases *) {
      border-width: 2.5px !important;
      border-style: solid !important;
    }

    /* Purple accent border and arrow on HOVER only in light mode */
    /* Target both card-group cards AND standalone cards */
    :root:not(.dark) .card-group a[class*="block"][class*="border"]:hover,
    :root:not(.dark) a[class*="block"][class*="border"]:hover {
      border-color: var(--lfm-accent) !important;
    }

    :root:not(.dark) .card-group a[class*="block"]:hover svg,
    :root:not(.dark) a[class*="block"]:hover svg {
      color: var(--lfm-accent) !important;
    }

    /* Card icons - purple accent color in light mode (default state) */
    /* Only target the main icon, not the arrow icon (which contains "arrow" in class, or uses Mintlify's ExternalLink symbol) */
    :root:not(.dark) .card-group a[class*="block"] svg:not([class*="arrow"]):not(:has(use[href*="ExternalLink"])) {
      background-color: var(--lfm-accent) !important;
    }

    /* Fix GitHub icon visibility in light mode for standalone Cards (not in card-groups) */
    /* Scoped to .mdx-content so the page-footer "Suggest edits" / "Raise issue" toolbar
       buttons don't match. Their <a> has \`dark:bg-codeblock/50\` (substring "block") and
       \`border-standard\` (substring "border"), which would otherwise satisfy
       a[class*="block"][class*="border"] and turn their icons into purple squares. */
    :root:not(.dark) .mdx-content [class*="card"] svg:not([class*="arrow"]):not(:has(use[href*="ExternalLink"])),
    :root:not(.dark) .mdx-content a[class*="block"][class*="border"] svg:not([class*="arrow"]):not(:has(use[href*="ExternalLink"])) {
      background-color: var(--lfm-accent) !important;
    }

    /* For mask-image based icons, also set the color property as fallback */
    :root:not(.dark) .mdx-content [class*="card"] [style*="mask-image"],
    :root:not(.dark) .mdx-content a[class*="block"][class*="border"] [style*="mask-image"] {
      background-color: var(--lfm-accent) !important;
      color: var(--lfm-accent) !important;
    }

    /* Hide external link arrow on Discord card */
    a[href*="discord"] svg[class*="arrow"],
    a[href*="discord.gg"] svg[class*="arrow"] {
      display: none !important;
    }

    /* LEFT sidebar - selected item: accent on the lavender wash, both modes */
    /* Target links with bg-primary-light class (Mintlify's active state), and group buttons that are
       themselves the current page (e.g. "Liquid Foundation Models" on complete-library) */
    a[class*="bg-primary-light"],
    a[class*="bg-background-light"],
    #sidebar-content button[data-active-nav-item="true"] {
      color: var(--lfm-accent) !important;
      background-color: var(--lfm-accent-wash) !important;
    }

    /* Icon in selected sidebar item - use mask-image coloring */
    a[class*="bg-primary-light"] svg,
    a[class*="bg-background-light"] svg,
    #sidebar-content button[data-active-nav-item="true"] svg {
      color: var(--lfm-accent) !important;
    }

    /* For mask-image based icons, set background color */
    a[class*="bg-primary-light"] [class*="mask-"],
    a[class*="bg-background-light"] [class*="mask-"],
    a[class*="bg-primary-light"] [style*="mask-image"],
    a[class*="bg-background-light"] [style*="mask-image"] {
      background-color: var(--lfm-accent) !important;
    }

    /* Sidebar links and section rows: accent on hover */
    #sidebar-content li > a:hover,
    #sidebar-content li > button:hover {
      color: var(--lfm-accent) !important;
    }

    /* Fix container clipping issues */
    .mdx-content {
      contain: none !important;
      overflow: visible !important;
    }

    /* Code font - Liquid AI brand mono */
    code,
    pre,
    kbd,
    samp {
      font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace !important;
    }

    /* Typography scale - the only font sizes used across the site */
    :root {
      --lfm-fs-xs: 12px;
      --lfm-fs-sm: 13px;
      --lfm-fs-base: 15px;
      --lfm-fs-lg: 16px;
      --lfm-fs-xl: 20px;
      --lfm-fs-2xl: 28px;
    }

    /* Color tokens - liquid.ai palette: one violet accent on a zinc neutral scale.
       Use these instead of raw hex; .dark switches every token to its dark-mode value */
    :root {
      --lfm-accent: #7c3aed;
      --lfm-accent-wash: #f2ecff;
      --lfm-fg: #18181b;
      --lfm-fg-inverse: #fafafa;
      --lfm-muted: #71717a;
      --lfm-surface: #f4f4f5;
      --lfm-subtle: #fafafa;
      --lfm-border: #00000014;
      --lfm-border-strong: #0000001a;
      --lfm-success: #22c55e;
      --lfm-success-strong: #16a34a;
    }

    :root.dark {
      --lfm-accent: #ac8dff;
      --lfm-accent-wash: #2a1d4a;
      --lfm-fg: #fafafa;
      --lfm-fg-inverse: #0a0a0a;
      --lfm-muted: #a1a1aa;
      --lfm-surface: #27272a;
      --lfm-subtle: #18181b;
      --lfm-border: #ffffff21;
      --lfm-border-strong: #ffffff26;
      --lfm-success: #4ade80;
      --lfm-success-strong: #86efac;
    }

    /* Page header - title, description, section eyebrow */
    #page-title {
      font-size: var(--lfm-fs-2xl) !important;
      line-height: 1.25 !important;
    }

    #header .prose {
      font-size: var(--lfm-fs-lg) !important;
      line-height: 1.5 !important;
    }

    .eyebrow {
      font-size: var(--lfm-fs-sm) !important;
    }

    /* Page body - em-based prose spacing scales with this. Tabs and Accordions wrap
       their content in a nested .prose, which resets font-size to 1rem, so target them
       too. Scoped by component so callouts and card content keep their smaller sizes */
    #content.mdx-content,
    .mdx-content [data-component-part="tab-content"],
    .mdx-content [data-component-part="accordion-content"] {
      font-size: var(--lfm-fs-base) !important;
      line-height: 1.65 !important;
    }

    .mdx-content h2 {
      font-size: var(--lfm-fs-xl) !important;
      line-height: 1.3 !important;
    }

    .mdx-content h3 {
      font-size: var(--lfm-fs-lg) !important;
      line-height: 1.3 !important;
    }

    /* Inline code - slightly smaller than surrounding text (~14px in body copy) */
    .mdx-content code:not(pre code) {
      font-size: 0.93em !important;
    }

    /* Code blocks */
    pre {
      font-size: var(--lfm-fs-sm) !important;
      line-height: 1.6 !important;
    }

    /* Cards - scoped to .mdx-content to outrank the h2 rule (card titles are h2s) */
    .mdx-content [data-component-part="card-title"] {
      font-size: var(--lfm-fs-base) !important;
    }

    .mdx-content [data-component-part="card-content"] {
      font-size: var(--lfm-fs-sm) !important;
      line-height: 1.5 !important;
    }

    /* Left sidebar - collapsible groups (e.g. "Liquid Foundation Models") are buttons, not links */
    #navigation-items a,
    .sidebar-group button {
      font-size: var(--lfm-fs-sm) !important;
      line-height: 1.4 !important;
    }

    .sidebar-group-header {
      font-size: var(--lfm-fs-xs) !important;
    }

    /* Top navbar - tabs and links */
    .nav-tabs-item,
    .navbar-link a {
      font-size: var(--lfm-fs-sm) !important;
    }

    /* Right TOC */
    #table-of-contents {
      font-size: var(--lfm-fs-sm) !important;
      line-height: 1.5 !important;
    }

    #table-of-contents nav > h2 {
      font-size: var(--lfm-fs-xs) !important;
    }

    .lg\\:overflow-x-clip {
      overflow: visible !important;
    }

    /* Ensure the content container doesn't clip */
    body > div.antialiased {
      overflow: visible !important;
    }

    /* Panel styling - right-side custom TOC replacement (matches TOC width) */
    /* Hide panel on mobile/tablet where the right sidebar isn't visible */
    @media (max-width: 1279px) {
      .panel {
        display: none !important;
      }
    }

    .panel {
      width: 16.5rem !important;
      font-size: var(--lfm-fs-sm) !important;
    }

    /* Panel links - spacing and clickable styling */
    .panel ul {
      list-style: none !important;
      padding-left: 0 !important;
      margin: 0 !important;
    }

    .panel li {
      margin-bottom: 0.75rem !important;
    }

    .panel li a {
      text-decoration: none !important;
      color: inherit !important;
      font-weight: 600 !important;
      background-image: linear-gradient(var(--lfm-accent), var(--lfm-accent)) !important;
      background-size: calc(100% - 1.1em) 1px !important;
      background-position: left top 100% !important;
      background-repeat: no-repeat !important;
      padding-bottom: 3px !important;
      transition: color 0.15s ease, background-size 0.15s ease !important;
    }

    /* Arrow icon - grey by default */
    .panel li a::after {
      content: "↗" !important;
      font-size: 0.85em !important;
      color: var(--lfm-muted) !important;
      margin-left: 0.35em !important;
      transition: transform 0.15s ease, color 0.15s ease !important;
      display: inline-block !important;
    }

    /* Hover: text turns purple, underline thickens, arrow turns purple and jumps */
    .panel li a:hover {
      color: var(--lfm-accent) !important;
      background-size: calc(100% - 1.1em) 1.5px !important;
    }

    .panel li a:hover::after {
      color: var(--lfm-accent) !important;
      transform: translate(2px, -2px) !important;
    }

    /* Section header (eyebrow) - accent in both modes */
    .eyebrow {
      color: var(--lfm-accent) !important;
    }

    /* Use-case cards - compact 2x2 tiles on the zinc surface, no border */
    .use-cases .card-group {
      padding: 0 !important;
      row-gap: 0.5rem !important;
      column-gap: 0.5rem !important;
    }

    /* Card: remove margins, border, overflow-hidden; add grey bg + less rounding */
    .use-cases .card {
      margin: 0 !important;
      border: none !important;
      border-color: transparent !important;
      border-width: 0 !important;
      border-radius: 6px !important;
      background-color: var(--lfm-surface) !important;
      overflow: visible !important;
      --tw-ring-color: transparent !important;
      --tw-ring-offset-color: transparent !important;
      --tw-ring-shadow: none !important;
      box-shadow: none !important;
      outline: none !important;
    }

    /* Override internal card padding and layout - icon inline with title */
    .use-cases [data-component-part="card-content-container"] {
      padding: 0.7rem 0.9rem !important;
      display: grid !important;
      grid-template-columns: auto 1fr !important;
      align-items: start !important;
      column-gap: 0.45rem !important;
      row-gap: 0 !important;
    }

    /* Icon sizing - scale down from native h-6 w-6 to prevent mask clipping */
    .use-cases [data-component-part="card-icon"] {
      transform: scale(0.7) !important;
      transform-origin: left center !important;
      margin-right: -0.35rem !important;
    }

    .use-cases [data-component-part="card-icon"] svg {
      background-color: var(--lfm-muted) !important;
    }

    /* Title inline with icon */
    .use-cases [data-component-part="card-title"] {
      margin-top: 0 !important;
      color: var(--lfm-fg) !important;
    }

    /* Description text */
    .use-cases [data-component-part="card-content"] {
      margin-top: 0.25rem !important;
      color: var(--lfm-muted) !important;
      line-height: 1.35 !important;
    }

    /* Capabilities section - tighter spacing, uniform text color */
    .capabilities ul {
      margin: 0.5rem 0 !important;
    }

    .capabilities li {
      margin-bottom: 0.25rem !important;
    }

    .capabilities p,
    .capabilities li {
      color: inherit !important;
    }

    .capabilities strong {
      font-weight: 600 !important;
      color: inherit !important;
    }

    /* Global content links - accent underline with hover effect */
    /* Scope to main content area only, exclude navigation/sidebar/tables */
    article a:not([class*="block"]):not([aria-label="Navigate to header"]):not(table a):not(.back-button),
    [role="main"] a:not([class*="block"]):not([aria-label="Navigate to header"]):not(table a):not(.back-button),
    .prose a:not([class*="block"]):not([aria-label="Navigate to header"]):not(table a):not(.back-button) {
      text-decoration: none !important;
      color: inherit !important;
      font-weight: 600 !important;
      background-image: linear-gradient(var(--lfm-accent), var(--lfm-accent)) !important;
      background-size: 100% 1px !important;
      background-position: left top 100% !important;
      background-repeat: no-repeat !important;
      padding-bottom: 3px !important;
      transition: color 0.15s ease, background-size 0.15s ease !important;
    }

    article a:not([class*="block"]):not([aria-label="Navigate to header"]):not(table a):not(.back-button):hover,
    [role="main"] a:not([class*="block"]):not([aria-label="Navigate to header"]):not(table a):not(.back-button):hover,
    .prose a:not([class*="block"]):not([aria-label="Navigate to header"]):not(table a):not(.back-button):hover {
      color: var(--lfm-accent) !important;
      background-size: 100% 1.5px !important;
    }

    /* Heading permalink icons should not inherit prose-link underlines */
    article :is(h1, h2, h3, h4, h5, h6) a[href^="#"],
    [role="main"] :is(h1, h2, h3, h4, h5, h6) a[href^="#"],
    .prose :is(h1, h2, h3, h4, h5, h6) a[href^="#"],
    article a[href^="#"][aria-label*="link" i],
    [role="main"] a[href^="#"][aria-label*="link" i],
    .prose a[href^="#"][aria-label*="link" i] {
      background-image: none !important;
      background-size: 0 0 !important;
      padding-bottom: 0 !important;
      text-decoration: none !important;
    }

    /* Default table styling - applies to all tables */
    table {
      font-size: var(--lfm-fs-sm) !important;
      border-collapse: collapse !important;
      border-spacing: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 1em 0 !important;
      table-layout: auto !important;
    }

    table thead th {
      padding: 0.75rem 1rem !important;
      font-weight: 600 !important;
      text-align: left !important;
    }

    table tbody td {
      padding: 0.75rem 1rem !important;
      vertical-align: middle !important;
    }

    table tbody tr {
      border-bottom: 1px solid var(--lfm-border) !important;
    }

    /* API Spec tables (5 columns: Name, Type, Required, Default, Description) - ensure auto layout and proper spacing */
    /* Reset model table styles for tables that don't have 6 columns */
    table:not(:has(thead th:nth-child(6))) td,
    table:not(:has(thead th:nth-child(6))) th {
      width: auto !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
      text-align: left !important;
      padding: 0.75rem 1rem !important;
    }

    table:not(:has(thead th:nth-child(6))) {
      table-layout: auto !important;
    }

    /* Model table styling - only for tables with 6 columns (Model, HF, GGUF, MLX, ONNX, Trainable?) */

    table:has(thead th:nth-child(6):not(:nth-child(7))) {
      table-layout: fixed !important;
      margin: 0 !important;
    }

    /* First column - model names (only for 6-column tables) */
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:first-child,
    table:has(thead th:nth-child(6):not(:nth-child(7))) th:first-child {
      width: 45% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    /* Checkmark columns - equal width (only for 6-column tables) */
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:nth-child(2),
    table:has(thead th:nth-child(6):not(:nth-child(7))) th:nth-child(2),
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:nth-child(3),
    table:has(thead th:nth-child(6):not(:nth-child(7))) th:nth-child(3),
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:nth-child(4),
    table:has(thead th:nth-child(6):not(:nth-child(7))) th:nth-child(4),
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:nth-child(5),
    table:has(thead th:nth-child(6):not(:nth-child(7))) th:nth-child(5) {
      width: 8% !important;
      text-align: center !important;
      padding: 0.5rem 0 !important;
    }

    /* Last column - Trainable (only for 6-column tables) */
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:nth-child(6),
    table:has(thead th:nth-child(6):not(:nth-child(7))) th:nth-child(6) {
      width: 15% !important;
      text-align: center !important;
      padding: 0.5rem 0 !important;
      white-space: nowrap !important;
    }

    /* Table header - lavender wash with accent top border (only for 6-column tables) */
    table:has(thead th:nth-child(6):not(:nth-child(7))) thead tr {
      background: var(--lfm-accent-wash) !important;
      border-top: 3px solid var(--lfm-accent) !important;
    }

    table:has(thead th:nth-child(6):not(:nth-child(7))) thead th {
      color: var(--lfm-fg) !important;
    }

    /* Section header rows with bold text - lavender wash like header (only for 6-column tables) */
    table:has(thead th:nth-child(6):not(:nth-child(7))) tbody tr:has(td:first-child strong) {
      background: var(--lfm-accent-wash) !important;
    }

    /* Sub-section rows (LFM2.5 Models, LFM2 Models labels) - zinc surface, muted label (only for 6-column tables) */
    table:has(thead th:nth-child(6):not(:nth-child(7))) tbody tr:has(td:nth-child(2):empty):not(:has(strong)) {
      background-color: var(--lfm-surface) !important;
    }

    table:has(thead th:nth-child(6):not(:nth-child(7))) tbody tr:has(td:nth-child(2):empty):not(:has(strong)) td {
      background-color: var(--lfm-surface) !important;
      padding: 0.35rem 0.5rem !important;
    }

    table:has(thead th:nth-child(6):not(:nth-child(7))) tbody tr:has(td:nth-child(2):empty):not(:has(strong)) td:first-child {
      text-align: left !important;
      font-size: var(--lfm-fs-xs) !important;
      color: var(--lfm-muted) !important;
      padding-left: 1rem !important;
    }

    /* Model overview table with Family column - only for 7-column tables */
    table:has(thead th:nth-child(7):not(:nth-child(8))) {
      table-layout: fixed !important;
      margin: 0 !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) td:first-child,
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:first-child {
      width: 30% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) td:nth-child(2),
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:nth-child(2) {
      width: 18% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) td:nth-child(3),
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:nth-child(3),
    table:has(thead th:nth-child(7):not(:nth-child(8))) td:nth-child(4),
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:nth-child(4),
    table:has(thead th:nth-child(7):not(:nth-child(8))) td:nth-child(5),
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:nth-child(5),
    table:has(thead th:nth-child(7):not(:nth-child(8))) td:nth-child(6),
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:nth-child(6) {
      width: 8% !important;
      text-align: center !important;
      padding: 0.5rem 0 !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) td:nth-child(7),
    table:has(thead th:nth-child(7):not(:nth-child(8))) th:nth-child(7) {
      width: 20% !important;
      text-align: center !important;
      padding: 0.5rem 0 !important;
      white-space: nowrap !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) thead tr {
      background: var(--lfm-accent-wash) !important;
      border-top: 3px solid var(--lfm-accent) !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) thead th {
      color: var(--lfm-fg) !important;
    }

    table:has(thead th:nth-child(7):not(:nth-child(8))) tbody tr:has(td:first-child strong) {
      background: var(--lfm-accent-wash) !important;
    }

    /* Table links (checkmarks) - green (semantic "available"), no underline */
    table a {
      text-decoration: none !important;
      background-image: none !important;
      font-weight: normal !important;
      padding-bottom: 0 !important;
      color: var(--lfm-success) !important;
      padding: 0.35rem 0.5rem !important;
      border-radius: 6px !important;
      transition: background-color 0.15s ease !important;
    }

    table a:hover {
      color: var(--lfm-success-strong) !important;
      background-image: none !important;
      background-color: color-mix(in srgb, var(--lfm-success) 15%, transparent) !important;
    }

    /* Checkmark cells in model tables - drop Mintlify's accent link underline under the green mark */
    table:has(thead th:nth-child(6)) td:not(:first-child) a {
      border-bottom: 0 !important;
    }

    /* Model name links (first column) - subtle text, no underline, just hover effect */
    table:has(thead th:nth-child(6):not(:nth-child(7))) td:first-child a,
    table:has(thead th:nth-child(7):not(:nth-child(8))) td:first-child a {
      color: inherit !important;
      font-weight: 500 !important;
      padding: 0.25rem 0.4rem !important;
      margin: -0.25rem -0.4rem !important;
      border-radius: 4px !important;
      background-image: none !important;
      text-decoration: none !important;
      transition: background-color 0.15s ease, color 0.15s ease !important;
    }

    table:has(thead th:nth-child(6):not(:nth-child(7))) td:first-child a:hover,
    table:has(thead th:nth-child(7):not(:nth-child(8))) td:first-child a:hover {
      color: var(--lfm-accent) !important;
      background-color: var(--lfm-accent-wash) !important;
      background-image: none !important;
    }

    /* Normal table links - match model-name link treatment, not green checkmarks. */
    table:not(:has(thead th:nth-child(6))) a {
      display: inline-block !important;
      color: inherit !important;
      font-weight: 500 !important;
      line-height: 1.25 !important;
      padding: 0.2rem 0.35rem !important;
      margin: 0.05rem 0.1rem 0.05rem -0.35rem !important;
      border-radius: 4px !important;
      background-image: none !important;
      background-color: transparent !important;
      border-bottom: 0 !important;
      box-shadow: 0 1px 0 var(--lfm-accent) !important;
      text-decoration: none !important;
      text-decoration-line: none !important;
      transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease !important;
    }

    table:not(:has(thead th:nth-child(6))) a:hover {
      color: var(--lfm-accent) !important;
      background-color: var(--lfm-accent-wash) !important;
      background-image: none !important;
      box-shadow: 0 1.5px 0 var(--lfm-accent) !important;
    }

    /* Code block styling - ensure visible background contrast */
    /* Inline code */
    code:not(pre code) {
      background-color: var(--lfm-subtle) !important;
      border: 1px solid var(--lfm-border-strong) !important;
      border-radius: 4px !important;
      padding: 0.15em 0.4em !important;
    }

    .dark code:not(pre code) {
      background-color: var(--lfm-surface) !important;
    }

    /* Fenced code blocks */
    /* Target the code block wrapper container */
    .code-block-background,
    [class*="code-block"] > div {
      background-color: var(--lfm-subtle) !important;
    }

    /* Hide the right-side fade gradient overlay in code blocks */
    /* The gradient overlay is a direct child div with no class attribute */
    [class*="code-block"].group > div:not([class]):last-child {
      display: none !important;
    }

    pre,
    pre.shiki,
    .shiki {
      background-color: var(--lfm-subtle) !important;
      border-radius: 8px !important;
    }

    pre code,
    .shiki code {
      background-color: transparent !important;
      border: none !important;
      color: var(--lfm-fg) !important;
    }

    /* Colab badge styling */
    .colab-link a {
      background-image: none !important;
      padding-bottom: 0 !important;
    }

    .colab-link img {
      height: 28px !important;
      width: auto !important;
    }

    /* Tab styling - accent underline for selected tabs */
    /* The inner div uses text-primary with border-current, so we override the color */
    [role="tab"][aria-selected="true"] > div {
      color: var(--lfm-accent) !important;
    }

    /* Main nav tabs - accent underline for the active tab */
    /* The underline is an inner div with bg-primary (light mode) / bg-primary-light (dark mode) */
    .nav-tabs-item > div[class*="bg-primary"] {
      background-color: var(--lfm-accent) !important;
    }

    /* TOC (Table of Contents) - accent for the active section */
    /* Active TOC links have the text-primary class */
    .toc-item a[class*="text-primary"] {
      color: var(--lfm-accent) !important;
    }

    /* Format buttons for model pages */
    .format-buttons {
      display: flex !important;
      gap: 0.5rem !important;
      flex-wrap: wrap !important;
      margin: 0.5rem 0 1.5rem 0 !important;
    }

    .format-buttons a {
      display: inline-block !important;
      padding: 0.35rem 0.7rem !important;
      border-radius: 4px !important;
      font-size: var(--lfm-fs-sm) !important;
      font-weight: 600 !important;
      text-decoration: none !important;
      background-image: none !important;
    }

    .format-buttons a:hover {
      background-image: none !important;
      filter: brightness(0.95) !important;
    }

    /* HF button - orange */
    .format-buttons a.btn-hf,
    .format-buttons a.btn-hf:hover,
    .format-buttons a.btn-hf:visited {
      background-color: #fbbf24 !important;
      color: #000000 !important;
    }

    /* GGUF button - blue */
    .format-buttons a.btn-gguf,
    .format-buttons a.btn-gguf:hover,
    .format-buttons a.btn-gguf:visited {
      background-color: #60a5fa !important;
      color: #000000 !important;
    }

    /* MLX button - purple */
    .format-buttons a.btn-mlx,
    .format-buttons a.btn-mlx:hover,
    .format-buttons a.btn-mlx:visited {
      background-color: #c4b5fd !important;
      color: #000000 !important;
    }

    /* ONNX button - green */
    .format-buttons a.btn-onnx,
    .format-buttons a.btn-onnx:hover,
    .format-buttons a.btn-onnx:visited {
      background-color: #86efac !important;
      color: #000000 !important;
    }

    /* Back button for model pages */
    .back-button {
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.25rem !important;
      margin-bottom: 0.75rem !important;
      font-size: var(--lfm-fs-sm) !important;
      font-weight: 500 !important;
      color: var(--lfm-muted) !important;
      text-decoration: none !important;
      background-image: none !important;
      border-bottom: 0 !important;
    }

    .back-button:hover {
      color: var(--lfm-accent) !important;
      background-image: none !important;
    }

    /* Arrow icon for internal model card links - matches Mintlify's external link arrow */
    .card-group a[href^="/docs/models/"]:not([href*="text-models"]):not([href*="vision-models"]):not([href*="audio-models"]):not([href*="liquid-nanos"]):not([href*="complete-library"]) {
      position: relative !important;
    }

    .card-group a[href^="/docs/models/"]:not([href*="text-models"]):not([href*="vision-models"]):not([href*="audio-models"]):not([href*="liquid-nanos"]):not([href*="complete-library"])::before {
      content: "" !important;
      position: absolute !important;
      top: 0.875rem !important;
      right: 0.875rem !important;
      width: 0.875rem !important;
      height: 0.875rem !important;
      background-color: var(--lfm-muted) !important;
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25'/%3E%3C/svg%3E") !important;
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25'/%3E%3C/svg%3E") !important;
      -webkit-mask-size: contain !important;
      mask-size: contain !important;
      -webkit-mask-repeat: no-repeat !important;
      mask-repeat: no-repeat !important;
      transition: background-color 0.15s ease !important;
    }

    .card-group a[href^="/docs/models/"]:not([href*="text-models"]):not([href*="vision-models"]):not([href*="audio-models"]):not([href*="liquid-nanos"]):not([href*="complete-library"]):hover::before {
      background-color: var(--lfm-accent) !important;
    }

    /* ---- Dev-mode only extras (not in style.css) ---- */

    /* Fix sidebar anchor icons visibility (About Us, Blog) */
    /* The icons use mask-image which may not load in local dev */
    a[href*="liquid.ai/company"] svg.secondary-opacity {
      opacity: 1 !important;
    }

    /* Offset the card-group padding so cards stay aligned with the text column */
    .card-group {
      margin: -4px !important;
    }

    [class*="overflow-x-clip"],
    [class*="overflow-clip"] {
      overflow: visible !important;
    }

    /* Article container fix */
    article, article > div {
      overflow: visible !important;
    }

    /* Colab button sizing */
    a[href*="colab.research.google.com"] img,
    img[alt*="Colab"],
    img[alt*="colab"] {
      height: 28px !important;
      width: auto !important;
    }

  `;
  document.head.appendChild(style);
})();
