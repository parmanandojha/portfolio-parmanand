import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Loader = ({ isLoading, setIsLoading }) => {
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Track image loading
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
    
    // Handle progress counter and progress bar
    const updateProgress = () => {
      if (!counterRef.current || !progressBarRef.current) return;
      
      progress += increment;
      const roundedProgress = Math.min(Math.round(progress), 100);
      
      // Update counter text
      counterRef.current.textContent = `${roundedProgress}%`;
      
      // Update progress bar
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: interval / 1000,
        ease: "none"
      });
      
      if (progress < 100) {
        setTimeout(updateProgress, interval);
      }
    };
    
    // Start progress updates
    updateProgress();
  }, [isLoading]);
  
  // Handle hiding the loader when both animation is complete AND images are loaded
  useEffect(() => {
    if (animationComplete && imagesLoaded && loaderRef.current) {
      // Hide loader only when both conditions are met
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => setIsLoading(false)
      });
    }
  }, [animationComplete, imagesLoaded, setIsLoading]);
  
  // Don't render if not loading
  if (!isLoading) return null;
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center font-(family-name:--Standerd)"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)"
      }}
    >
      <div ref={loaderContentRef} className="flex flex-col items-center">
        <div className="text-[6vh] md:text-[10vh] font-semibold mb-4">LOADING</div>
        <div className="relative w-60 h-[2px] bg-gray-300 dark:bg-gray-700 overflow-hidden">
          <div 
            ref={progressBarRef} 
            className="absolute top-0 left-0 h-full bg-current"
          ></div>
        </div>
        <div 
          ref={counterRef} 
          className="text-lg mt-2"
        >
          0%
        </div>
      </div>
    </div>
  );
};

export default Loader;