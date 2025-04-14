import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  setInitialPageState, 
  animatePageTransition, 
  cleanupAnimation 
} from '../animations/index';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef(null);
  const overlayRef = useRef(null);
  const prevPathRef = useRef(location.pathname);
  const [content, setContent] = useState(children);
  
  // Create overlay element on mount
  useEffect(() => {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'var(--bg-color)';
    overlay.style.zIndex = '9998';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    document.body.appendChild(overlay);
    overlayRef.current = overlay;
    
    // Clean up overlay on unmount
    return () => {
      if (overlay && document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, []);
  
  // Effect to handle page transitions when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip animation on initial render
    if (prevPathRef.current === currentPath) {
      // Set initial state on first render
      setInitialPageState(pageRef.current);
      return;
    }

    // Handle page transition animation
    const ctx = gsap.context(() => {
      // Create a timeline for the transition
      const tl = gsap.timeline({
        onComplete: () => {
          // Update the previous path ref after animation
          prevPathRef.current = currentPath;
          
          // Ensure we're scrolled to top on new page
          window.scrollTo(0, 0);
        }
      });

      // Exit animation
      tl.to(pageRef.current, {
        opacity: 0,
        y: -15,
        scale: 0.98,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          // Update content to new page
          setContent(children);
        }
      })
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power1.inOut"
      }, "-=0.3")
      // Small pause for content to update
      .to({}, { duration: 0.05 })
      // Fade out overlay
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      })
      // Entrance animation
      .fromTo(pageRef.current, 
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "all"
        }, 
        "-=0.3"
      );
    });
    
    return () => {
      cleanupAnimation(ctx);
    };
  }, [location, children]);

  return (
    <div 
      ref={pageRef} 
      className="page-transition w-full h-full overflow-visible"
      style={{ 
        position: 'relative',
        transformStyle: 'flat',
        isolation: 'isolate',
        perspective: '1000px'
      }}
    >
      {content}
    </div>
  );
};

export default PageTransition;