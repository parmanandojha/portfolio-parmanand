import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  initCursorAnimations, 
  handleCursorHover, 
  handleCursorClick, 
  cleanupAnimation 
} from "../animations/index";

const Cursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const cursorTextRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isClicking, setIsClicking] = useState(false);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const cursorText = cursorTextRef.current;
    
    if (!cursor || !follower || !cursorText) return;
    
    // Initialize cursor animations using our animation module
    const { updateMousePos, ticker } = initCursorAnimations({
      cursor, 
      follower, 
      cursorText
    });
    
    // Mouse move event listener
    const handleMouseMove = (e) => {
      updateMousePos(e.clientX, e.clientY);
    };
    
    // Mouse down/up event listeners
    const handleMouseDown = (e) => {
      updateMousePos(e.clientX, e.clientY);
      setIsClicking(true);
      
      // Handle click animation
      handleCursorClick(follower, true);
    };
    
    const handleMouseUp = (e) => {
      updateMousePos(e.clientX, e.clientY);
      setIsClicking(false);
      
      // Handle click release animation
      handleCursorClick(follower, false);
    };
    
    // Set up hover detection for clickable elements
    const setupHoverElements = () => {
      // Elements that should trigger hover effect
      const hoverTargets = document.querySelectorAll('a, button, .image-container, [data-cursor]');
      
      hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
          setIsHovering(true);
          
          // Get custom text if available
          const textAttr = target.getAttribute('data-cursor-text');
          const hoverText = textAttr || (target.classList.contains('image-container') ? "View" : "");
          
          setCursorText(hoverText);
          
          // Determine element type for styling
          let type = 'default';
          if (target.tagName.toLowerCase() === 'a') {
            type = 'link';
          } else if (target.tagName.toLowerCase() === 'button') {
            type = 'button';
          } else if (target.classList.contains('image-container')) {
            type = 'image';
          }
          
          // Handle hover animation
          handleCursorHover(follower, cursorText, isClicking, hoverText, type);
        });
        
        target.addEventListener('mouseleave', () => {
          setIsHovering(false);
          setCursorText("");
          
          // Reset hover animation
          handleCursorHover(follower, cursorText, isClicking, "", "default");
        });
      });
    };
    
    // Handle cursor-update events dispatched from App component
    const handleCursorUpdate = (e) => {
      const { type, text } = e.detail;
      
      setCursorText(text || "");
      setIsHovering(true);
      
      // Handle hover animation
      handleCursorHover(follower, cursorText, isClicking, text, type);
    };
    
    const handleCursorReset = () => {
      setIsHovering(false);
      setCursorText("");
      
      // Reset hover animation
      handleCursorHover(follower, cursorText, isClicking, "", "default");
    };
    
    // Initial setup
    setupHoverElements();
    
    // Recalculate on window resize
    window.addEventListener('resize', setupHoverElements);
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('cursor-update', handleCursorUpdate);
    document.addEventListener('cursor-reset', handleCursorReset);
    
    // Add mutation observer to handle dynamically added elements
    const observer = new MutationObserver(mutations => {
      setupHoverElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('cursor-update', handleCursorUpdate);
      document.removeEventListener('cursor-reset', handleCursorReset);
      window.removeEventListener('resize', setupHoverElements);
      observer.disconnect();
      document.body.style.cursor = 'auto';
      
      // Clean up ticker
      if (ticker) {
        gsap.ticker.remove(ticker);
      }
    };
  }, []);
  
  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="cursor-dot fixed pointer-events-none z-[999999]"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          opacity: isClicking ? 0.5 : 1,
          transform: isClicking ? 'scale(0.7)' : 'scale(1)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}
      />
      
      {/* Follower circle */}
      <div
        ref={followerRef}
        className={`cursor-follower fixed pointer-events-none z-[999998] ${isHovering ? 'hovered' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 0, 0, 0.6)',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          transformOrigin: 'center center',
          transition: 'background-color 0.3s, border-color 0.3s',
          backdropFilter: 'blur(1px)'
        }}
      />
      
      {/* Text that appears on certain interactions */}
      <div
        ref={cursorTextRef}
        className="cursor-text fixed pointer-events-none z-[999997] flex items-center justify-center"
        style={{
          fontWeight: '600',
          fontSize: '12px',
          textShadow: '0 0 2px rgba(255, 255, 255, 0.6)'
        }}
      >
        {cursorText}
      </div>
    </>
  );
};

export default Cursor;