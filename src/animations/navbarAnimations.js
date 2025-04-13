import { gsap } from "gsap";
import { setInitialState, applyUnderlineEffect } from './utils';

// Initialize animations for navbar elements
export const initNavbarAnimations = (itemsRef) => {
  // Set initial state
  setInitialState(itemsRef.current, { 
    y: -20, 
    opacity: 0 
  });
  
  // Create animation
  return gsap.to(itemsRef.current, {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.2
  });
};

// Set up hover underline animations
export const setupNavLinkHoverEffects = (itemsRef) => {
  if (!itemsRef.current) return;
  
  itemsRef.current.forEach(item => {
    if (item && item.textContent) {
      applyUnderlineEffect(item);
    }
  });
};