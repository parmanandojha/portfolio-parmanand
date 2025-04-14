import { gsap } from "gsap";
import { setInitialState } from './utils';

// Function to set initial state with no animation
export const setInitialPageState = (pageRef) => {
  if (!pageRef) return;
  
  setInitialState(pageRef, { 
    opacity: 1, 
    y: 0,
    scale: 1
  });
};

// Function to animate page transitions
export const animatePageTransition = (pageRef, onComplete) => {
  if (!pageRef) return null;
  
  // Create timeline for the transition animation
  const tl = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
    }
  });

  // Exit animation
  tl.to(pageRef, {
    opacity: 0,
    y: -15,
    scale: 0.98,
    duration: 0.4,
  })
  // Update content and prepare for entrance animation
  .set(pageRef, {
    y: 20,
    scale: 0.98,
    onComplete: onComplete
  })
  // Entrance animation
  .to(pageRef, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    ease: "power2.out",
    clearProps: "all"
  });
  
  return tl;
};