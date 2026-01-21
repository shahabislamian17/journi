// Global script to handle input focus/label animation for all forms
(function() {
  'use strict';

  function checkIfAutofilled(input) {
    // Check various ways browsers indicate autofill
    if (!input) return false;
    
    // Method 1: Check if browser added autofill classes/styles using matches
    try {
      if (input.matches && (input.matches(':-webkit-autofill') || input.matches(':autofill'))) {
        return true;
      }
    } catch(e) {}
    
    // We intentionally do NOT use custom data attributes (data-autofilled / data-user-typed)
    // to avoid polluting input elements with extra attributes.
    return false;
  }

  function updateInputFocusState(input) {
    const container = input.closest('.input, .select');
    if (!container) return;

    // Check if input is autofilled (browser autofill)
    const inputIsAutofilled = checkIfAutofilled(input);

    // For select elements, check if a value is selected (not empty and not the placeholder)
    let hasValue = false;
    if (input.tagName === 'SELECT') {
      // Check if a real option is selected (not the first empty/placeholder option)
      hasValue = input.value && input.value.trim() !== '' && input.selectedIndex > 0;
      // Also check if the select has the required attribute and a value
      if (!hasValue && input.value && input.value.trim() !== '') {
        hasValue = true;
      }
    } else {
      hasValue = input.value && input.value.trim() !== '';
    }
    
    const isFocused = document.activeElement === input;

    if (hasValue || isFocused || inputIsAutofilled) {
      container.setAttribute('data-input', 'focus');
      // Don't add inline styles - let CSS handle padding
      // CSS rules in style.css handle padding for selects with labels
    } else {
      // Only remove if not focused
      if (!isFocused) {
        container.removeAttribute('data-input');
        // Also ensure we don't leave any stale custom attributes
        container.removeAttribute('data-autofilled');
        if (input.dataset) {
          delete input.dataset.autofilled;
          delete input.dataset.userTyped;
        }
        // Don't manipulate inline styles - CSS handles everything
      }
    }
  }

  function initializeInputs() {
    // Find all inputs and selects in forms
    const inputs = document.querySelectorAll('.input input, .select select, .textarea textarea');
    
    inputs.forEach(function(input) {
      // Clean any existing custom data attributes added previously
      if (input.dataset) {
        delete input.dataset.autofilled;
        delete input.dataset.userTyped;
      }
      const container = input.closest('.input, .select');
      if (container) {
        container.removeAttribute('data-autofilled');
      }

      // Check initial state
      updateInputFocusState(input);

      // Add event listeners
      input.addEventListener('input', function() {
        updateInputFocusState(input);
      });

      input.addEventListener('focus', function() {
        updateInputFocusState(input);
      });

      input.addEventListener('blur', function() {
        updateInputFocusState(input);
      });

      // Check for autofill after delays (autofill happens asynchronously)
      setTimeout(function() {
        updateInputFocusState(input);
      }, 100);
      
      setTimeout(function() {
        updateInputFocusState(input);
      }, 500);
      
      setTimeout(function() {
        updateInputFocusState(input);
      }, 1000);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInputs);
  } else {
    initializeInputs();
  }

  // Also initialize after a short delay to catch dynamically added inputs
  setTimeout(initializeInputs, 100);
  setTimeout(initializeInputs, 500);
  setTimeout(initializeInputs, 1000);

  // Watch for dynamically added inputs (for React components)
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldReinit = false;
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              // Check if it's an input or contains inputs
              if (node.matches && (node.matches('input, select, textarea') || node.querySelector('input, select, textarea'))) {
                shouldReinit = true;
              }
            }
          });
        }
      });
      if (shouldReinit) {
        setTimeout(initializeInputs, 50);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();

