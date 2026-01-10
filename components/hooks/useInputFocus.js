import { useEffect, useRef } from 'react';

// Hook to handle input focus/label animation for styled inputs
export function useInputFocus() {
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current || input?.closest('.input, .select');
    
    if (!input || !container) return;

    const updateFocusState = () => {
      const hasValue = input.value && input.value.trim() !== '';
      const isFocused = document.activeElement === input;
      
      if (hasValue || isFocused) {
        container.setAttribute('data-input', 'focus');
      } else {
        container.removeAttribute('data-input');
      }
    };

    // Check initial state
    updateFocusState();

    // Listen to input events
    input.addEventListener('input', updateFocusState);
    input.addEventListener('focus', updateFocusState);
    input.addEventListener('blur', updateFocusState);

    return () => {
      input.removeEventListener('input', updateFocusState);
      input.removeEventListener('focus', updateFocusState);
      input.removeEventListener('blur', updateFocusState);
    };
  }, []);

  return { inputRef, containerRef };
}

