import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import MagicalThemeToggle from "./MagicalThemeToggle";
import { initNavbarAnimations, setupNavLinkHoverEffects, cleanupAnimation } from "../animations/index";

function Navbar() {
    const [time, setTime] = useState("");
    const navRef = useRef(null);
    const itemsRef = useRef([]);
    const location = useLocation();
    
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
            // Initialize animations from our animation module
            initNavbarAnimations(itemsRef);
            
            // Set up hover effects for links
            setupNavLinkHoverEffects(itemsRef);
        }, navRef);
        
        return () => cleanupAnimation(ctx);
    }, []);
    
    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };
    
    return (
        <div 
            ref={navRef} 
            className="grid grid-cols-4 py-4 backdrop-blur-sm transition-all duration-300"
            style={{
                backgroundColor: "var(--bg-color)",
                opacity: 0.85
            }}
        >
            <div>
                <Link to="/info" className="no-underline">
                    <span 
                        ref={addToRefs} 
                        className={`cursor-pointer relative inline-block ${location.pathname === '/info' ? 'font-bold' : ''}`}
                    >
                        Info
                        <span className={`link-underline absolute left-0 bottom-0 h-[1px] ${location.pathname === '/info' ? 'w-full' : 'w-0'} bg-current`}></span>
                    </span>
                </Link>
            </div>
            <div className="col-span-1">
                <Link to="/work" className="no-underline">
                    <span 
                        ref={addToRefs} 
                        className={`cursor-pointer relative inline-block ${location.pathname === '/work' ? 'font-bold' : ''}`}
                    >
                        Work
                        <span className={`link-underline absolute left-0 bottom-0 h-[1px] ${location.pathname === '/work' ? 'w-full' : 'w-0'} bg-current`}></span>
                    </span>
                </Link>
            </div>
            <div className="col-span-2 flex flex-row justify-between items-center w-[100%]">
                <div ref={addToRefs} className="hidden md:block">
                    <span>{time || "00:00:00"} IST</span>
                </div>
                <div ref={addToRefs} className="right">
                    {/* Replace the switch with magical theme toggle */}
                    <MagicalThemeToggle />
                </div>
            </div>
        </div>
    );
}

export default Navbar;