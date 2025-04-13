import { gsap } from "gsap";

// Animate text scale on theme toggle click
export const animateThemeToggleClick = (textRef) => {
  gsap.to(textRef.current, {
    scale: 1.2,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power2.out"
  });
};

// Animate particles bursting out from click position
export const animateParticles = (particlesRef, x, y) => {
  // Reset and animate each particle
  particlesRef.current.forEach((particle, i) => {
    // Position all particles at the click point
    gsap.set(particle, {
      x: x,
      y: y,
      scale: 0,
      opacity: 0
    });
    
    // Random angle for each particle
    const angle = Math.random() * Math.PI * 2;
    // Random distance
    const distance = 30 + Math.random() * 80;
    // Calculate end position
    const endX = x + Math.cos(angle) * distance;
    const endY = y + Math.sin(angle) * distance;
    
    // Animate each particle
    gsap.to(particle, {
      x: endX,
      y: endY,
      scale: 0.5 + Math.random() * 1.5,
      opacity: 1,
      duration: 0.6 + Math.random() * 0.6,
      ease: "power3.out",
      delay: i * 0.01,
      onComplete: () => {
        // Fade out
        gsap.to(particle, {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: "power2.in"
        });
      }
    });
  });
};

// Handle hover effects for theme toggle
export const handleThemeToggleHover = (textRef, magicRef, isEntering) => {
  if (isEntering) {
    gsap.to(textRef.current, {
      y: -3,
      duration: 0.3,
      ease: "power2.out"
    });
    
    gsap.to(magicRef.current, {
      width: "100%",
      duration: 0.3,
      ease: "power1.out"
    });
  } else {
    gsap.to(textRef.current, {
      y: 0,
      duration: 0.3,
      ease: "power2.in"
    });
    
    gsap.to(magicRef.current, {
      width: "0%",
      duration: 0.3,
      ease: "power1.in"
    });
  }
};