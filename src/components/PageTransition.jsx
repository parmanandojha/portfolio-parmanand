import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef(null);
  const prevPathRef = useRef(location.pathname);
  
  // Effect to handle page transitions when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip animation on initial render
    if (prevPathRef.current === currentPath) {
      gsap.set(pageRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Handle page transition animation
    const tl = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
      }
    });

    // Exit animation
    tl.to(pageRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.5,
    })
    // Update content and prepare for entrance animation
    .set(pageRef.current, {
      y: 40,
      onComplete: () => {
        // Update the previous path ref after animation
        prevPathRef.current = currentPath;
        
        // Ensure we're scrolled to top on new page
        window.scrollTo(0, 0);
      }
    })
    // Entrance animation
    .to(pageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
    });
    
  }, [location]);

  return (
    <div 
      ref={pageRef} 
      className="page-transition w-full h-full overflow-visible"
      style={{ 
        position: 'relative',
        // Add the following to prevent it from affecting fixed positioning of modals
        transformStyle: 'flat',
        isolation: 'isolate'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;