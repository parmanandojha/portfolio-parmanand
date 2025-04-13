import { gsap } from "gsap";

// Initialize magnetic effect for elements with data-magnetic attribute
export const initMagneticEffect = () => {
  // Select all elements that should have magnetic effect
  const magneticElements = document.querySelectorAll('[data-magnetic]');
  
  magneticElements.forEach(element => {
    const strength = element.getAttribute('data-magnetic-strength') || 0.3;
    const distance = element.getAttribute('data-magnetic-distance') || 40;
    
    // Initialize variables
    let bound;
    let elementCenterX;
    let elementCenterY;
    
    // Update boundary values on resize
    const calculateBounds = () => {
      bound = element.getBoundingClientRect();
      elementCenterX = bound.left + bound.width / 2;
      elementCenterY = bound.top + bound.height / 2;
    };
    
    // Calculate initial bounds
    calculateBounds();
    
    // Recalculate on resize
    window.addEventListener('resize', calculateBounds);
    window.addEventListener('scroll', calculateBounds);
    
    // Mouse move handler
    const handleMouseMove = (e) => {
      // Check if mouse is close enough to activate effect
      const distanceFromCenter = Math.sqrt(
        Math.pow(e.clientX - elementCenterX, 2) + 
        Math.pow(e.clientY - elementCenterY, 2)
      );
      
      if (distanceFromCenter < parseInt(distance)) {
        // Calculate movement based on distance from center
        const x = (e.clientX - elementCenterX) * parseFloat(strength);
        const y = (e.clientY - elementCenterY) * parseFloat(strength);
        
        // Apply transform
        gsap.to(element, {
          x: x,
          y: y,
          duration: 0.3,
          ease: "power2.out"
        });
        element.classList.add('magnetic-active');
      } else {
        // Reset position when far away
        resetPosition();
      }
    };
    
    // Reset position function
    const resetPosition = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
      element.classList.remove('magnetic-active');
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', resetPosition);
    
    // Cleanup function (call this when component unmounts)
    element.cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', resetPosition);
      window.removeEventListener('resize', calculateBounds);
      window.removeEventListener('scroll', calculateBounds);
    };
  });
  
  // Return cleanup function
  return () => {
    magneticElements.forEach(element => {
      if (element.cleanup) {
        element.cleanup();
      }
    });
  };
};

// Initialize cursor trails effect
export const initCursorTrail = () => {
  const trailCount = 8;
  const trails = [];
  
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push({
      element: trail,
      x: 0,
      y: 0
    });
  }
  
  let mouseX = 0;
  let mouseY = 0;
  
  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  // Animation loop using requestAnimationFrame
  const updateTrails = () => {
    trails.forEach((trail, index) => {
      // Add delay based on index
      const delay = index * 0.08;
      
      // Calculate new position with easing
      trail.x += (mouseX - trail.x) * (0.2 - delay * 0.05);
      trail.y += (mouseY - trail.y) * (0.2 - delay * 0.05);
      
      // Update position with GSAP
      gsap.set(trail.element, {
        x: trail.x,
        y: trail.y,
        width: 6 - index * 0.5,
        height: 6 - index * 0.5
      });
    });
    
    requestAnimationFrame(updateTrails);
  };
  
  // Start animation loop
  const animationFrame = requestAnimationFrame(updateTrails);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationFrame);
    trails.forEach(trail => {
      if (trail.element && trail.element.parentNode) {
        document.body.removeChild(trail.element);
      }
    });
  };
};

// Enhance navigation elements with magnetic effects and cursor interactions
export const enhanceNavigation = () => {
  // Find navigation items, links, and buttons
  const navLinks = document.querySelectorAll('nav a, button, .link-underline');
  
  navLinks.forEach(link => {
    // Add data attributes for magnetic effect and cursor text
    link.setAttribute('data-magnetic', '');
    link.setAttribute('data-magnetic-strength', '0.2');
    link.setAttribute('data-magnetic-distance', '30');
    
    // Add custom hover effect that interacts with cursor
    link.addEventListener('mouseenter', () => {
      document.dispatchEvent(new CustomEvent('cursor-update', { 
        detail: { type: 'link', text: link.textContent.trim() || 'Click' }
      }));
    });
    
    link.addEventListener('mouseleave', () => {
      document.dispatchEvent(new CustomEvent('cursor-reset'));
    });
  });
  
  // Find project image containers
  const imageContainers = document.querySelectorAll('.image-container');
  
  imageContainers.forEach(container => {
    // Add view text for image hover
    container.setAttribute('data-cursor-text', 'View');
    
    // Add expand effect on hover
    container.addEventListener('mouseenter', () => {
      document.dispatchEvent(new CustomEvent('cursor-update', { 
        detail: { type: 'image', text: 'View' }
      }));
    });
    
    container.addEventListener('mouseleave', () => {
      document.dispatchEvent(new CustomEvent('cursor-reset'));
    });
  });
};