import React, { useEffect, useRef, useCallback, memo, useState } from "react";
import { gsap } from "gsap";
import { 
  setupModalInitialState, 
  animateModalOpen, 
  animateModalClose, 
  cleanupAnimation 
} from "../animations/index";

// Extract navigation buttons into a separate memoized component
const NavigationButtons = memo(({ onPrev, onNext, disabled }) => (
  <div className="absolute inset-x-0 flex justify-between items-center px-4 z-10">
    <button 
      className={`p-3 rounded-full transition-all ${disabled ? 'opacity-50' : 'opacity-100'}`}
      style={{
        color: 'var(--text-color)',
        backgroundColor: 'rgba(var(--bg-color-rgb), 0.3)',
      }}
      onClick={onPrev}
      aria-label="Previous image"
      disabled={disabled}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <button 
      className={`p-3 rounded-full transition-all ${disabled ? 'opacity-50' : 'opacity-100'}`}
      style={{
        color: 'var(--text-color)',
        backgroundColor: 'rgba(var(--bg-color-rgb), 0.3)',
        backdropFilter: 'blur(5px)'
      }}
      onClick={onNext}
      aria-label="Next image"
      disabled={disabled}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
));

// Simple image component
const ProjectImage = memo(({ src, onError, isActive, animationClass }) => {
  // Helper function to get optimized image URL
  const getOptimizedImageUrl = (url) => {
    if (!url) return '';
    return url.replace('w=600', 'w=1200');
  };

  return (
    <img 
      src={getOptimizedImageUrl(src)}
      alt="Project view"
      className={`slider-image ${animationClass || ''}`}
      style={{
        maxHeight: "80vh",
        maxWidth: "100%",
        opacity: isActive ? 1 : 0,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
      onError={onError}
    />
  );
});

// Thumbnails component for image navigation
const Thumbnails = memo(({ images, currentIndex, onSelectImage }) => {
  if (!images || images.length <= 1) return null;
  
  return (
    <div className="thumbnails-container flex overflow-x-auto py-3 gap-2">
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className={`thumbnail-item cursor-pointer transition-all duration-300 border-2 rounded-sm overflow-hidden flex-shrink-0 ${idx === currentIndex ? 'opacity-100 border-[var(--text-color)]' : 'opacity-60 border-transparent'}`}
          style={{ 
            width: '60px', 
            height: '40px' 
          }}
          onClick={() => onSelectImage(idx)}
        >
          <img 
            src={img} 
            alt={`Thumbnail ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
});

// Extract project details as a memoized component
const ProjectDetails = memo(({ project }) => (
  <>
    <h2 className="text-[4vh] md:text-[6vh] font-semibold mb-4">
      {project.name}
    </h2>
    
    <div className="text-[1.6vh] md:text-[2vh] mb-4 opacity-80">
      {project.type}
    </div>
    
    <div className="text-[1.4vh] md:text-[1.8vh] mb-4 leading-relaxed max-w-[100%] sm:max-w-[35vw]">
      {project.description || "No description available for this project."}
    </div>
    
    {project.link && (
      <div className="mt-6">
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 border border-current rounded-sm transition-all duration-300 inline-block hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
        >
          {project.linkText || "View Project"}
        </a>
      </div>
    )}
  </>
));

function FixedFullscreenViewer({ 
  isOpen, 
  onClose, 
  currentImage, 
  projectData, 
  currentProjectId, 
  currentImageIndex, 
  setCurrentImageIndex, 
  setCurrentImage 
}) {
  // Refs for modal animation
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const modalThumbnailsRef = useRef(null);
  const modalNavButtonsRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Slider state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  
  // Get current project data
  const currentProject = projectData.find(p => p.id === currentProjectId);
  
  // Fallback image handling
  const handleImageError = useCallback((e) => {
    e.target.src = 'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=600'; 
  }, []);
  
  // Navigation handlers with animation
  const navigateToImage = useCallback((newIndex, direction) => {
    if (isTransitioning || !currentProject) return;
    
    setIsTransitioning(true);
    setSlideDirection(direction);
    
    // Apply slide animation class
    if (sliderRef.current) {
      sliderRef.current.classList.add(`slide-${direction}`);
    }
    
    // Update the current image
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setCurrentImage(currentProject.images[newIndex]);
      
      // Remove transition class and enable navigation after animation
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.classList.remove(`slide-${direction}`);
        }
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 300);
    }, 150);
    
  }, [currentProject, isTransitioning, setCurrentImage, setCurrentImageIndex]);
  
  const handlePrevImage = useCallback((e) => {
    e.stopPropagation();
    if (!currentProject || isTransitioning) return;
    
    const newIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
    navigateToImage(newIndex, 'prev');
  }, [currentProject, currentImageIndex, navigateToImage, isTransitioning]);
  
  const handleNextImage = useCallback((e) => {
    e.stopPropagation();
    if (!currentProject || isTransitioning) return;
    
    const newIndex = (currentImageIndex + 1) % currentProject.images.length;
    navigateToImage(newIndex, 'next');
  }, [currentProject, currentImageIndex, navigateToImage, isTransitioning]);
  
  // Handle thumbnail click
  const handleSelectImage = useCallback((index) => {
    if (index === currentImageIndex || isTransitioning || !currentProject) return;
    
    const direction = index > currentImageIndex ? 'next' : 'prev';
    navigateToImage(index, direction);
  }, [currentImageIndex, isTransitioning, currentProject, navigateToImage]);
  
  // Close modal handler
  const closeModal = useCallback(() => {
    // Get elements for animation
    const modalElement = modalRef.current;
    const contentElement = modalContentRef.current;
    const thumbnailsElement = modalThumbnailsRef.current;
    const navButtons = modalNavButtonsRef.current?.querySelectorAll('button');
    
    // Define completion callback
    const onAnimationComplete = () => {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.classList.remove('modal-open');
      
      // Dispatch event for App component to know modal is closed
      window.dispatchEvent(new CustomEvent('modal-state-change', { 
        detail: { isOpen: false } 
      }));
      
      // Call the onClose callback
      onClose();
    };
    
    // Animate modal closing
    const ctx = gsap.context(() => {
      animateModalClose(
        {
          modalElement,
          contentElement,
          thumbnailsElement,
          navButtons
        },
        onAnimationComplete
      );
    });
    
    return () => cleanupAnimation(ctx);
  }, [onClose]);
  
  // Watch for theme changes
  useEffect(() => {
    if (!isOpen) return;
    
    // Function to detect theme changes and update modal accordingly
    const detectThemeChange = () => {
      if (modalRef.current) {
        // Force the modal to update with current CSS variables
        modalRef.current.style.backgroundColor = 'var(--bg-color)';
        
        if (modalThumbnailsRef.current) {
          modalThumbnailsRef.current.style.backgroundColor = 'var(--bg-color)';
        }
        
        // Update buttons with current theme colors
        const buttons = document.querySelectorAll('.modal-container button');
        buttons.forEach(button => {
          button.style.color = 'var(--text-color)';
          button.style.backgroundColor = 'rgba(var(--bg-color-rgb), 0.3)';
        });
      }
    };
    
    // Set up mutation observer to detect theme class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          detectThemeChange();
        }
      });
    });
    
    // Run immediately
    detectThemeChange();
    
    // Start observing
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class'] 
    });
    
    // Cleanup
    return () => observer.disconnect();
  }, [isOpen]);
  
  // Handle modal open animations and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    // Prevent scrolling while modal is open
    document.body.style.overflow = 'hidden'; 
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.classList.add('modal-open');
    
    // Dispatch event for App component to know modal is open
    window.dispatchEvent(new CustomEvent('modal-state-change', { 
      detail: { isOpen: true } 
    }));
    
    // Use requestAnimationFrame to ensure the modal is rendered before animating
    requestAnimationFrame(() => {
      // Get elements after modal is rendered
      const modalElement = modalRef.current;
      const contentElement = modalContentRef.current;
      const thumbnailsElement = modalThumbnailsRef.current;
      const navButtons = modalNavButtonsRef.current?.querySelectorAll('button');
      
      if (!modalElement || !contentElement) return;
      
      // Set up initial states for modal elements
      setupModalInitialState({
        modalElement,
        contentElement,
        thumbnailsElement,
        navButtons
      });
      
      // Animate modal opening
      const ctx = gsap.context(() => {
        animateModalOpen({
          modalElement,
          contentElement,
          thumbnailsElement,
          navButtons
        });
      });
      
      return () => cleanupAnimation(ctx);
    });
    
    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (!isOpen || !currentProject || isTransitioning) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // Previous image
        const newIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
        navigateToImage(newIndex, 'prev');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // Next image
        const newIndex = (currentImageIndex + 1) % currentProject.images.length;
        navigateToImage(newIndex, 'next');
      } else if (e.key === 'Escape') {
        // Close modal
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, currentProject, closeModal, navigateToImage, isTransitioning]);
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-500 flex items-center justify-center modal-container"
    >
      {/* Close button - positioned in the top right */}
      <button 
        className="absolute top-0 md:top-18 right-4 p-3 rounded-full transition-all z-[99999]"
        style={{
          color: 'var(--text-color)',
          backgroundColor: 'rgba(var(--bg-color-rgb), 0.7)',
          backdropFilter: 'blur(5px)',
          border: '1px solid var(--text-color)'
        }}
        onClick={closeModal}
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Two-Column Layout */}
      <div 
        ref={modalContentRef} 
        className="grid grid-cols-1 md:grid-cols-2 h-full w-[100vw] p-4 md:p-8 gap-4"
        style={{ opacity: 0 }}
      >
        {/* Left Column - Image */}
        <div className="relative flex flex-col items-center justify-center h-full">
          {/* Navigation buttons */}
          {currentProject && (
            <div ref={modalNavButtonsRef}>
              <NavigationButtons 
                onPrev={handlePrevImage}
                onNext={handleNextImage}
                disabled={isTransitioning}
              />
            </div>
          )}
          
          {/* Main Image Slider */}
          <div className="h-full flex-grow flex items-center justify-center overflow-hidden w-full">
            <div 
              ref={sliderRef} 
              className={`image-slider relative w-full h-full flex items-center justify-center ${isTransitioning ? `is-transitioning slide-${slideDirection}` : ''}`}
            >
              {currentProject && currentImage && (
                <ProjectImage 
                  src={currentImage}
                  onError={handleImageError}
                  isActive={true}
                />
              )}
            </div>
          </div>
          
          {/* Thumbnails */}
          {currentProject && currentProject.images.length > 1 && (
            <div 
              ref={modalThumbnailsRef}
              className="w-full mt-4 md:block"
            >
              <Thumbnails 
                images={currentProject.images}
                currentIndex={currentImageIndex}
                onSelectImage={handleSelectImage}
              />
            </div>
          )}
          
          {/* Image counter - only visible on smaller screens */}
          {currentProject && (
            <div 
              className="md:hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full image-counter"
              style={{ 
                color: 'var(--text-color)',
                backgroundColor: 'rgba(var(--bg-color-rgb), 0.7)',
                backdropFilter: 'blur(5px)'
              }}
            >
              {currentImageIndex + 1} / {currentProject.images.length}
            </div>
          )}
        </div>
        
        {/* Right Column - Project Info */}
        <div className="flex flex-col h-full justify-end overflow-y-auto px-4 py-8 md:py-12">
          {currentProject && (
            <ProjectDetails project={currentProject} />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(FixedFullscreenViewer);