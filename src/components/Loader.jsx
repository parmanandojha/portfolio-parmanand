import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Loader = ({ isLoading, setIsLoading }) => {
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [backgroundImagesLoaded, setBackgroundImagesLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Track regular image loading
  useEffect(() => {
    if (!isLoading) return;
    
    const images = document.querySelectorAll('img');
    let loadedImagesCount = 0;
    const totalImages = images.length;
    
    // If there are no images, mark as loaded
    if (totalImages === 0) {
      setImagesLoaded(true);
      return;
    }
    
    const imageLoaded = () => {
      loadedImagesCount++;
      if (loadedImagesCount === totalImages) {
        setImagesLoaded(true);
      }
    };
    
    // Add load event listeners to all images
    images.forEach(img => {
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded); // Count failed images as loaded
      }
    });
    
    // Cleanup function
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', imageLoaded);
        img.removeEventListener('error', imageLoaded);
      });
    };
  }, [isLoading]);
  
  // Track background images loading
  useEffect(() => {
    if (!isLoading) return;
    
    // Create a list of all background image URLs
    const backgroundUrls = [];
    
    // Find all elements with background images
    const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
    elementsWithBg.forEach(el => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        // Extract URL from background-image: url("...")
        const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/i);
        if (match && match[1]) {
          backgroundUrls.push(match[1]);
        }
      }
    });
    
    // Check CSS for background images in classes that might be applied later
    const styleSheets = document.styleSheets;
    try {
      for (let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets[i];
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;
        
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.style && rule.style.backgroundImage) {
            const bgImage = rule.style.backgroundImage;
            if (bgImage && bgImage !== 'none') {
              const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/i);
              if (match && match[1]) {
                backgroundUrls.push(match[1]);
              }
            }
          }
        }
      }
    } catch (e) {
      // CORS might prevent accessing some stylesheets
      console.warn("Could not access all stylesheets due to security restrictions");
    }
    
    // Also check for project images in our Work component
    const projectBgImages = [];
    try {
      const projectImagesElements = document.querySelectorAll('.preload-bg-image');
      projectImagesElements.forEach(el => {
        if (el.dataset && el.dataset.bgImage) {
          projectBgImages.push(el.dataset.bgImage);
        }
      });
    } catch (e) {
      console.warn("Error while collecting project background images", e);
    }
    
    // Combine all background image URLs
    const allBgImages = [...new Set([...backgroundUrls, ...projectBgImages])];
    
    // If there are no background images, mark as loaded
    if (allBgImages.length === 0) {
      setBackgroundImagesLoaded(true);
      return;
    }
    
    // Load all background images
    let loadedBgCount = 0;
    
    const bgImageLoaded = () => {
      loadedBgCount++;
      
      // Update progress based on background images too
      if (counterRef.current && progressBarRef.current) {
        const combinedProgress = Math.round(
          (loadedBgCount / allBgImages.length) * 100
        );
        
        // Update counter text with combined progress
        counterRef.current.textContent = `${combinedProgress}%`;
        
        // Update progress bar
        gsap.to(progressBarRef.current, {
          scaleX: combinedProgress / 100,
          duration: 0.3,
          ease: "power1.out"
        });
      }
      
      if (loadedBgCount === allBgImages.length) {
        setBackgroundImagesLoaded(true);
      }
    };
    
    // Preload all background images
    allBgImages.forEach(bgUrl => {
      const img = new Image();
      img.onload = bgImageLoaded;
      img.onerror = bgImageLoaded; // Count failed loads too
      img.src = bgUrl;
    });
    
  }, [isLoading]);
  
  // Handle loader animation
  useEffect(() => {
    if (!isLoading) return;
    
    let progress = 0;
    const duration = 2.5; // Total duration in seconds
    const interval = 10; // Update interval in ms
    const increment = (100 / (duration * 1000)) * interval;
    
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setAnimationComplete(true);
      }
    });
    
    // Set initial state
    gsap.set(loaderContentRef.current, { opacity: 0, y: 20 });
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left" });
    
    // Animate in
    tl.to(loaderContentRef.current, { opacity: 1, y: 0, duration: 0.5 });
    
    // Only run this auto-increment if we don't have concrete progress data
    if (!backgroundImagesLoaded) {
      // Handle progress counter and progress bar
      const updateProgress = () => {
        if (!counterRef.current || !progressBarRef.current) return;
        
        progress += increment;
        const roundedProgress = Math.min(Math.round(progress), 99); // Cap at 99% until actually loaded
        
        // Update counter text
        counterRef.current.textContent = `${roundedProgress}%`;
        
        // Update progress bar
        gsap.to(progressBarRef.current, {
          scaleX: progress / 100,
          duration: interval / 1000,
          ease: "none"
        });
        
        if (progress < 99) { // Only go to 99% automatically
          setTimeout(updateProgress, interval);
        }
      };
      
      // Start progress updates
      updateProgress();
    }
  }, [isLoading]);
  
  // Handle hiding the loader when both animation is complete, regular images are loaded,
  // AND background images are loaded
  useEffect(() => {
    if (animationComplete && imagesLoaded && backgroundImagesLoaded && loaderRef.current) {
      // Show 100% before hiding
      if (counterRef.current) {
        counterRef.current.textContent = "100%";
      }
      
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
      
      // Add a small delay to show the 100% state
      setTimeout(() => {
        // Hide loader only when all conditions are met
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => setIsLoading(false)
        });
      }, 400);
    }
  }, [animationComplete, imagesLoaded, backgroundImagesLoaded, setIsLoading]);
  
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