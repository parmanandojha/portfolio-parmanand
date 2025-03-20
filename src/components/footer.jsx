import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function Footer() {
    const footerRef = useRef(null);
    const itemsRef = useRef([]);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    
    // Check for theme changes
    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains('dark-theme');
            setIsDarkTheme(isDark);
        };
        
        // Check initially
        checkTheme();
        
        // Set up mutation observer to detect theme class changes on html element
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        return () => observer.disconnect();
    }, []);
    
    useEffect(() => {
        if (!footerRef.current) return;
        
        const ctx = gsap.context(() => {
            // Initial state
            gsap.set(itemsRef.current, { 
                y: 15, 
                opacity: 0 
            });
            
            // Staggered reveal animation
            gsap.to(itemsRef.current, {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.7,
                ease: "power2.out",
                delay: 0.6
            });
            
            // Set up hover underline animations
            itemsRef.current.forEach(item => {
                if (item) {
                    const underline = item.querySelector('.link-underline');
                    if (underline) {
                        item.addEventListener("mouseenter", () => {
                            gsap.to(underline, {
                                width: "100%",
                                duration: 0.3,
                                ease: "power1.out"
                            });
                        });
                        
                        item.addEventListener("mouseleave", () => {
                            gsap.to(underline, {
                                width: "0%",
                                duration: 0.3,
                                ease: "power1.in"
                            });
                        });
                    }
                }
            });
        }, footerRef);
        
        return () => ctx.revert();
    }, []);
    
    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };
    
    return (
        <div 
            ref={footerRef} 
            className="grid grid-cols-3 md:grid-cols-4 pt-4 pb-4 backdrop-blur-sm transition-all duration-300"
            style={{
                backgroundColor: isDarkTheme 
                    ? 'rgba(20, 20, 20, 0.85)' 
                    : 'rgba(255, 255, 255, 0.85)'
            }}
        >
            <div>
                <a href="https://www.behance.net/ojhap" target="_blank" rel="noopener noreferrer" className="no-underline text-black">
                    <span ref={addToRefs} className="cursor-pointer relative inline-block">
                        Behance
                        <span className="link-underline absolute left-0 bottom-0 h-[1px] w-0 bg-black"></span>
                    </span>
                </a>
            </div>
            <div>
                <a href="https://www.linkedin.com/in/parmanand-ojha-81900a167/" target="_blank" rel="noopener noreferrer" className="no-underline text-black">
                    <span ref={addToRefs} className="cursor-pointer relative inline-block">
                        LinkedIn
                        <span className="link-underline absolute left-0 bottom-0 h-[1px] w-0 bg-black"></span>
                    </span>
                </a>
            </div>
            <div ref={addToRefs} className="hidden md:block">Design & Developed by - Parmanand</div>
            <div>
                <a href="project images/Parmanand ojha resume.pdf" target="_blank" rel="noopener noreferrer" className="no-underline text-black">
                    <span ref={addToRefs} className="cursor-pointer relative inline-block">
                        Resume
                        <span className="link-underline absolute left-0 bottom-0 h-[1px] w-0 bg-black"></span>
                    </span>
                </a>
            </div>
        </div>
    );
}

export default Footer;