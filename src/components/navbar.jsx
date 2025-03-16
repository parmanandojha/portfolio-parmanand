import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import MagicalThemeToggle from "./MagicalThemeToggle";

function Navbar() {
    const [time, setTime] = useState("");
    const navRef = useRef(null);
    const itemsRef = useRef([]);
    
    // Update Delhi time every second
    useEffect(() => {
        const updateTime = () => {
            const options = { 
                timeZone: 'Asia/Kolkata',
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const delhiTime = new Date().toLocaleTimeString('en-US', options);
            setTime(delhiTime);
        };
        
        // Update immediately
        updateTime();
        
        // Then update every second
        const intervalId = setInterval(updateTime, 1000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
        if (!navRef.current) return;
        
        const ctx = gsap.context(() => {
            // Set initial state
            gsap.set(itemsRef.current, { 
                y: -20, 
                opacity: 0 
            });
            
            // Create animation
            gsap.to(itemsRef.current, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.2
            });
            
            // Set up hover underline animations
            itemsRef.current.forEach(item => {
                if (item && item.textContent) {
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
        }, navRef);
        
        return () => ctx.revert();
    }, []);
    
    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };
    
    return (
        <div 
            ref={navRef} 
            className="grid grid-cols-4 p-4 rounded-md backdrop-blur-sm transition-all duration-300"
            style={{
                backgroundColor: "var(--bg-color)",
                opacity: 0.85
            }}
        >
            <div>
                <Link to="/" className="no-underline">
                    <span ref={addToRefs} className="cursor-pointer relative inline-block">
                        Index
                        <span className="link-underline absolute left-0 bottom-0 h-[1px] w-0 bg-current"></span>
                    </span>
                </Link>
            </div>
            <div className="col-span-2">
                <Link to="/info" className="no-underline">
                    <span ref={addToRefs} className="cursor-pointer relative inline-block">
                        Info
                        <span className="link-underline absolute left-0 bottom-0 h-[1px] w-0 bg-current"></span>
                    </span>
                </Link>
            </div>
            <div className="flex flex-row justify-between items-center">
                <div ref={addToRefs}>
                    {/* Replace the switch with magical theme toggle */}
                    <MagicalThemeToggle />
                </div>
                <div ref={addToRefs} className="hidden md:block">
                    <span>{time || "00:00:00"} IST</span>
                </div>
            </div>
        </div>
    );
}

export default Navbar;