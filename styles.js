// Custom styles for Liquid AI Documentation
// Injected via JS since CSS files aren't auto-loaded in Mintlify dev

(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Discord navbar link styling - dim the icon to match GitHub */
    /* The icon uses SVG with mask-image, color is set via background */
    a[href*="discord.gg"] svg,
    a[href*="discord"] svg {
      background-color: #9ca3af !important; /* gray-400 equivalent - more muted */
    }

    /* Increase gap between Discord icon and text to match GitHub (gap-2 = 8px) */
    nav a[href*="discord.gg"],
    nav a[href*="discord"] {
      gap: 0.5rem !important; /* 8px to match GitHub's gap-2 */
    }

    /* Dark mode - slightly dimmer than default */
    .dark a[href*="discord.gg"] svg,
    .dark a[href*="discord"] svg {
      background-color: #9ca3af !important;
    }

    /* Hover state - turn purple accent color */
    a[href*="discord.gg"]:hover,
    a[href*="discord"]:hover {
      color: #864bc4 !important;
    }

    a[href*="discord.gg"]:hover svg,
    a[href*="discord"]:hover svg {
      background-color: #864bc4 !important;
    }

    /* Fix sidebar anchor icons visibility (About Us, Blog) */
    /* The icons use mask-image which may not load in local dev */
    a[href*="liquid.ai/company"] svg.secondary-opacity {
      opacity: 1 !important;
    }

    /* Fix card border clipping - add space around card groups */
    .card-group {
      overflow: visible !important;
      contain: none !important;
      padding: 4px !important;
      margin: -4px !important;
    }

    /* Fix container clipping */
    .mdx-content {
      contain: none !important;
      overflow: visible !important;
    }

    [class*="overflow-x-clip"],
    [class*="overflow-clip"] {
      overflow: visible !important;
    }

    /* Article container fix */
    article, article > div {
      overflow: visible !important;
    }

    /* Ensure consistent card borders */
    .card-group a[class*="block"][class*="border"] {
      border-width: 2.5px !important;
    }

    /* Purple accent border and arrow on HOVER only in light mode */
    :root:not(.dark) .card-group a[class*="block"][class*="border"]:hover {
      border-color: #864bc4 !important;
    }

    :root:not(.dark) .card-group a[class*="block"]:hover svg {
      color: #864bc4 !important;
    }

    /* Card icons - purple accent color in light mode (default state) */
    /* Only target the main icon, not the arrow icon (which contains "arrow" in class) */
    :root:not(.dark) .card-group a[class*="block"] svg:not([class*="arrow"]) {
      background-color: #864bc4 !important;
    }

    /* Hide external link arrow on Discord card */
    a[href*="discord"] svg[class*="arrow"],
    a[href*="discord.gg"] svg[class*="arrow"] {
      display: none !important;
    }

    /* Light mode LEFT sidebar - selected item styling */
    /* Target links with bg-primary-light class (Mintlify's active state) */
    :root:not(.dark) a[class*="bg-primary-light"],
    :root:not(.dark) a[class*="bg-background-light"] {
      color: #864bc4 !important;
      background-color: rgba(134, 75, 196, 0.1) !important;
    }

    /* Icon in selected sidebar item - use mask-image coloring */
    :root:not(.dark) a[class*="bg-primary-light"] svg,
    :root:not(.dark) a[class*="bg-background-light"] svg {
      color: #864bc4 !important;
    }

    /* For mask-image based icons, set background color */
    :root:not(.dark) a[class*="bg-primary-light"] [class*="mask-"],
    :root:not(.dark) a[class*="bg-background-light"] [class*="mask-"],
    :root:not(.dark) a[class*="bg-primary-light"] [style*="mask-image"],
    :root:not(.dark) a[class*="bg-background-light"] [style*="mask-image"] {
      background-color: #864bc4 !important;
    }

    /* Code block styling - ensure visible background contrast */
    /* Inline code */
    :root:not(.dark) code:not(pre code) {
      background-color: #f9fafb !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 4px !important;
      padding: 0.15em 0.4em !important;
    }

    .dark code:not(pre code) {
      background-color: #374151 !important;
      border: 1px solid #4b5563 !important;
      border-radius: 4px !important;
      padding: 0.15em 0.4em !important;
    }

    /* Fenced code blocks */
    /* Target the code block wrapper container */
    :root:not(.dark) .code-block-background,
    :root:not(.dark) [class*="code-block"] > div {
      background-color: #f9fafb !important;
    }

    /* Hide the right-side fade gradient overlay in code blocks */
    /* The gradient overlay is a direct child div with no class attribute */
    [class*="code-block"].group > div:not([class]):last-child {
      display: none !important;
    }

    :root:not(.dark) pre,
    :root:not(.dark) pre.shiki,
    :root:not(.dark) .shiki {
      background-color: #f9fafb !important;
      border-radius: 8px !important;
    }

    :root:not(.dark) pre code,
    :root:not(.dark) .shiki code {
      background-color: transparent !important;
      border: none !important;
      color: #1f2937 !important;
    }

    .dark pre {
      background-color: #374151 !important;
      border-radius: 8px !important;
    }

    .dark pre code {
      background-color: transparent !important;
      border: none !important;
      color: #e5e7eb !important;
    }

    /* Make Colab button images much smaller */
    a[href*="colab.research.google.com"] img,
    img[alt*="Colab"],
    img[alt*="colab"] {
      height: 20px !important;
      width: auto !important;
      max-width: 120px !important;
    }

  `;
  document.head.appendChild(style);
})();
