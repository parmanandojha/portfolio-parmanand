import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  setupModalInitialState, 
  animateModalOpen, 
  animateModalClose, 
  updateThumbnailStyles, 
  cleanupAnimation 
} from "../animations/index";

function FullscreenViewer({ 
  isOpen, 
  onClose, 
  currentImage, 
  images, 
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
  
  // Fallback image handling
  const handleImageError = (e) => {
    e.target.src = 'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=600'; 
  };
  
  // Helper to determine if we're in dark mode for contrast colors
  const isDarkMode = () => {
    return document.documentElement.classList.contains('dark-theme');
  };
  
  // Watch for theme changes and update modal accordingly
  useEffect(() => {
    // Function to detect theme changes
    const detectThemeChange = () => {
      // Get all theme-related classes
      const htmlClasses = document.documentElement.className.split(' ');
      const themeClass = htmlClasses.find(cls => cls.startsWith('theme-'));
      
      // If modal is open, ensure its background updates
      if (modalRef.current) {
        // Force the modal to update with current CSS variables
        modalRef.current.style.backgroundColor = 'var(--bg-color)';
        
        // Also update thumbnail container
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
    
    // Run immediately
    detectThemeChange();
    
    // Set up mutation observer to detect theme class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          detectThemeChange();
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class'] 
    });
    
    // Cleanup
    return () => observer.disconnect();
  }, [currentImageIndex, modalRef]);
  
  // Animate opening of the modal
  useEffect(() => {
    if (!isOpen) return;
    
    // Prevent scrolling while modal is open
    document.body.style.overflow = 'hidden'; 
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.classList.add('modal-open'); // Add class for any additional styling
    
    // Dispatch event for App component to know modal is open
    window.dispatchEvent(new CustomEvent('modal-state-change', { 
      detail: { isOpen: true } 
    }));
    
    // Use requestAnimationFrame to ensure the modal is rendered before animating
    requestAnimationFrame(() => {
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
    });
    
    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      const project = projectData.find(p => p.id === currentProjectId);
      if (!project) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // Previous image
        const newIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
        setCurrentImageIndex(newIndex);
        setCurrentImage(project.images[newIndex]);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // Next image
        const newIndex = (currentImageIndex + 1) % project.images.length;
        setCurrentImageIndex(newIndex);
        setCurrentImage(project.images[newIndex]);
      } else if (e.key === 'Escape') {
        // Close modal
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, currentProjectId, projectData, setCurrentImageIndex, setCurrentImage]);
  
  // Close fullscreen modal with smoother animation
  const closeModal = () => {
    // Get elements for animation
    const modalElement = modalRef.current;
    const contentElement = modalContentRef.current;
    const thumbnailsElement = modalThumbnailsRef.current;
    const navButtons = modalNavButtonsRef.current?.querySelectorAll('button');
    
    // Define completion callback
    const onComplete = () => {
      // Restore scrolling
      document.body.style.overflow = ''; 
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.classList.remove('modal-open'); // Remove class
      
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
        onComplete
      );
    });
    
    return () => cleanupAnimation(ctx);
  };
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  // Get current project data
  const currentProject = projectData.find(p => p.id === currentProjectId);
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-500 flex items-center justify-center modal-container"
    >
      {/* Close button - positioned in the top right with improved visibility */}
      <button 
        className="absolute top-0 md:top-18 right-4 p-3 rounded-full transition-all z-[99999]"
        style={{
          color: 'var(--text-color)',
          backgroundColor: 'rgba(var(--bg-color-rgb), 0.7)',
          backdropFilter: 'blur(5px)',
          border: '1px solid var(--text-color)'
        }}
        onClick={closeModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* New Two-Column Layout */}
      <div 
        ref={modalContentRef} 
        className="grid grid-cols-1 md:grid-cols-2 h-full w-[100vw] p-4 md:p-8 gap-4"
        style={{ opacity: 0 }}
      >
        {/* Left Column - Image */}
        <div className="relative flex items-center justify-center h-full">
          {/* Navigation buttons */}
          {currentProject && (
            <div ref={modalNavButtonsRef} className="absolute inset-x-0 flex justify-between items-center px-4 z-10">
              {/* Previous button */}
              <button 
                className="p-3 rounded-full transition-all"
                style={{
                  color: 'var(--text-color)',
                  backgroundColor: 'rgba(var(--bg-color-rgb), 0.3)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentProject) {
                    const newIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
                    setCurrentImageIndex(newIndex);
                    setCurrentImage(currentProject.images[newIndex]);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Next button - FIXED */}
              <button 
                className="p-3 rounded-full transition-all"
                style={{
                  color: 'var(--text-color)',
                  backgroundColor: 'rgba(var(--bg-color-rgb), 0.3)',
                  backdropFilter: 'blur(5px)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentProject) {
                    const newIndex = (currentImageIndex + 1) % currentProject.images.length;
                    setCurrentImageIndex(newIndex);
                    setCurrentImage(currentProject.images[newIndex]); // Fixed: using currentProject instead of project
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Main Image */}
          <div className="h-full flex items-center justify-center overflow-hidden">
            <img 
              src={currentImage?.replace('w=600', 'w=1200')} // Load higher quality
              alt="Project view"
              className="max-h-full max-w-full object-contain"
              style={{
                height: "auto",
                maxHeight: "80vh",
                margin: "auto",
                display: "block"
              }}
              onError={handleImageError}
            />
          </div>
          
          {/* Image counter - only visible on mobile */}
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
            <>
              {/* Project Title */}
              <h2 className="text-[4vh] md:text-[6vh] font-semibold mb-4">
                {currentProject.name}
              </h2>
              
              {/* Project Type */}
              <div className="text-[1.6vh] md:text-[2vh] mb-4 opacity-80">
                {currentProject.type}
              </div>
              
              {/* Project Description */}
              <div className="text-[1.4vh] md:text-[1.8vh] mb-4 leading-relaxed max-w-[100%] sm:max-w-[35vw]">
                {currentProject.description || "No description available for this project."}
              </div>
              
              {/* Project Link Button */}
              {currentProject.link && (
                <div className="mt-6">
                  <a 
                    href={currentProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-current rounded-sm transition-all duration-300 inline-block hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
                  >
                    {currentProject.linkText || "View Project"}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FullscreenViewer;