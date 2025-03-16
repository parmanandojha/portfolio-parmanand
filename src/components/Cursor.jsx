import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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
    
    // Initial setup
    gsap.set(cursor, { 
      xPercent: -50, 
      yPercent: -50,
      force3D: true // Force 3D acceleration
    });
    gsap.set(follower, { 
      xPercent: -50, 
      yPercent: -50,
      scale: 1,
      force3D: true // Force 3D acceleration
    });
    gsap.set(cursorText, { 
      xPercent: -50, 
      yPercent: -50, 
      autoAlpha: 0,
      force3D: true // Force 3D acceleration
    });
    
    // Variables for cursor movement
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.35;
    
    // Update mouse position
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");
    
    // Update follower position with smoothing - using translate3d for better performance
    const xFollow = gsap.quickSetter(follower, "x", "px");
    const yFollow = gsap.quickSetter(follower, "y", "px");
    
    // Update text position (follows the follower)
    const xText = gsap.quickSetter(cursorText, "x", "px");
    const yText = gsap.quickSetter(cursorText, "y", "px");
    
    // Animation loop for smooth following
    gsap.ticker.add(() => {
      // Calculate new position with easing
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      
      // Update follower and text positions with translate3d for better performance
      xFollow(pos.x);
      yFollow(pos.y);
      
      // Cursor position is exact mouse position (no smoothing)
      xSet(mouse.x);
      ySet(mouse.y);
      
      // Text follows the follower exactly
      xText(pos.x);
      yText(pos.y);
    });
    
    // Mouse move event listener
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    // Mouse down/up event listeners
    const handleMouseDown = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setIsClicking(true);
      
      // Scale the follower down on click using GSAP instead of CSS
      gsap.to(follower, {
        scale: 0.9,
        duration: 0.2,
        ease: "power2.out"
      });
    };
    
    const handleMouseUp = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setIsClicking(false);
      
      // Scale the follower back on release using GSAP instead of CSS
      gsap.to(follower, {
        scale: isHovering ? (follower._gsap ? follower._gsap.scale : 1) : 1,
        duration: 0.2,
        ease: "power2.out"
      });
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
          if (textAttr) {
            setCursorText(textAttr);
            gsap.to(cursorText, { autoAlpha: 1, duration: 0.3 });
          } else if (target.classList.contains('image-container')) {
            setCursorText("View");
            gsap.to(cursorText, { autoAlpha: 1, duration: 0.3 });
          }
          
          // Special styles for different element types
          if (target.tagName.toLowerCase() === 'a') {
            // Link hover style
            gsap.to(follower, { 
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderColor: "#000",
              scale: 1.5,
              duration: 0.3 
            });
          } else if (target.tagName.toLowerCase() === 'button') {
            // Button hover style
            gsap.to(follower, { 
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderColor: "#000",
              scale: 1.2,
              duration: 0.3 
            });
          } else if (target.classList.contains('image-container')) {
            // Image hover style
            gsap.to(follower, { 
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderColor: "#000",
              scale: 1.8,
              duration: 0.3
            });
          }
        });
        
        target.addEventListener('mouseleave', () => {
          setIsHovering(false);
          setCursorText("");
          gsap.to(cursorText, { autoAlpha: 0, duration: 0.3 });
          gsap.to(follower, { 
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            borderColor: "rgba(0, 0, 0, 0.6)",
            scale: 1,
            duration: 0.3 
          });
        });
      });
    };
    
    // Handle cursor-update events dispatched from App component
    const handleCursorUpdate = (e) => {
      const { type, text } = e.detail;
      
      if (text) {
        setCursorText(text);
        gsap.to(cursorText, { autoAlpha: 1, duration: 0.3 });
      }
      
      if (type === 'link') {
        gsap.to(follower, { 
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderColor: "var(--text-color)",
          scale: 1.5,
          duration: 0.3 
        });
      } else if (type === 'button') {
        gsap.to(follower, { 
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderColor: "var(--text-color)",
          scale: 1.2,
          duration: 0.3 
        });
      } else if (type === 'image') {
        gsap.to(follower, { 
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "var(--text-color)",
          scale: 1.8,
          duration: 0.3
        });
      }
      
      setIsHovering(true);
    };
    
    const handleCursorReset = () => {
      setIsHovering(false);
      setCursorText("");
      gsap.to(cursorText, { autoAlpha: 0, duration: 0.3 });
      gsap.to(follower, { 
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderColor: "rgba(255, 255, 255, 0.5)",
        scale: 1,
        duration: 0.3 
      });
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
      gsap.ticker.remove();
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