import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function Work() {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const projectRefs = useRef([]);
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Refs for modal animation
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);
    const modalThumbnailsRef = useRef(null);
    const modalNavButtonsRef = useRef(null);
    
    // Project data with Pexels images
    const projects = [
        {
            id: 1,
            name: "Exponify",
            type: "/ Website Design",
            description: "",
            images: [
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
            ],
            nameRef: React.createRef(),
            typeRef: React.createRef(),
            descRef: React.createRef(),
            imagesRef: React.createRef()
        },
        {
            id: 2,
            name: "Ila",
            type: "/ Branding",
            description: "",
            images: [
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
            ],
            nameRef: React.createRef(),
            typeRef: React.createRef(),
            descRef: React.createRef(),
            imagesRef: React.createRef()
        },
        {
            id: 3,
            name: "SmartTek",
            type: "/ Branding, UI/UX",
            description: "",
            images: [
                "project images/smarttek1.webp", 
                "project images/smarttek2.webp",
                "project images/smarttek3.webp",
                "project images/smarttek4.webp",
                "project images/smarttek5.webp",
                "project images/smarttek6.webp", 
                "project images/smarttek7.webp",
                "project images/smarttek8.webp", 
                "project images/smarttek9.webp",
            ],
            nameRef: React.createRef(),
            typeRef: React.createRef(),
            descRef: React.createRef(),
            imagesRef: React.createRef()
        },
        {
            id: 4,
            name: "Haven",
            type: "/ UI/UX",
            description: "",
            images: [
                "project images/Haven1.webp", 
                "project images/Haven2.webp",
                "project images/Haven4.webp",
                "project images/Haven7.webp",
                "project images/Haven8.webp",
                "project images/Haven9.webp"
            ],
            nameRef: React.createRef(),
            typeRef: React.createRef(),
            descRef: React.createRef(),
            imagesRef: React.createRef()
        },
        {
            id: 5,
            name: "Maven",
            type: "/ Branding",
            description: "",
            images: [
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
            ],
            nameRef: React.createRef(),
            typeRef: React.createRef(),
            descRef: React.createRef(),
            imagesRef: React.createRef()
        }
    ];
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        const ctx = gsap.context(() => {
            // Master timeline with smoother easing
            const masterTimeline = gsap.timeline({
                defaults: {
                    ease: "power2.out"
                }
            });
            
            // Header animation - smoother and slower
            masterTimeline.fromTo(headerRef.current, 
                { y: 80, opacity: 0 }, 
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1.2, 
                    ease: "power3.inout" 
                }
            );

            // Animate projects one by one with nicer sequencing
            projects.forEach((project, projectIndex) => {
                // Get elements for this project
                const textElements = [
                    project.nameRef.current, 
                    project.typeRef.current, 
                    project.descRef.current
                ];
                
                // Base delay with slight overlap for flow
                const baseDelay = 0.7 + (projectIndex * 0.12);
                
                // Text elements animation - more subtle motion
                masterTimeline.fromTo(textElements, 
                    { y: 40, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.8, 
                        stagger: 0.12,
                        ease: "power3.out"
                    },
                    baseDelay
                );
                
                // Image containers with smoother, more delicate animation
                if (project.imagesRef.current) {
                    const imageContainers = project.imagesRef.current.querySelectorAll('.image-container');
                    
                    // First set a uniform initial state
                    gsap.set(imageContainers, { 
                        y: 15, 
                        opacity: 0,
                        scale: 0.98
                    });
                    
                    // Animate with a nice fluid motion
                    masterTimeline.to(imageContainers, { 
                        y: 0, 
                        opacity: 1,
                        scale: 1,
                        duration: 0.9,
                        ease: "power3.inout",
                        stagger: {
                            amount: 0.6, // Spread stagger over longer time for smoother effect
                            from: "start",
                            grid: "auto",
                            ease: "power3.inout"
                        },
                        clearProps: "transform,opacity,scale" // Important for hover effects
                    }, baseDelay + 0.25);
                }
            });
            
            // Set up hover effects - smoother transitions
            const setupHoverEffects = () => {
                document.querySelectorAll('.image-container').forEach(container => {
                    // Create hover animations
                    const enterTl = gsap.timeline({ paused: true });
                    const leaveTl = gsap.timeline({ paused: true });
                    
                    // Smooth enter animation
                    enterTl.to(container, {
                        y: -5,
                        scale: 1.02,
                        boxShadow: "0 15px 25px rgba(0,0,0,0.08)",
                        duration: 0.4,
                        ease: "power3.out"
                    });
                    
                    // Smooth leave animation
                    leaveTl.to(container, {
                        y: 0,
                        scale: 1,
                        boxShadow: "0 0 0 rgba(0,0,0,0)",
                        duration: 0.4,
                        ease: "power3.inOut"
                    });
                    
                    // Apply hover events
                    container.addEventListener('mouseenter', () => {
                        leaveTl.pause(0); // Pause and reset leave animation
                        enterTl.restart(); // Start enter animation
                    });
                    
                    container.addEventListener('mouseleave', () => {
                        enterTl.pause(); // Pause enter animation
                        leaveTl.restart(); // Start leave animation
                    });
                });
            };
            
            // Set up hover effects after initial animations complete
            setTimeout(setupHoverEffects, 2500);
            
        }, containerRef);
        
        return () => ctx.revert();
    }, []);
    
    // Fallback image handling
    const handleImageError = (e) => {
        e.target.src = 'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=600'; 
    };
    
    // State to track current project and image index
    const [currentProject, setCurrentProject] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentTheme, setCurrentTheme] = useState("");
    
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
            
            // Update our state with the current theme
            setCurrentTheme(themeClass || '');
            
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
                
                // Update thumbnails
                const thumbs = document.querySelectorAll('.thumbnail-item');
                thumbs.forEach((thumb, idx) => {
                    if (idx === currentImageIndex) {
                        thumb.style.border = '2px solid var(--text-color)';
                    } else {
                        thumb.style.border = '1px solid rgba(var(--text-color-rgb), 0.3)';
                    }
                });
                
                // Update counter
                const counter = document.querySelector('.image-counter');
                if (counter) {
                    counter.style.color = 'var(--text-color)';
                    counter.style.backgroundColor = 'rgba(var(--bg-color-rgb), 0.7)';
                }
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
    
    // Open fullscreen modal with smoother animation
    const openFullscreenImage = (imageUrl, projectId, imageIndex) => {
        // First set the state so the modal renders
        setSelectedImage(imageUrl);
        setCurrentProject(projectId);
        setCurrentImageIndex(imageIndex);
        
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
                
                // Make modal visible but fully transparent to start animation from
                gsap.set(modalElement, { 
                    backgroundColor: "var(--bg-color)",
                    // Start with full transparency
                    opacity: 0,
                    visibility: "visible"
                });
                
                // Setup initial states for content and thumbnails with smoother positioning
                gsap.set(contentElement, { 
                    opacity: 0, 
                    scale: 0.95,
                    y: 15
                });
                
                if (thumbnailsElement) {
                    gsap.set(thumbnailsElement, { 
                        opacity: 0, 
                        x: -15
                    });
                }
                
                if (navButtons && navButtons.length) {
                    gsap.set(navButtons, { 
                        opacity: 0, 
                        scale: 0.9
                    });
                }
                
                // Create a timeline for opening animation with smoother easing
                const tl = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                        duration: 0.5
                    }
                });
                
                // Animation sequence
                tl.to(modalElement, { 
                    opacity: 1,
                    duration: 0.6
                })
                .to(contentElement, { 
                    opacity: 1, 
                    scale: 1,
                    y: 0,
                    duration: 0.6
                }, "-=0.5") // Overlap for smoother feel
                
                if (thumbnailsElement) {
                    tl.to(thumbnailsElement, { 
                        opacity: 1, 
                        x: 0,
                        duration: 0.5
                    }, "-=0.4"); // Slight delay
                }
                
                if (navButtons && navButtons.length) {
                    tl.to(navButtons, { 
                        opacity: 1, 
                        scale: 1, 
                        stagger: 0.08, // Increased stagger
                        duration: 0.5
                    }, "-=0.4");
                }
            });
        });
    };
    
    // Close fullscreen modal with smoother animation
    const closeFullscreenImage = () => {
        // Get elements for animation
        const modalElement = modalRef.current;
        const contentElement = modalContentRef.current;
        const thumbnailsElement = modalThumbnailsRef.current;
        const navButtons = modalNavButtonsRef.current?.querySelectorAll('button');
        
        // Create a timeline for closing animation with better easing
        const tl = gsap.timeline({
            defaults: {
                ease: "power3.inOut", // Smoother easing
                duration: 0.5
            },
            onComplete: () => {
                // Reset state after animation completes
                setSelectedImage(null);
                setCurrentProject(null);
                setCurrentImageIndex(0);
                
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
            }
        });
        
        // Animation sequence
        tl.to(navButtons, { opacity: 0, scale: 0.9, stagger: 0.06 })
          .to(thumbnailsElement, { opacity: 0, x: -15 }, "-=0.4")
          .to(contentElement, { opacity: 0, scale: 0.95, y: 10 }, "-=0.4")
          .to(modalElement, { opacity: 0, duration: 0.6 }, "-=0.3");
    };
    
    // Add keyboard navigation for the image slider
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            
            const project = projects.find(p => p.id === currentProject);
            if (!project) return;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                // Previous image
                const newIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
                setCurrentImageIndex(newIndex);
                setSelectedImage(project.images[newIndex]);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                // Next image
                const newIndex = (currentImageIndex + 1) % project.images.length;
                setCurrentImageIndex(newIndex);
                setSelectedImage(project.images[newIndex]);
            } else if (e.key === 'Escape') {
                // Close modal
                closeFullscreenImage();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, currentProject, currentImageIndex, projects]);
    
    return (
        <div ref={containerRef} className="relative h-full content-center py-12 md:py-24">
            <h1 ref={headerRef} className="text-[6vh] md:text-[10vh] pt-10 md:pt-0 pb-10 font-semibold uppercase inline-block leading-[1]">Selected <br></br>Projects/</h1>
            
            {projects.map((project, index) => (
                <div 
                    key={project.id} 
                    className={`mb-12 ${index === projects.length - 1 ? 'pb-[4vh]' : ''}`}
                >
                    {/* Project details - stack vertically on mobile, grid on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 pt-12 md:pt-12 gap-1 md:gap-0 text-[1.55vh] md:text-[1.75vh]">
                        <div>
                            <span 
                                ref={project.nameRef} 
                                className="inline-block font-medium"
                            >
                                {project.name}
                            </span>
                        </div>
                        <div>
                            <span 
                                ref={project.typeRef}
                                className="inline-block"
                            >
                                {project.type}
                            </span>
                        </div>
                        <div className="sm:col-span-2">
                            <span 
                                ref={project.descRef}
                                className="inline-block"
                            >
                                {project.description}
                            </span>
                        </div>
                    </div>
                    
                    {/* Image grid with improved animation */}
                    <div 
                        ref={project.imagesRef} 
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 py-4 gap-2"
                    >
                        {project.images.map((img, imageIndex) => (
                            <div 
                                key={imageIndex} 
                                data-project-id={project.id}
                                data-image-index={imageIndex}
                                className="image-container overflow-hidden cursor-pointer h-full sm:aspect-auto rounded-sm shadow-sm"
                                style={{
                                    backgroundColor: "var(--bg-color)",
                                    opacity: 0.9,
                                }}
                                onClick={() => openFullscreenImage(img, project.id, imageIndex)}
                            >
                                <img 
                                    src={img} 
                                    alt={`${project.name} image ${imageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {/* Fullscreen Image Modal */}
            {selectedImage && (
                <div 
                    ref={modalRef}
                    className="fixed inset-0 z-500 flex items-center justify-center modal-container"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        margin: 0,
                        padding: 0,
                        overflow: 'hidden',
                        opacity: 0,
                        zIndex: 9999,
                        transform: 'none',
                        willChange: 'opacity',
                        transformOrigin: 'center center',
                        backgroundColor: 'var(--bg-color)',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {/* Main content container with responsive layout */}
                        <div ref={modalContentRef} className="flex flex-col items-center justify-center w-full h-full relative" style={{ position: 'absolute', inset: 0, paddingBottom: '10vh' }}>
                        {/* Close button */}
                        <button 
                            className="absolute top-20 right-4 p-2 rounded-full transition-all z-50"
                            style={{
                                color: 'var(--text-color)',
                                backgroundColor: 'rgba(var(--bg-color-rgb, 240, 240, 240), 0.3)',
                                backdropFilter: 'blur(5px)'
                            }}
                            onClick={closeFullscreenImage}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* Navigation buttons */}
                        {currentProject && (
                            <div ref={modalNavButtonsRef} className="modal-nav-buttons">
                                {/* Previous button */}
                                <button 
                                    className="absolute left-4 md:left-28 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all z-50"
                                    style={{
                                        color: 'var(--text-color)',
                                        backgroundColor: 'rgba(var(--bg-color-rgb, 240, 240, 240), 0.3)',
                                        backdropFilter: 'blur(5px)'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const project = projects.find(p => p.id === currentProject);
                                        if (project) {
                                            const newIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
                                            setCurrentImageIndex(newIndex);
                                            setSelectedImage(project.images[newIndex]);
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                
                                {/* Next button */}
                                <button 
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all z-50"
                                    style={{
                                        color: 'var(--text-color)',
                                        backgroundColor: 'rgba(var(--bg-color-rgb, 240, 240, 240), 0.3)',
                                        backdropFilter: 'blur(5px)'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const project = projects.find(p => p.id === currentProject);
                                        if (project) {
                                            const newIndex = (currentImageIndex + 1) % project.images.length;
                                            setCurrentImageIndex(newIndex);
                                            setSelectedImage(project.images[newIndex]);
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        
                        {/* Fullscreen image */}
                        <img 
                            src={selectedImage.replace('w=600', 'w=1200')} // Load higher quality for fullscreen
                            alt="Fullscreen view"
                            className="max-h-3/5 max-w-full object-contain p-4 m-auto"
                            style={{
                                height: "auto",
                                maxHeight: "70vh",
                                margin: "auto",
                                display: "block"
                            }}
                            onError={handleImageError}
                            onClick={(e) => e.stopPropagation()}
                        />
                        </div>
                        
                        {/* Thumbnail strip - left side on desktop, bottom on mobile */}
                        {currentProject && (
                            <div 
                                ref={modalThumbnailsRef} 
                                className="hidden md:block w-full md:w-20 h-20 md:h-[90vh] md:fixed md:left-0 bottom-0 md:top-0 overflow-y-hidden md:overflow-y-auto overflow-x-auto flex flex-row md:flex-col p-1 thumbnail-strip"
                                style={{ 
                                    position: 'fixed',
                                    zIndex: 9999,
                                    /*backgroundColor: 'var(--bg-color)',*/
                                    opacity: 0.95
                                }}>
                                <div className="flex md:flex-col flex-row gap-1 w-full md:pt-16">
                                    {projects.find(p => p.id === currentProject)?.images.map((img, idx) => (
                                        <div 
                                            key={idx}
                                            className={`cursor-pointer transition-all hover:opacity-100 thumbnail-item ${
                                                idx === currentImageIndex 
                                                    ? 'opacity-100' 
                                                    : 'opacity-70'
                                            }`}
                                            style={{
                                                border: idx === currentImageIndex 
                                                    ? `2px solid var(--text-color)` 
                                                    : `1px solid rgba(var(--text-color-rgb, 100, 100, 100), 0.3)`
                                            }}
                                            onClick={() => {
                                                setCurrentImageIndex(idx);
                                                setSelectedImage(img);
                                            }}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-12 h-12 md:w-14 md:h-14 object-cover"
                                                onError={handleImageError}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Image counter - only visible on mobile */}
                        {currentProject && (
                            <div 
                                className="md:hidden absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full image-counter"
                                style={{ 
                                    top: "10vh",
                                    color: 'var(--text-color)',
                                    backgroundColor: 'rgba(var(--bg-color-rgb, 240, 240, 240), 0.7)',
                                    backdropFilter: 'blur(5px)'
                                }}
                            >
                                {currentImageIndex + 1} / {projects.find(p => p.id === currentProject)?.images.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Work;