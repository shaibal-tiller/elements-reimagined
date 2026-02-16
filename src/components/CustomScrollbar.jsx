import { Scrollbars } from 'react-custom-scrollbars-2';
import { useState, useEffect, useRef, useCallback } from 'react';

const CustomScrollbar = ({ children, className = '' }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeout = useRef(null);
  const fadeTimeout = useRef(null);
  const scrollbarRef = useRef(null);

  // --- Smooth inertia scroll ---
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const rafId = useRef(null);
  const isAnimating = useRef(false);

  // Easing factor: higher = snappier response, lower = smoother glide
  const EASE = 0.12;
  // Multiplier for wheel delta: >1 = more travel per scroll tick
  const SCROLL_MULTIPLIER = 1.0;

  const animateScroll = useCallback(() => {
    const diff = targetScroll.current - currentScroll.current;

    // Stop when close enough
    if (Math.abs(diff) < 0.5) {
      currentScroll.current = targetScroll.current;
      if (scrollbarRef.current) {
        scrollbarRef.current.scrollTop(currentScroll.current);
      }
      isAnimating.current = false;
      return;
    }

    currentScroll.current += diff * EASE;
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollTop(currentScroll.current);
    }

    rafId.current = requestAnimationFrame(animateScroll);
  }, []);

  const startAnimation = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      rafId.current = requestAnimationFrame(animateScroll);
    }
  }, [animateScroll]);

  // Intercept wheel events for smooth inertia
  useEffect(() => {
    const container = scrollbarRef.current;
    if (!container) return;

    // The actual scrollable element inside react-custom-scrollbars
    const viewEl = container.view;
    if (!viewEl) return;

    const handleWheel = (e) => {
      // Skip if event originates from inside a fixed overlay (modal, lightbox, etc.)
      if (e.target.closest('[data-overlay], [role="dialog"]')) return;

      e.preventDefault();

      const maxScroll = viewEl.scrollHeight - viewEl.clientHeight;
      const delta = e.deltaY * SCROLL_MULTIPLIER;

      // Sync current position in case user grabbed the scrollbar thumb
      currentScroll.current = viewEl.scrollTop;

      targetScroll.current = Math.max(
        0,
        Math.min(maxScroll, targetScroll.current + delta)
      );

      startAnimation();
    };

    viewEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewEl.removeEventListener('wheel', handleWheel);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [startAnimation]);

  // Sync target when scrollbar is used directly (thumb drag, keyboard, etc.)
  const handleScroll = () => {
    if (scrollbarRef.current && !isAnimating.current) {
      const pos = scrollbarRef.current.getScrollTop();
      targetScroll.current = pos;
      currentScroll.current = pos;
    }

    // Scrollbar visibility logic
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);

    if (!isVisible) setIsVisible(true);
    setIsScrolling(true);

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      fadeTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: '#afb42b',
      borderRadius: '6px',
      cursor: 'pointer',
      opacity: isScrolling ? 1 : isVisible ? 0.7 : 0,
      transition: 'opacity 300ms ease-in-out',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderTrack = ({ style, ...props }) => {
    const trackStyle = {
      right: '2px',
      bottom: '2px',
      top: '2px',
      borderRadius: '6px',
      width: '3px',
      zIndex: '99999',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 300ms ease-in-out',
    };
    return <div style={{ ...style, ...trackStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => (
    <div style={style} {...props} data-scroll-container="true" />
  );

  return (
    <Scrollbars
      ref={scrollbarRef}
      onScroll={handleScroll}
      renderThumbVertical={renderThumb}
      renderTrackVertical={renderTrack}
      renderView={renderView}
      autoHide={false}
      className={className}
      style={{ width: '100%', height: '100vh' }}
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;
