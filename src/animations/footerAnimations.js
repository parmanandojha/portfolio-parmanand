// footerAnimations.js - Updated to ensure footer visibility

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setInitialState, createHoverEffect } from './utils';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize animations for the footer
export const initFooterAnimations = (refs) => {
  try {
    const { footerRef, contactRef, emailRef, linksRef, creditRef } = refs;
    
    // IMPORTANT: Always make elements visible by default in case animations don't trigger
    // This ensures the footer will be visible even if ScrollTrigger doesn't fire
    gsap.set(footerRef.current, { opacity: 1 });
    gsap.set([contactRef.current, emailRef.current, linksRef.current, creditRef.current], 
      { opacity: 1, y: 0 });
    
    // Check if footerRef is in the viewport by calculating its position
    const footerPos = footerRef.current?.getBoundingClientRect();
    const isInViewport = footerPos && 
      (footerPos.top < window.innerHeight + 100); // Add some buffer
    
    // Only set up scroll animations if the footer is not already in the viewport
    if (!isInViewport) {
      // Animation for background image with ScrollTrigger - modified start position
      gsap.fromTo(
        footerRef.current.querySelector('img'),
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom", // Changed to trigger as soon as footer enters viewport
            toggleActions: "play none none none",
            once: true
          }
        }
      );
      
      // Let's work together text animation with ScrollTrigger
      gsap.fromTo(
        contactRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top bottom", // Changed to trigger earlier
            toggleActions: "play none none none",
            once: true
          }
        }
      );
      
      // Email animation with ScrollTrigger
      gsap.fromTo(
        emailRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: emailRef.current,
            start: "top bottom", // Changed to trigger earlier
            toggleActions: "play none none none",
            once: true
          }
        }
      );
      
      // Social links animation with ScrollTrigger
      gsap.fromTo(
        linksRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: linksRef.current,
            start: "top bottom", // Changed to trigger earlier
            toggleActions: "play none none none",
            once: true
          }
        }
      );
      
      // Credits animation with ScrollTrigger
      gsap.fromTo(
        creditRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: creditRef.current,
            start: "top bottom", // Changed to trigger earlier
            toggleActions: "play none none none",
            once: true
          }
        }
      );
    }
    
    // Force a refresh of ScrollTrigger
    ScrollTrigger.refresh();
  } catch (error) {
    console.error("Error in footer animations:", error);
    
    // Fallback to make sure everything is visible
    const { footerRef, contactRef, emailRef, linksRef, creditRef } = refs;
    
    gsap.set(footerRef.current, { opacity: 1 });
    gsap.set([contactRef.current, emailRef.current, linksRef.current, creditRef.current], 
      { opacity: 1, y: 0 });
  }
};

// Set up hover animations for links
export const setupFooterLinkHovers = (linksRef, emailRef) => {
  try {
    // Social links hover animations
    const socialLinks = linksRef.current?.querySelectorAll('a') || [];
    
    socialLinks.forEach(link => {
      createHoverEffect(link, 
        { scale: 1.05 }, 
        { scale: 1 }
      );
    });
    
    // Add magnetic-like effect to email
    const emailLink = emailRef.current?.querySelector('a');
    
    if (emailLink) {
      createHoverEffect(emailLink,
        { scale: 1.03, y: -2, duration: 0.4 },
        { scale: 1, y: 0, duration: 0.4 }
      );
    }
  } catch (error) {
    console.error("Error in footer link hover effects:", error);
  }
};