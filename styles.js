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

    /* Fix card hover border/ring being cut off */
    /* The mdx-content has contain:inline-size which clips card hover effects */
    .mdx-content {
      contain: none !important;
    }

    /* Parent container has overflow-x-clip that clips bottom border */
    [class*="overflow-x-clip"] {
      overflow: visible !important;
    }

    /* Ensure card groups don't clip */
    .card-group {
      overflow: visible !important;
      contain: none !important;
      padding-bottom: 4px !important;
    }

    /* Ensure cards themselves don't clip */
    .card {
      overflow: visible !important;
    }
  `;
  document.head.appendChild(style);
})();
