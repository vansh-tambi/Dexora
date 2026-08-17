import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only activate cursor if the device has a fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setEnabled(mediaQuery.matches);

    const handleQueryChange = (e: MediaQueryListEvent) => {
      setEnabled(e.matches);
    };

    mediaQuery.addEventListener('change', handleQueryChange);
    return () => mediaQuery.removeEventListener('change', handleQueryChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Add global class to hide default cursor
    document.body.classList.add('custom-cursor-active');

    let isHovered = false;
    let isHidden = true;
    let rAFId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (isHidden) {
        isHidden = false;
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '1';
        }
      }

      // Check if cursor is over interactive or text input elements
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, [role="button"], select, summary, [type="submit"]');
      const isTextInput = !!target.closest('input, textarea, [contenteditable]');

      if (cursorRef.current) {
        // Completely hide the custom cursor on text inputs to let native caret shine
        if (isTextInput) {
          cursorRef.current.style.opacity = '0';
        } else {
          cursorRef.current.style.opacity = '1';
        }

        // Hover scale toggle
        if (isInteractive !== isHovered) {
          isHovered = isInteractive;
          if (isHovered) {
            cursorRef.current.classList.add('cursor-hover');
          } else {
            cursorRef.current.classList.remove('cursor-hover');
          }
        }
      }

      // 1:1 Instant hardware tracking without lerp delay
      if (rAFId) {
        cancelAnimationFrame(rAFId);
      }

      rAFId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${mouseX - 12}px, ${mouseY - 12}px, 0)`;
        }
      });
    };

    const onMouseDown = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.add('cursor-active');
      }
    };

    const onMouseUp = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.remove('cursor-active');
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const onMouseEnter = () => {
      if (cursorRef.current && !isHidden) {
        cursorRef.current.style.opacity = '1';
      }
    };

    // Listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Clean up
    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rAFId) {
        cancelAnimationFrame(rAFId);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-container"
      aria-hidden="true"
    >
      {/* Inline styles for 1:1 instant tracking */}
      <style>{`
        .custom-cursor-container {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          will-change: transform, opacity;
          transition: opacity 0.2s ease;
        }

        .custom-cursor-inner {
          transition: transform 0.15s ease-out;
          filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.25));
        }

        @media (prefers-reduced-motion: no-preference) {
          .cursor-hover .custom-cursor-inner {
            transform: scale(1.22) rotate(15deg);
          }
          .cursor-active .custom-cursor-inner {
            transform: scale(0.85) rotate(-8deg);
          }
        }
      `}</style>

      {/* Pokéball Cursor Graphic */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="24"
        height="24"
        className="custom-cursor-inner"
      >
        <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#0F172A" strokeWidth="8" />
        <path d="M 8 50 A 42 42 0 0 1 92 50 Z" fill="#E63946" stroke="#0F172A" strokeWidth="4" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#0F172A" strokeWidth="8" />
        <circle cx="50" cy="50" r="16" fill="#0F172A" />
        <circle cx="50" cy="50" r="8" fill="#FFF8EC" />
      </svg>
    </div>
  );
}
