import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  initLoaderAnimations,
  cleanupAnimation 
} from "../animations/index";
import projectData from "./projectData"; // Import project data to get all images

// Flatten all project images into a single array for loading
const getAllProjectImages = () => {
  let allImages = [];
  projectData.forEach(project => {
    if (project.images && Array.isArray(project.images)) {
      allImages = [...allImages, ...project.images];
    }
  });
  return allImages;
};

const PROJECT_IMAGES = getAllProjectImages();

const Loader = ({ isLoading, setIsLoading }) => {
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Hard-coded specific colors as requested
  const backgroundColor = "#FEF5EF";
  const textColor = "#3C3C3C";
  
  // Apply theme colors to root to match loader
  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.setProperty('--bg-color', backgroundColor);
      document.documentElement.style.setProperty('--text-color', textColor);
    }
  }, [isLoading]);
  
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
    
    console.log(`Starting to load ${totalImages} project images...`);
    
    // Create image elements to force browser to load them
    PROJECT_IMAGES.forEach((imageSrc, index) => {
      const img = new Image();
      
      img.onload = () => {
        loadedImages++;
        const newProgress = Math.round((loadedImages / totalImages) * 100);
        console.log(`Loaded image ${loadedImages}/${totalImages} (${newProgress}%): ${imageSrc}`);
        setProgress(newProgress);
        
        if (loadedImages === totalImages) {
          // All images loaded - show 100% for a moment then complete
          console.log("All images loaded successfully!");
          setTimeout(() => {
            setAnimationComplete(true);
          }, 500); // Allow 100% to show briefly
        }
      };
      
      img.onerror = () => {
        // Count errors as loaded to prevent hanging
        loadedImages++;
        const newProgress = Math.round((loadedImages / totalImages) * 100);
        console.log(`Error loading image ${loadedImages}/${totalImages} (${newProgress}%): ${imageSrc}`);
        setProgress(newProgress);
        
        if (loadedImages === totalImages) {
          console.log("All images processed (some with errors)");
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
  
  // Initialize loader animations
  useEffect(() => {
    if (!isLoading) return;
    
    const ctx = gsap.context(() => {
      // Initialize loader animations
      initLoaderAnimations(loaderContentRef, progressBarRef);
    });
    
    return () => cleanupAnimation(ctx);
  }, [isLoading]);
  
  // Custom progress bar update
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress / 100,
        duration: 0.3,
        ease: "power1.out"
      });
    }
    
    if (counterRef.current) {
      counterRef.current.textContent = `${progress}%`;
    }
  }, [progress]);
  
  // Handle hiding the loader when animation is complete and images are loaded
  useEffect(() => {
    if (animationComplete && loaderRef.current && progress >= 100) {
      // Animate out the loader
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          // Set isLoading to false to unmount the loader completely
          setIsLoading(false);
        }
      });
    }
  }, [animationComplete, progress, setIsLoading]);
  
  // Don't render if not loading
  if (!isLoading) return null;
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center font-(family-name:--Standerd) loader-container"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
        transition: "opacity 0.5s ease-in-out"
      }}
    >
      <div ref={loaderContentRef} className="flex flex-col items-center">
        <div className="text-[6vh] md:text-[10vh] font-semibold mb-4 loader-text">LOADING</div>
        <div className="relative w-60 h-[2px] overflow-hidden loader-bar" 
          style={{ backgroundColor: `${textColor}20` }}>
          <div 
            ref={progressBarRef} 
            className="absolute top-0 left-0 h-full loader-progress"
            style={{
              backgroundColor: textColor,
              transform: "scaleX(0)",
              transformOrigin: "left"
            }}
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