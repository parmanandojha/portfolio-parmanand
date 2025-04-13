import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectData from "./projectData"; // Import project data
import FullscreenViewer from "./FullscreenViewer"; // Import the fullscreen viewer component
import { initWorkAnimations, setupProjectHoverEffects, cleanupAnimation } from "../animations/index";
import Footer from './Footer.jsx'

// Register ScrollTrigger plugin to ensure it's available
gsap.registerPlugin(ScrollTrigger);

function Work() {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    
    // State for fullscreen viewer
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Create projects array with React refs for animations
    const [projects, setProjects] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Initialize projects with refs
    useEffect(() => {
        console.log("Initializing project refs");
        // Add refs to the projects
        const projectsWithRefs = projectData.map(project => ({
            ...project,
            nameRef: React.createRef(),
            typeRef: React.createRef(),
            descRef: React.createRef(),
            linkRef: React.createRef(),
            imagesRef: React.createRef()
        }));
        
        setProjects(projectsWithRefs);
    }, []);
    
    // Handle animations after projects are set up and component is mounted
    useEffect(() => {
        if (!containerRef.current || projects.length === 0) return;
        console.log("Setting up work animations with", projects.length, "projects");
        
        // Cleanup any existing ScrollTrigger instances to prevent duplicates
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.id && trigger.vars.id.includes('work-')) {
                trigger.kill();
            }
        });
        
        // Create animation context
        const ctx = gsap.context(() => {
            // Force a layout recalculation to make sure all elements are positioned correctly
            window.dispatchEvent(new Event('resize'));
            
            // Initialize animations with a short delay to ensure DOM is fully rendered
            setTimeout(() => {
                console.log("Running initWorkAnimations");
                initWorkAnimations(projects, headerRef);
                
                // Force ScrollTrigger refresh after animations are set up
                ScrollTrigger.refresh();
                console.log("ScrollTrigger refreshed");
                
                // Set up hover effects after initial animations
                setTimeout(setupProjectHoverEffects, 500);
            }, 100);
        }, containerRef);
        
        setIsInitialized(true);
        
        // Return cleanup function
        return () => {
            console.log("Cleaning up work animations");
            cleanupAnimation(ctx);
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.id && trigger.vars.id.includes('work-')) {
                    trigger.kill();
                }
            });
        };
    }, [projects]);
    
    // Add ScrollTrigger refresh when the window is resized
    useEffect(() => {
        const handleResize = () => {
            console.log("Window resized, refreshing ScrollTrigger");
            ScrollTrigger.refresh();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    // Force ScrollTrigger refresh when component renders
    useEffect(() => {
        if (isInitialized) {
            console.log("Component rendered, refreshing ScrollTrigger");
            // Use a short timeout to ensure DOM is ready
            const timeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
            
            return () => clearTimeout(timeout);
        }
    });
    
    // Fallback image handling
    const handleImageError = (e) => {
        e.target.src = 'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=600'; 
    };
    
    // Open fullscreen image modal
    const openFullscreenImage = (imageUrl, projectId, imageIndex) => {
        setSelectedImage(imageUrl);
        setCurrentProject(projectId);
        setCurrentImageIndex(imageIndex);
        setIsModalOpen(true);
    };
    
    // Close fullscreen image modal
    const closeFullscreenImage = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        setCurrentProject(null);
        setCurrentImageIndex(0);
    };
    
    // If projects haven't been initialized with refs yet, show loading
    if (projects.length === 0) {
        return <div>Loading projects...</div>;
    }
    
    return (
        <div ref={containerRef} className="relative h-full content-center pt-24 md:pt-24">
            {/* Heading - no inline styles or opacity classes */}
            <h1 
                ref={headerRef} 
                className="text-[6vh] md:text-[10vh] pt-8 md:pt-0 pb-8 font-semibold uppercase inline-block leading-[1]"
            >
                Selected <br></br>Projects/
            </h1>
            
            {projects.map((project, index) => (
                <div 
                    key={project.id} 
                    className={`mb-8 ${index === projects.length - 1 ? 'pb-[4vh]' : ''}`}
                >
                    {/* Project details - stack vertically on mobile, grid on larger screens */}
                    <div className="grid grid-cols-4 md:grid-cols-4 pt-12 md:pt-12 gap-2 md:gap-2 text-[1.55vh] md:text-[1.75vh]">
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
                            <div className="flex flex-col">
                                <span 
                                    ref={project.descRef}
                                    className="inline-block w-[40vw] sm:w-[36vw] mb-2"
                                >
                                    {project.description}
                                </span>
                                
                                {/* Project Link Button */}
                                {project.link && (
                                    <div ref={project.linkRef} className="mt-2 mb-2 text-[1vh] sm:text-[1.4vh]">
                                        <a 
                                            href={project.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="project-link-btn inline-block px-4 py-1 border border-current rounded-sm transition-all duration-300"
                                            style={{ borderColor: 'var(--text-color)' }}
                                        >
                                            {project.linkText || "View Project"}
                                        </a>
                                    </div>
                                )}
                            </div>
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
                                    opacity: 0.9, // Default visible style, gsap will override this
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
            
            {/* Fullscreen Viewer Component */}
            <FullscreenViewer 
                isOpen={isModalOpen}
                onClose={closeFullscreenImage}
                currentImage={selectedImage}
                images={currentProject ? projectData.find(p => p.id === currentProject)?.images : []}
                projectData={projectData}
                currentProjectId={currentProject}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                setCurrentImage={setSelectedImage}
            />
             {/* Footer - at the bottom of the flex container */}
          <footer className='w-full pt-24'>
            <Footer />
          </footer>
        </div>
    );
}

export default Work;