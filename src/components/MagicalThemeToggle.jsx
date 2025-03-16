import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// Five beautiful contrasting color pairs
const COLOR_PAIRS = [
  { bg: "#ffffff", text: "#000000", name: "Classic" },       // Classic black on white
  { bg: "#0f0e17", text: "#fffffe", name: "Midnight" },      // White on dark blue-black
  { bg: "#f5f5f5", text: "#562c2c", name: "Mocha" },         // Deep burgundy on off-white
  { bg: "#2d334a", text: "#f8cb65", name: "Celestial" },     // Gold on deep blue
  { bg: "#fffbf5", text: "#1e3a5f", name: "Ocean" }          // Navy on warm white
];

const MagicalThemeToggle = () => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const textRef = useRef(null);
  const magicRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Create particles container and elements
  useEffect(() => {
    // Create particles container if it doesn't exist
    if (!document.getElementById('magic-particles')) {
      const container = document.createElement('div');
      container.id = 'magic-particles';
      container.style.position = 'fixed';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '9999';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      document.body.appendChild(container);
      
      // Create particle elements
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0';
        particle.style.background = 'currentColor';
        particle.style.boxShadow = '0 0 10px currentColor';
        container.appendChild(particle);
        particlesRef.current.push(particle);
      }
    }
    
    return () => {
      const container = document.getElementById('magic-particles');
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
  // Apply the current theme colors to CSS variables
  useEffect(() => {
    const theme = COLOR_PAIRS[currentThemeIndex];
    document.documentElement.style.setProperty('--bg-color', theme.bg);
    document.documentElement.style.setProperty('--text-color', theme.text);
    
    // Remove any previous theme classes
    document.documentElement.classList.remove(
      'theme-classic', 
      'theme-midnight', 
      'theme-mocha', 
      'theme-celestial', 
      'theme-ocean'
    );
    
    // Add new theme class
    document.documentElement.classList.add(`theme-${theme.name.toLowerCase()}`);
    
    // Apply appropriate dark/light theme class
    const isDark = getLuminance(theme.bg) < 0.5;
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [currentThemeIndex]);
  
  // Calculate luminance to determine if a color is dark
  const getLuminance = (hexColor) => {
    // Convert hex to RGB
    let r = parseInt(hexColor.substr(1, 2), 16) / 255;
    let g = parseInt(hexColor.substr(3, 2), 16) / 255;
    let b = parseInt(hexColor.substr(5, 2), 16) / 255;
    
    // Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  // Handle theme toggle click
  const toggleTheme = (e) => {
    // Get mouse position for particle animation
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Animate text scale on click
    gsap.to(textRef.current, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    });
    
    // Create particles animation
    animateParticles(x, y);
    
    // Update theme index
    setCurrentThemeIndex((prev) => (prev + 1) % COLOR_PAIRS.length);
  };
  
  // Animate particles bursting out from click position
  const animateParticles = (x, y) => {
    // Reset particles
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

  // Handle hover effects
  const handleMouseEnter = () => {
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
  };
  
  const handleMouseLeave = () => {
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
  };
  
  return (
    <div 
      className="relative cursor-pointer inline-block select-none"
      onClick={toggleTheme}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span 
        ref={textRef}
        className="inline-block relative transition-colors duration-300"
        style={{ transformOrigin: "center" }}
      >
        {COLOR_PAIRS[currentThemeIndex].name}
      </span>
      <span 
        ref={magicRef}
        className="absolute left-0 bottom-0 h-[1px] w-0 bg-current"
      ></span>
    </div>
  );
};

export default MagicalThemeToggle;