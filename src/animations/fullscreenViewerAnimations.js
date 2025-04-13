import { gsap } from "gsap";
import { setInitialState } from './utils';

// Set up initial state for modal elements
export const setupModalInitialState = (elements) => {
  const { modalElement, contentElement, thumbnailsElement, navButtons } = elements;
  
  // Make modal visible but fully transparent to start animation from
  setInitialState(modalElement, { 
    backgroundColor: "var(--bg-color)",
    opacity: 0,
    visibility: "visible"
  });
  
  // Setup initial states for content and thumbnails with smoother positioning
  setInitialState(contentElement, { 
    opacity: 0, 
    scale: 0.95,
    y: 15
  });
  
  if (thumbnailsElement) {
    setInitialState(thumbnailsElement, { 
      opacity: 0, 
      x: -15
    });
  }
  
  if (navButtons && navButtons.length) {
    setInitialState(navButtons, { 
      opacity: 0, 
      scale: 0.9
    });
  }
};

// Animate modal opening
export const animateModalOpen = (elements) => {
  const { modalElement, contentElement, thumbnailsElement, navButtons } = elements;
  
  // Create a timeline for opening animation with smoother easing
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
      duration: 0.5
    }
  });
  
  // Animation sequence
  tl.to(modalElement, { 
    opacity: 1,
    duration: 0.6
  })
  .to(contentElement, { 
    opacity: 1, 
    scale: 1,
    y: 0,
    duration: 0.6
  }, "-=0.5") // Overlap for smoother feel
  
  if (thumbnailsElement) {
    tl.to(thumbnailsElement, { 
      opacity: 1, 
      x: 0,
      duration: 0.5
    }, "-=0.4"); // Slight delay
  }
  
  if (navButtons && navButtons.length) {
    tl.to(navButtons, { 
      opacity: 1, 
      scale: 1, 
      stagger: 0.08, // Increased stagger
      duration: 0.5
    }, "-=0.4");
  }
  
  return tl;
};

// Animate modal closing
export const animateModalClose = (elements, onComplete) => {
  const { modalElement, contentElement, thumbnailsElement, navButtons } = elements;
  
  // Create a timeline for closing animation with better easing
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.inOut", // Smoother easing
      duration: 0.5
    },
    onComplete: onComplete
  });
  
  // Animation sequence
  tl.to(navButtons, { opacity: 0, scale: 0.9, stagger: 0.06 })
    .to(thumbnailsElement, { opacity: 0, x: -15 }, "-=0.4")
    .to(contentElement, { opacity: 0, scale: 0.95, y: 10 }, "-=0.4")
    .to(modalElement, { opacity: 0, duration: 0.6 }, "-=0.3");
  
  return tl;
};

// Update thumbnail styling based on selected index
export const updateThumbnailStyles = (thumbnails, currentIndex) => {
  thumbnails.forEach((thumb, idx) => {
    if (idx === currentIndex) {
      gsap.to(thumb, {
        opacity: 1,
        border: '2px solid var(--text-color)',
        duration: 0.3
      });
    } else {
      gsap.to(thumb, {
        opacity: 0.7,
        border: '1px solid rgba(var(--text-color-rgb), 0.3)',
        duration: 0.3
      });
    }
  });
};