import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  animateThemeToggleClick, 
  animateParticles, 
  handleThemeToggleHover
} from "../animations/index";

// Five beautiful contrasting color pairs
const COLOR_PAIRS = [
  { bg: "#FEF5EF", text: "#3C3C3C", name: "Magic" },      
  { bg: "#947EB0", text: "#FEF5EF", name: "Magic" },     
  { bg: "#FEF5EF", text: "#FF6542", name: "Magic" }, 
     
  { bg: "#33202A", text: "#A491D3", name: "Magic" },        
  { bg: "#FEF5EF", text: "#4DAA57", name: "Magic" },     
  { bg: "#048BA8", text: "#FEF5EF", name: "Magic" },     
  { bg: "#FEF5EF", text: "#766C7F", name: "Magic" },       
  { bg: "#5A9367", text: "#FEF5EF", name: "Magic" },        
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
    
    // Animate text scale on click using our animation module
    animateThemeToggleClick(textRef);
    
    // Create particles animation using our animation module
    animateParticles(particlesRef, x, y);
    
    // Update theme index
    setCurrentThemeIndex((prev) => (prev + 1) % COLOR_PAIRS.length);
  };

  // Handle hover effects
  const handleMouseEnter = () => {
    handleThemeToggleHover(textRef, magicRef, true);
  };
  
  const handleMouseLeave = () => {
    handleThemeToggleHover(textRef, magicRef, false);
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