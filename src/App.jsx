import { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from './components/navbar'
import Info from './components/info'
import Work from './components/work'
import Footer from './components/footer'
import PageTransition from './components/PageTransition'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import './index.css'

// AnimatedRoutes component to wrap each route with a transition
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Work />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </PageTransition>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Font loading check
  useEffect(() => {
    // Check if fonts are loaded
    document.fonts.ready.then(() => {
      console.log("Fonts are loaded and ready");
      setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    // Set GSAP defaults
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8
    });
    
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Add event listener for modal state
    const handleModalState = (e) => {
      if (e.detail?.isOpen !== undefined) {
        setIsModalOpen(e.detail.isOpen);
      }
    };

    window.addEventListener('modal-state-change', handleModalState);
    
    // Check if device supports hover
    const checkTouchDevice = () => {
      setIsTouchDevice(!window.matchMedia('(hover: hover)').matches);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    // Initialize magnetic effects and cursor trail after loading
    let cleanupMagnetic;
    let cleanupTrail;
    
    if (!isLoading && !isTouchDevice) {
      setTimeout(() => {
        cleanupMagnetic = initMagneticEffect();
        cleanupTrail = initCursorTrail();
        enhanceNavigation();
      }, 1000); // Delay to ensure DOM is fully loaded
    }
    
    return () => {
      window.removeEventListener('modal-state-change', handleModalState);
      window.removeEventListener('resize', checkTouchDevice);
      
      // Cleanup effects if initialized
      if (cleanupMagnetic) cleanupMagnetic();
      if (cleanupTrail) cleanupTrail();
    };
  }, [isLoading, isTouchDevice]);

  // ============ INTEGRATED MAGNETIC EFFECT FUNCTIONS ============

  // Utility function to add magnetic effect to elements
  const initMagneticEffect = () => {
    // Select all elements that should have magnetic effect
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
      const strength = element.getAttribute('data-magnetic-strength') || 0.3;
      const distance = element.getAttribute('data-magnetic-distance') || 40;
      
      // Initialize variables
      let bound;
      let elementCenterX;
      let elementCenterY;
      
      // Update boundary values on resize
      const calculateBounds = () => {
        bound = element.getBoundingClientRect();
        elementCenterX = bound.left + bound.width / 2;
        elementCenterY = bound.top + bound.height / 2;
      };
      
      // Calculate initial bounds
      calculateBounds();
      
      // Recalculate on resize
      window.addEventListener('resize', calculateBounds);
      window.addEventListener('scroll', calculateBounds);
      
      // Mouse move handler
      const handleMouseMove = (e) => {
        // Check if mouse is close enough to activate effect
        const distanceFromCenter = Math.sqrt(
          Math.pow(e.clientX - elementCenterX, 2) + 
          Math.pow(e.clientY - elementCenterY, 2)
        );
        
        if (distanceFromCenter < parseInt(distance)) {
          // Calculate movement based on distance from center
          const x = (e.clientX - elementCenterX) * parseFloat(strength);
          const y = (e.clientY - elementCenterY) * parseFloat(strength);
          
          // Apply transform
          element.style.transform = `translate(${x}px, ${y}px)`;
          element.classList.add('magnetic-active');
        } else {
          // Reset position when far away
          resetPosition();
        }
      };
      
      // Reset position function
      const resetPosition = () => {
        element.style.transform = 'translate(0px, 0px)';
        element.classList.remove('magnetic-active');
      };
      
      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', resetPosition);
      
      // Cleanup function (call this when component unmounts)
      element.cleanup = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', resetPosition);
        window.removeEventListener('resize', calculateBounds);
        window.removeEventListener('scroll', calculateBounds);
      };
    });
    
    // Return cleanup function
    return () => {
      magneticElements.forEach(element => {
        if (element.cleanup) {
          element.cleanup();
        }
      });
    };
  };

  // Function to add cursor trails
  const initCursorTrail = () => {
    const trailCount = 8;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = (1 - i / trailCount) * 0.3;
      document.body.appendChild(trail);
      trails.push({
        element: trail,
        x: 0,
        y: 0
      });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    const updateTrails = () => {
      trails.forEach((trail, index) => {
        // Add delay based on index
        const delay = index * 0.08;
        
        // Calculate new position with easing
        trail.x += (mouseX - trail.x) * (0.2 - delay * 0.05);
        trail.y += (mouseY - trail.y) * (0.2 - delay * 0.05);
        
        // Update position
        trail.element.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
        
        // Scale down as they follow
        trail.element.style.width = `${6 - index * 0.5}px`;
        trail.element.style.height = `${6 - index * 0.5}px`;
      });
      
      requestAnimationFrame(updateTrails);
    };
    
    updateTrails();
    
    // Return cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      trails.forEach(trail => {
        if (trail.element && trail.element.parentNode) {
          document.body.removeChild(trail.element);
        }
      });
    };
  };

  // Function to add magnetic effect to navigation items and buttons
  const enhanceNavigation = () => {
    // Find navigation items, footer links, and buttons
    const navLinks = document.querySelectorAll('nav a, .footer a, button, .link-underline');
    
    navLinks.forEach(link => {
      // Add data attributes for magnetic effect and cursor text
      link.setAttribute('data-magnetic', '');
      link.setAttribute('data-magnetic-strength', '0.2');
      link.setAttribute('data-magnetic-distance', '30');
      
      // Add custom hover effect that interacts with cursor
      link.addEventListener('mouseenter', () => {
        document.dispatchEvent(new CustomEvent('cursor-update', { 
          detail: { type: 'link', text: link.textContent.trim() || 'Click' }
        }));
      });
      
      link.addEventListener('mouseleave', () => {
        document.dispatchEvent(new CustomEvent('cursor-reset'));
      });
    });
    
    // Find project image containers
    const imageContainers = document.querySelectorAll('.image-container');
    
    imageContainers.forEach(container => {
      // Add view text for image hover
      container.setAttribute('data-cursor-text', 'View');
      
      // Add expand effect on hover
      container.addEventListener('mouseenter', () => {
        document.dispatchEvent(new CustomEvent('cursor-update', { 
          detail: { type: 'image', text: 'View' }
        }));
      });
      
      container.addEventListener('mouseleave', () => {
        document.dispatchEvent(new CustomEvent('cursor-reset'));
      });
    });
  };

  return (
    <Router>
      {/* Custom cursor - only show on non-touch devices */}
      {!isTouchDevice && <Cursor />}
      
      {/* Show loader */}
      <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
      
      {/* Main content with conditional opacity */}
      <div 
        className={`font-(family-name:--Standerd) font-medium relative min-h-screen transition-opacity duration-500 ${isModalOpen ? 'modal-parent-open' : ''}`}
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        <div className='fixed top-8 left-8 right-8 text-[1.55vh] z-[10]'>
          <Navbar />
        </div>
        
        {/* Changed class to ensure modals work properly */}
        <div className='p-8 relative pb-20 overflow-visible modal-content-parent'>
          {!isLoading && <AnimatedRoutes />}
        </div>
        
        <div className='fixed bottom-8 left-8 right-8 text-[1.55vh] z-10'>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App