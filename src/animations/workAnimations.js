import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setInitialState, createHoverEffect } from './utils';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Main animation function for the work page
export const initWorkAnimations = (projects, headerRef) => {
  try {
    console.log("Initializing work animations with ScrollTrigger");
    
    // Clear any existing ScrollTrigger animations to prevent duplicates
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && trigger.vars.id.includes('work-')) {
        trigger.kill();
      }
    });
    
    // For the header, we won't use ScrollTrigger but a direct animation for better reliability
    gsap.set(headerRef.current, { opacity: 0, y: 50 });
    gsap.to(headerRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: "power2.out",
      delay: 0.1
    });

    // Add a small delay before project animations to ensure DOM is ready
    setTimeout(() => {
      // Animate projects one by one
      projects.forEach((project, projectIndex) => {
        // Skip if project elements aren't valid
        if (!project.nameRef?.current) {
          console.log("Project doesn't have valid refs, skipping", projectIndex);
          return;
        }
        
        // Get elements for this project
        const textElements = [
          project.nameRef.current, 
          project.typeRef.current, 
          project.descRef.current,
          project.linkRef.current
        ].filter(Boolean);
        
        console.log(`Setting up animations for project ${projectIndex} with ${textElements.length} text elements`);
        
        // Important: Set initial state for elements
        gsap.set(textElements, { opacity: 0, y: 30 });
        
        // Create project text animation
        gsap.to(textElements, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            id: `work-project-text-${projectIndex}`,
            trigger: textElements[0],
            start: "top bottom", // As soon as the element enters the viewport
            toggleActions: "play none none none",
            once: true,
            markers: false, // Set to true for debugging
            onEnter: () => console.log(`Project ${projectIndex} text animation triggered`)
          }
        });
        
        // Image containers with ScrollTrigger
        if (project.imagesRef?.current) {
          const imageContainers = project.imagesRef.current.querySelectorAll('.image-container');
          if (imageContainers.length > 0) {
            console.log(`Setting up animations for ${imageContainers.length} image containers in project ${projectIndex}`);
            
            // Important: Set initial state for images
            gsap.set(imageContainers, { opacity: 0, y: 20, scale: 0.95 });
            
            // Create image animation
            gsap.to(imageContainers, { 
              opacity: 0.9, // Match the opacity in style
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: {
                id: `work-project-images-${projectIndex}`,
                trigger: project.imagesRef.current,
                start: "top bottom", // As soon as the element enters the viewport
                toggleActions: "play none none none",
                once: true,
                markers: false, // Set to true for debugging
                onEnter: () => console.log(`Project ${projectIndex} images animation triggered`)
              }
            });
          }
        }
      });
      
      // Force ScrollTrigger refresh after setting up all animations
      ScrollTrigger.refresh();
      console.log("ScrollTrigger refreshed after setting up all animations");
      
    }, 200);
    
  } catch (error) {
    console.error("Error in work animations:", error);
    
    // Fallback to make everything visible
    gsap.set(headerRef.current, { opacity: 1, y: 0 });
    
    projects.forEach(project => {
      if (!project.nameRef?.current) return;
      
      const elements = [
        project.nameRef.current, 
        project.typeRef.current, 
        project.descRef.current,
        project.linkRef.current
      ].filter(Boolean);
      
      gsap.set(elements, { opacity: 1, y: 0 });
      
      if (project.imagesRef?.current) {
        const imageContainers = project.imagesRef.current.querySelectorAll('.image-container');
        gsap.set(imageContainers, { opacity: 0.9, y: 0, scale: 1 });
      }
    });
  }
};

// Setup hover effects for projects and image containers
export const setupProjectHoverEffects = () => {
  document.querySelectorAll('.image-container').forEach(container => {
    createHoverEffect(
      container,
      {
        y: -5,
        scale: 1.02,
        boxShadow: "0 15px 25px rgba(0,0,0,0.08)",
        duration: 0.4
      },
      {
        y: 0,
        scale: 1,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: 0.4
      }
    );
  });
  
  // Set up hover effects for link buttons
  document.querySelectorAll('.project-link-btn').forEach(button => {
    createHoverEffect(
      button,
      {
        backgroundColor: 'var(--text-color)',
        color: 'var(--bg-color)',
        duration: 0.3
      },
      {
        backgroundColor: 'transparent',
        color: 'var(--text-color)',
        duration: 0.3
      }
    );
  });
};