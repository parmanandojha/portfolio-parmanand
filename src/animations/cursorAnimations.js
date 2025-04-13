import { gsap } from "gsap";
import { setInitialState } from './utils';

// Initialize the custom cursor animations
export const initCursorAnimations = (elements) => {
  const { cursor, follower, cursorText } = elements;
  
  if (!cursor || !follower || !cursorText) return;
  
  // Initial setup
  setInitialState(cursor, { 
    xPercent: -50, 
    yPercent: -50,
    force3D: true // Force 3D acceleration
  });
  
  setInitialState(follower, { 
    xPercent: -50, 
    yPercent: -50,
    scale: 1,
    force3D: true // Force 3D acceleration
  });
  
  setInitialState(cursorText, { 
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
  const ticker = gsap.ticker.add(() => {
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
  
  // Return mouse position update function and ticker for external use
  return {
    updateMousePos: (x, y) => {
      mouse.x = x;
      mouse.y = y;
    },
    ticker
  };
};

// Animations for cursor hover states
export const handleCursorHover = (follower, cursorText, isClicking, text, type) => {
  // Show text if provided
  if (text) {
    gsap.to(cursorText, { autoAlpha: 1, duration: 0.3 });
  } else {
    gsap.to(cursorText, { autoAlpha: 0, duration: 0.3 });
  }
  
  // Apply different styles based on element type
  if (type === 'link') {
    gsap.to(follower, { 
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderColor: "var(--text-color)",
      scale: 1.5,
      duration: 0.3 
    });
  } else if (type === 'button') {
    gsap.to(follower, { 
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderColor: "var(--text-color)",
      scale: 1.2,
      duration: 0.3 
    });
  } else if (type === 'image') {
    gsap.to(follower, { 
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderColor: "var(--text-color)",
      scale: 1.8,
      duration: 0.3
    });
  } else {
    // Reset to default state
    gsap.to(follower, { 
      backgroundColor: "rgba(0, 0, 0, 0.03)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      scale: isClicking ? 0.9 : 1,
      duration: 0.3 
    });
  }
};

// Handle click animations
export const handleCursorClick = (follower, isClicking) => {
  gsap.to(follower, {
    scale: isClicking ? 0.9 : 1,
    duration: 0.2,
    ease: "power2.out"
  });
};