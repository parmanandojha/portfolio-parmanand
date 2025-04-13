import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/navbar.jsx'
import Info from './components/info.jsx'
import Work from './components/work.jsx'
import PageTransition from './components/PageTransition.jsx'
import Cursor from './components/Cursor.jsx'
import Loader from './components/Loader.jsx'
import './index.css'
import { initMagneticEffect, initCursorTrail, enhanceNavigation } from './animations/magneticEffects.js'

// Register ScrollTrigger plugin globally
gsap.registerPlugin(ScrollTrigger);

// AnimatedRoutes component to wrap each route with a transition
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Refresh ScrollTrigger when route changes
  useEffect(() => {
    // Kill existing ScrollTriggers first
    ScrollTrigger.getAll().forEach(t => t.kill());
    
    // After route change and render, refresh ScrollTrigger
    const timer = setTimeout(() => {
      // Force a refresh
      ScrollTrigger.refresh(true);
      console.log("ScrollTrigger refreshed after route change");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/info" replace />} />
        <Route path="/work" element={<Work />} />
        <Route path="/info" element={<Info />} />
        {/* Redirect from root to info page */}
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
      
      // Refresh ScrollTrigger after fonts are loaded
      ScrollTrigger.refresh(true);
      console.log("ScrollTrigger refreshed after fonts loaded");
    });
  }, []);

  useEffect(() => {
    // Set GSAP defaults
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8
    });
    
    // Add event listener for modal state
    const handleModalState = (e) => {
      if (e.detail?.isOpen !== undefined) {
        setIsModalOpen(e.detail.isOpen);
        
        // If modal is closed, refresh ScrollTrigger
        if (!e.detail.isOpen) {
          setTimeout(() => {
            ScrollTrigger.refresh();
            console.log("ScrollTrigger refreshed after modal close");
          }, 400);
        }
      }
    };

    window.addEventListener('modal-state-change', handleModalState);
    
    // Check if device supports hover
    const checkTouchDevice = () => {
      setIsTouchDevice(!window.matchMedia('(hover: hover)').matches);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    // Initialize magnetic effects and cursor trail using our animation modules
    let cleanupMagnetic;
    let cleanupTrail;
    
    if (!isTouchDevice && !isLoading) {
      setTimeout(() => {
        cleanupMagnetic = initMagneticEffect();
        cleanupTrail = initCursorTrail();
        enhanceNavigation();
      }, 1000); // Delay to ensure DOM is fully loaded
    }
    
    // Handle resize for ScrollTrigger - with debounce
    const handleResize = () => {
      if (window.scrollTriggerResizeTimer) {
        clearTimeout(window.scrollTriggerResizeTimer);
      }
      
      window.scrollTriggerResizeTimer = setTimeout(() => {
        console.log("Refreshing ScrollTrigger after resize");
        ScrollTrigger.refresh(true);
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Force a ScrollTrigger refresh after initial render
    setTimeout(() => {
      ScrollTrigger.refresh(true);
      console.log("Initial ScrollTrigger refresh");
    }, 1000);
    
    return () => {
      window.removeEventListener('modal-state-change', handleModalState);
      window.removeEventListener('resize', checkTouchDevice);
      window.removeEventListener('resize', handleResize);
      
      // Kill all ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Cleanup effects if initialized
      if (cleanupMagnetic) cleanupMagnetic();
      if (cleanupTrail) cleanupTrail();
      
      if (window.scrollTriggerResizeTimer) {
        clearTimeout(window.scrollTriggerResizeTimer);
      }
    };
  }, [isTouchDevice, isLoading]);

  // Effect to refresh ScrollTrigger after loading completes
  useEffect(() => {
    if (!isLoading) {
      // After loading is complete, refresh ScrollTrigger
      setTimeout(() => {
        ScrollTrigger.refresh(true);
        console.log("ScrollTrigger refreshed after loading complete");
      }, 500);
    }
  }, [isLoading]);

  return (
    <Router>
      {/* Loader - Show first */}
      <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
      
      {/* Only render the rest of the app once loading is complete */}
      {!isLoading && (
        <div className="flex flex-col min-h-screen">
          {/* Custom cursor - only show on non-touch devices */}
          {!isTouchDevice && <Cursor />}
          
          {/* Navbar (fixed) */}
          <div className='fixed top-8 left-8 right-8 text-[1.55vh] z-[2]' style={{
            backgroundColor: "var(--bg-color)",
          }}>
            <Navbar />    
          </div>
          
          {/* Main content - needs to be a flex-grow container */}
          <div className={`flex-grow font-[Standerd] font-(family-name:--Standerd) font-medium relative transition-opacity duration-500 ${isModalOpen ? 'modal-parent-open' : ''}`}
            style={{ 
              opacity: 1,
              transition: "opacity 0.6s ease-in-out",
              paddingTop: "4rem" // Add padding to account for fixed navbar
            }}
          >
            <div className='p-8 relative modal-content-parent'>
              <AnimatedRoutes />
            </div>
          </div>
        </div>
      )}
    </Router>
  )
}

export default App