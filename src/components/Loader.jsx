import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Define all project images to preload
const PROJECT_IMAGES = [
  // Exponify
  "project images/Exponify1.webp", 
  "project images/Exponify2.webp", 
  "project images/Exponify3.webp", 
  "project images/Exponify4.webp", 
  "project images/Exponify5.webp", 
  "project images/Exponify6.webp", 
  "project images/Exponify7.webp", 
  "project images/Exponify8.webp", 
  "project images/Exponify9.webp", 
  "project images/Exponify10.webp",
  // Ila
  "project images/ila1.webp", 
  "project images/ila2.webp", 
  "project images/ila3.webp", 
  "project images/ila4.webp", 
  "project images/ila5.webp", 
  "project images/ila6.webp", 
  "project images/ila7.webp", 
  "project images/ila8.webp", 
  "project images/ila9.webp", 
  "project images/ila10.webp",
  // SmartTek
  "project images/smarttek1.webp", 
  "project images/smarttek2.webp",
  "project images/smarttek3.webp",
  "project images/smarttek4.webp",
  "project images/smarttek5.webp",
  "project images/smarttek6.webp", 
  "project images/smarttek7.webp",
  "project images/smarttek8.webp", 
  "project images/smarttek9.webp",
  // Haven
  "project images/Haven1.webp", 
  "project images/Haven2.webp",
  "project images/Haven4.webp",
  "project images/Haven7.webp",
  "project images/Haven8.webp",
  "project images/Haven9.webp",
  // Maven
  "project images/maven1.webp", 
  "project images/maven2.webp",
  "project images/maven3.webp",
  "project images/maven4.webp",
  "project images/maven5.webp",
  "project images/maven6.webp",
  "project images/maven7.webp", 
  "project images/maven8.webp",
  "project images/maven9.webp",
  "project images/maven10.webp",
];

const Loader = ({ isLoading, setIsLoading }) => {
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Create hidden preload container for images to force browser to load them
  useEffect(() => {
    if (!isLoading) return;
    
    // Create container to hold preloaded images
    const preloadContainer = document.createElement('div');
    preloadContainer.style.position = 'absolute';
    preloadContainer.style.width = '0px';
    preloadContainer.style.height = '0px';
    preloadContainer.style.opacity = '0';
    preloadContainer.style.overflow = 'hidden';
    preloadContainer.style.pointerEvents = 'none';
    document.body.appendChild(preloadContainer);
    
    // Total images to track loading
    const totalImages = PROJECT_IMAGES.length;
    let loadedImages = 0;
    
    // Create image elements to force browser to load them
    PROJECT_IMAGES.forEach(imageSrc => {
      const img = new Image();
      
      img.onload = () => {
        loadedImages++;
        const newProgress = Math.round((loadedImages / totalImages) * 100);
        setProgress(newProgress);
        
        if (loadedImages === totalImages) {
          // All images loaded - show 100% for a moment then complete
          setTimeout(() => {
            setAnimationComplete(true);
          }, 500); // Allow 100% to show briefly
        }
      };
      
      img.onerror = () => {
        // Count errors as loaded to prevent hanging
        loadedImages++;
        const newProgress = Math.round((loadedImages / totalImages) * 100);
        setProgress(newProgress);
        
        if (loadedImages === totalImages) {
          setTimeout(() => {
            setAnimationComplete(true);
          }, 500);
        }
      };
      
      // Set src to trigger loading
      img.src = imageSrc;
      preloadContainer.appendChild(img);
    });
    
    return () => {
      // Clean up preload container
      if (document.body.contains(preloadContainer)) {
        document.body.removeChild(preloadContainer);
      }
    };
  }, [isLoading]);
  
  // Update progress bar based on image loading progress
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = `${progress}%`;
    }
    
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.3,
        ease: "power1.out"
      });
    }
  }, [progress]);
  
  // Handle loader animation
  useEffect(() => {
    if (!isLoading) return;
    
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" }
    });
    
    // Set initial state
    gsap.set(loaderContentRef.current, { opacity: 0, y: 20 });
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left" });
    
    // Animate in
    tl.to(loaderContentRef.current, { opacity: 1, y: 0, duration: 0.5 });
  }, [isLoading]);
  
  // Handle hiding the loader when animation is complete and images are loaded
  useEffect(() => {
    if (animationComplete && loaderRef.current && progress >= 100) {
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        // Hide loader
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            // Wait a bit before fully removing loader
            setTimeout(() => {
              setIsLoading(false);
            }, 200);
          }
        });
      }, 400);
    }
  }, [animationComplete, progress, setIsLoading]);
  
  // Don't render if not loading
  if (!isLoading) return null;
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center font-(family-name:--Standerd) loader-container"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)"
      }}
    >
      <div ref={loaderContentRef} className="flex flex-col items-center">
        <div className="text-[6vh] md:text-[10vh] font-semibold mb-4 loader-text">LOADING</div>
        <div className="relative w-60 h-[2px] bg-gray-300 dark:bg-gray-700 overflow-hidden loader-bar">
          <div 
            ref={progressBarRef} 
            className="absolute top-0 left-0 h-full bg-current loader-progress"
          ></div>
        </div>
        <div 
          ref={counterRef} 
          className="text-lg mt-2 loader-percentage"
        >
          0%
        </div>
      </div>
    </div>
  );
};

export default Loader;