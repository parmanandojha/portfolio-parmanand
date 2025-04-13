import React, { useRef, useEffect } from 'react';
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
  const prevPathRef = useRef(location.pathname);
  
  // Effect to handle page transitions when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip animation on initial render
    if (prevPathRef.current === currentPath) {
      setInitialPageState(pageRef.current);
      return;
    }

    // Handle page transition animation
    const ctx = gsap.context(() => {
      // Define completion callback
      const onComplete = () => {
        // Update the previous path ref after animation
        prevPathRef.current = currentPath;
        
        // Ensure we're scrolled to top on new page
        window.scrollTo(0, 0);
      };
      
      // Run the transition animation
      animatePageTransition(pageRef.current, onComplete);
    });
    
    return () => cleanupAnimation(ctx);
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