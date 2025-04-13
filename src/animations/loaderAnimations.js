import { gsap } from "gsap";
import { setInitialState } from './utils';

// Initialize loader animations
export const initLoaderAnimations = (loaderContentRef, progressBarRef) => {
  // Set initial state
  setInitialState(loaderContentRef.current, { opacity: 0, y: 20 });
  setInitialState(progressBarRef.current, { scaleX: 0, transformOrigin: "left" });
  
  // Animate in
  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" }
  });
  
  tl.to(loaderContentRef.current, { opacity: 1, y: 0, duration: 0.5 });
  
  return tl;
};

// Update progress bar based on loading progress
export const updateLoaderProgress = (progressBarRef, progress) => {
  gsap.to(progressBarRef.current, {
    scaleX: progress / 100,
    duration: 0.3,
    ease: "power1.out"
  });
};

// Hide loader with animation when loading is complete
export const hideLoader = (loaderRef, onComplete) => {
  gsap.to(loaderRef.current, {
    yPercent: -100,
    duration: 0.8,
    ease: "power3.inOut",
    onComplete: onComplete
  });
};