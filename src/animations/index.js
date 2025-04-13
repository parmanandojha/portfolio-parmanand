// animations/index.js - Export all animation modules

// Utility functions
export {
    cleanupAnimation,
    setInitialState,
    createHoverEffect,
    animationDefaults,
    createStaggeredAnimation,
    applyUnderlineEffect
  } from './utils';
  
  // ScrollTrigger utility functions
  export {
    createScrollAnimation,
    createStaggeredScrollAnimation,
    createParallaxEffect,
    createHorizontalScrollAnimation,
    createRevealAnimation,
    createTextRevealAnimation
  } from './scrollTriggerUtils';
  
  // Navbar animations
  export { 
    initNavbarAnimations, 
    setupNavLinkHoverEffects
  } from './navbarAnimations';
  
  // Work page animations
  export { 
    initWorkAnimations,
    setupProjectHoverEffects
  } from './workAnimations';
  
  // Info page animations
  export { 
    initInfoAnimations
  } from './infoAnimations';
  
  // Cursor animations
  export { 
    initCursorAnimations, 
    handleCursorHover, 
    handleCursorClick
  } from './cursorAnimations';
  
  // Footer animations
  export { 
    initFooterAnimations, 
    setupFooterLinkHovers
  } from './footerAnimations';
  
  // Page transition animations
  export { 
    setInitialPageState, 
    animatePageTransition
  } from './pageTransitionAnimations';
  
  // Fullscreen viewer animations
  export { 
    setupModalInitialState, 
    animateModalOpen, 
    animateModalClose, 
    updateThumbnailStyles
  } from './fullscreenViewerAnimations';
  
  // Theme toggle animations
  export { 
    animateThemeToggleClick, 
    animateParticles, 
    handleThemeToggleHover
  } from './themeToggleAnimations';
  
  // Loader animations
  export { 
    initLoaderAnimations, 
    updateLoaderProgress, 
    hideLoader
  } from './loaderAnimations';
  
  // Magnetic effects and cursor trails
  export { 
    initMagneticEffect, 
    initCursorTrail, 
    enhanceNavigation 
  } from './magneticEffects';