// Brief visual acknowledgement on Mintlify's native feedback buttons.
// This confirms a click, not successful delivery to analytics.
(function() {
  const buttonSelector = '#feedback-thumbs-up, #feedback-thumbs-down';
  const acknowledgementAttribute = 'data-lfm-feedback-acknowledged';
  let activeButton;
  let resetTimer;

  function resetAcknowledgement() {
    clearTimeout(resetTimer);
    activeButton?.removeAttribute(acknowledgementAttribute);
    activeButton = undefined;
  }

  // Document-level delegation keeps working when Mintlify swaps page content.
  document.addEventListener('click', function(event) {
    const button = event.target instanceof Element
      ? event.target.closest(buttonSelector)
      : null;
    if (!button || button.disabled || event.defaultPrevented) return;

    resetAcknowledgement();
    activeButton = button;
    button.setAttribute(acknowledgementAttribute, '');
    resetTimer = setTimeout(resetAcknowledgement, 2000);
  });

  window.addEventListener('mintlify:navigate', resetAcknowledgement);
})();
