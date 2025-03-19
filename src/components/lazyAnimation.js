// utils/lazyAnimation.js
import { gsap } from "gsap";

export const setupLazyAnimations = () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get animation type from data attribute
        const animationType = entry.target.dataset.animate;
        const delay = parseFloat(entry.target.dataset.delay || 0);
        
        // Run the appropriate animation based on type
        switch(animationType) {
          case 'fadeIn':
            gsap.to(entry.target, { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              delay,
              ease: "power2.out" 
            });
            break;
          case 'fadeUp':
            gsap.to(entry.target, { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              delay,
              ease: "power3.out" 
            });
            break;
          case 'scaleIn':
            gsap.to(entry.target, { 
              opacity: 1, 
              scale: 1, 
              duration: 0.8,
              delay,
              ease: "power2.out" 
            });
            break;
          default:
            // Default animation
            gsap.to(entry.target, { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              delay,
              ease: "power2.out" 
            });
        }
        
        // Unobserve after animating to save resources
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of element is visible
  
  // Set initial states and observe each element
  animatedElements.forEach(el => {
    // Set initial state based on animation type
    const animationType = el.dataset.animate;
    
    if (animationType === 'fadeIn' || animationType === 'fadeUp') {
      gsap.set(el, { opacity: 0, y: 20 });
    } else if (animationType === 'scaleIn') {
      gsap.set(el, { opacity: 0, scale: 0.9 });
    } else {
      // Default initial state
      gsap.set(el, { opacity: 0, y: 20 });
    }
    
    observer.observe(el);
  });
  
  return () => observer.disconnect();
};