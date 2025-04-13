import { gsap } from "gsap";
import { setInitialState } from './utils';

// Function to set initial state with no animation
export const setInitialPageState = (pageRef) => {
  setInitialState(pageRef, { opacity: 1, y: 0 });
};

// Function to animate page transitions
export const animatePageTransition = (pageRef, onComplete) => {
  // Create timeline for the transition animation
  const tl = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
    }
  });

  // Exit animation
  tl.to(pageRef, {
    opacity: 0,
    y: -20,
    duration: 0.5,
  })
  // Update content and prepare for entrance animation
  .set(pageRef, {
    y: 40,
    onComplete: onComplete
  })
  // Entrance animation
  .to(pageRef, {
    opacity: 1,
    y: 0,
    duration: 0.6,
  });
  
  return tl;
};