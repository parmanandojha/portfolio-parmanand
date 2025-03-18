import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Loader = ({ isLoading, setIsLoading }) => {
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  
  useEffect(() => {
    if (!isLoading) return;
    
    let progress = 0;
    const duration = 2.5; // Total duration in seconds
    const interval = 10; // Update interval in ms
    const increment = (100 / (duration * 1000)) * interval;
    
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        // Hide loader after animation completes
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => setIsLoading(false)
        });
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
  }, [isLoading, setIsLoading]);
  
  // Don't render if not loading
  if (!isLoading) return null;
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
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