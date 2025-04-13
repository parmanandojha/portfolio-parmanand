// animations/utils.js - Common utility functions for animations

import { gsap } from "gsap";

// Centralized cleanup function to replace all individual cleanup functions
export const cleanupAnimation = (context) => {
  if (context) {
    context.revert();
  }
};

// Common initial state setter for elements
export const setInitialState = (elements, properties) => {
  gsap.set(elements, properties);
};

// Common hover effect implementation
export const createHoverEffect = (element, enterProps, leaveProps) => {
  if (!element) return;
  
  const enterTl = gsap.timeline({ paused: true });
  const leaveTl = gsap.timeline({ paused: true });
  
  enterTl.to(element, {
    ...enterProps,
    duration: enterProps.duration || 0.3,
    ease: enterProps.ease || "power2.out"
  });
  
  leaveTl.to(element, {
    ...leaveProps,
    duration: leaveProps.duration || 0.3,
    ease: leaveProps.ease || "power2.in"
  });
  
  element.addEventListener('mouseenter', () => {
    leaveTl.pause(0);
    enterTl.restart();
  });
  
  element.addEventListener('mouseleave', () => {
    enterTl.pause();
    leaveTl.restart();
  });
  
  return { enterTl, leaveTl };
};

// Common animation defaults
export const animationDefaults = {
  standard: {
    ease: "power3.out",
    duration: 0.8
  },
  fast: {
    ease: "power2.out",
    duration: 0.5
  },
  elastic: {
    ease: "elastic.out(1, 0.3)",
    duration: 0.5
  }
};

// Creates a standard staggered animation for multiple elements
export const createStaggeredAnimation = (elements, fromProps, toProps, staggerAmount = 0.1) => {
  return gsap.to(elements, {
    ...toProps,
    stagger: staggerAmount,
    duration: toProps.duration || 0.8,
    ease: toProps.ease || "power2.out"
  });
};

// Apply hover underline effect to links (used in navbar and footer)
export const applyUnderlineEffect = (element) => {
  if (!element) return;
  
  const underline = element.querySelector('.link-underline');
  if (underline) {
    element.addEventListener("mouseenter", () => {
      gsap.to(underline, {
        width: "100%",
        duration: 0.3,
        ease: "power1.out"
      });
    });
    
    element.addEventListener("mouseleave", () => {
      gsap.to(underline, {
        width: "0%",
        duration: 0.3,
        ease: "power1.in"
      });
    });
  }
};