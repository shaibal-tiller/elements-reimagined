import { Scrollbars } from 'react-custom-scrollbars-2';
import { useState, useEffect, useRef } from 'react';


const CustomScrollbar = ({ children, className = '' }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeout = useRef(null);
  const fadeTimeout = useRef(null);
   // ✅ smooth + momentum scroll

  const handleScroll = () => {
    // Clear existing timeouts
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);

    // Show scrollbar
    if (!isVisible) {
      setIsVisible(true);
    }
    setIsScrolling(true);

    // Hide scrollbar after 750ms of no scrolling
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      fadeTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Duration of fade out animation
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, []);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: '#afb42b', // Yellow color (Tailwind yellow-400)
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
      zIndex:"99999",
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 300ms ease-in-out',
    };
    return <div style={{ ...style, ...trackStyle }} {...props} />;
  };

  return (
    <Scrollbars
      onScroll={handleScroll}
      renderThumbVertical={renderThumb}
      renderTrackVertical={renderTrack}
      autoHide={false}
      className={className}
      style={{ width: '100%', height: '100vh' }}
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;