import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initInfoAnimations, cleanupAnimation } from "../animations/index";
import Footer from './Footer.jsx'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Info() {
    // Create refs for animation targets
    const containerRef = useRef(null);
    const nameRef = useRef(null);
    const yearRef = useRef(null);
    const titleRef1 = useRef(null);
    const titleRef2 = useRef(null);
    const titleRef3 = useRef(null);
    const contactRef = useRef(null);
    const taglineRef = useRef(null);
    const footerContainerRef = useRef(null);
    
    useEffect(() => {
        // Create context for automatic cleanup
        const ctx = gsap.context(() => {
            // Initialize info animations using our animation module
            initInfoAnimations({
                nameRef,
                yearRef,
                titleRef1,
                titleRef2,
                titleRef3,
                contactRef,
                taglineRef
            });
            
            // Force ScrollTrigger to recalculate heights and positions
            // This is important because the footer might be outside the viewport initially
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        }, containerRef); // Scope to container
        
        // Cleanup
        return () => cleanupAnimation(ctx);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <div ref={containerRef} className="flex-grow grid grid-cols-1 md:grid-cols-4 h-full content-center pt-32 md:pt-32">
                <div className="hidden md:block"></div>
                <div className="col-span-1 md:col-span-2">
                    <div className="flex flex-col leading-none">
                        <div><span ref={nameRef} className="text-[6vh] md:text-[10vh] font-semibold uppercase inline-block">Parmanand Ojha</span></div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div><span ref={yearRef} className="text-[6vh] md:text-[10vh] font-semibold uppercase inline-block py-1 md:py-0">C. 2025</span></div>
                            <div ref={contactRef} className="flex flex-col text-[1.55vh] py-2 md:py-0">
                                <div><span>For Enquiry</span></div>
                                <div><a href="mailto:ojha96p@gmail.com" className="hover:underline"><span>ojha96p@gmail.com</span></a></div>
                            </div>
                        </div>
                        <div><span ref={titleRef1} className="text-[6vh] md:text-[10vh] font-semibold uppercase inline-block py-1 md:py-0">Graphics & UI/UX</span></div>
                        <div><span ref={titleRef2} className="text-[6vh] md:text-[10vh] font-semibold uppercase inline-block py-1 md:py-0">Designer</span></div>
                        <div ref={taglineRef} className="my-2 mx-0 md:mx-1 text-[1.55vh]"><span>Crafting Narrative<br></br>Through Design.</span></div>
                        <div ref={titleRef3} className="my-2 mx-0 md:mx-1 text-[1.8vh] md:text-[2vh] leading-relaxed">
                            <p className="mb-4">
                                I'm a creative chameleon who escaped the engineering realm to embrace the enchanting world of design. With nearly four years of experience in the ever-evolving Art & Design Industry, I've collaborated with diverse design agencies, companies, and individuals spanning finance, jewelry, global health, sports, education, and startups.
                            </p>
                            <p className="mb-4">
                                My passion? Infusing digital interactions with a touch of humanity. Let's make tech more relatable and captivating!
                            </p>
                            <p className="mb-4">
                                Currently, I'm proudly serving as a Design Specialist at Plethora IT, focusing on graphics and UI/UX. I'm eager to expand my skills and dive into exciting UI/UX projects.
                            </p>
                            <p className="mb-4">
                                I hold a B.Tech degree in computer science (Class of 2019) and have honed my craft with a stellar UI/UX course at Design Boat. I've also crafted some awe-inspiring projects along the way.
                            </p>
                            <p>
                                If you're ready to break the design mold and create something extraordinary, let's connect and make magic happen!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer - at the bottom of the flex container */}
            <footer ref={footerContainerRef} className='w-full pt-24 mt-auto opacity-100'>
                <Footer />
            </footer>
        </div>
    )
}

export default Info;