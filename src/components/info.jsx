import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewFooter from "./newFooter";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Info() {
    // Create refs for elements we want to animate
    const topGridRef = useRef(null);
    const nameBlurredTextRef = useRef(null);
    const nameMainTextRef = useRef(null);
    const backgroundTextRef = useRef(null);
    const topRightTextRef = useRef(null);
    const centerTextRef = useRef(null);
    const footerRef = useRef(null);

    // Set up animations when component mounts
    useEffect(() => {
        // Create animation context
        const ctx = gsap.context(() => {
            // Initial states - set opacity to 0 for elements we'll animate in
            gsap.set([topGridRef.current.children], { 
                opacity: 0, 
                y: 20 
            });
            
            gsap.set(nameBlurredTextRef.current, { 
                opacity: 0,
                scale: 0.9
            });
            
            gsap.set(nameMainTextRef.current, { 
                opacity: 0,
                scale: 0.95,
                y: 30
            });
            
            gsap.set(backgroundTextRef.current, { 
                opacity: 0,
                blur: "0px"
            });
            
            gsap.set(topRightTextRef.current, { 
                opacity: 0,
                x: 20
            });
            
            gsap.set(centerTextRef.current, { 
                opacity: 0,
                scale: 0.9
            });

            // Entry animations - sequence them for a nice flow
            const tl = gsap.timeline({
                defaults: {
                    duration: 0.8,
                    ease: "power3.out"
                }
            });

            // Top grid animation
            tl.to(topGridRef.current.children, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                delay: 0.3
            })
            
            // Name section animation
            .to(nameBlurredTextRef.current, {
                opacity: 0.7,
                scale: 1,
                duration: 1
            }, "-=0.4")
            
            .to(nameMainTextRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.2
            }, "-=0.8")
            
            // Background text animation
            .to(backgroundTextRef.current, {
                opacity: 0.7,
                blur: "8px",
                duration: 1
            }, "-=0.6")
            
            // Top right text animation
            .to(topRightTextRef.current, {
                opacity: 1,
                x: 0,
                duration: 0.7
            }, "-=0.8")
            
            // Center text animation
            .to(centerTextRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.9
            }, "-=0.6");

            // Create scroll-triggered animations
            
            // Parallax effect for the blurred text
            ScrollTrigger.create({
                trigger: nameBlurredTextRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                onUpdate: (self) => {
                    gsap.to(nameBlurredTextRef.current, {
                        y: self.progress * -50,
                        duration: 0.1
                    });
                }
            });
            
            // Parallax for main name
            ScrollTrigger.create({
                trigger: nameMainTextRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.3,
                onUpdate: (self) => {
                    gsap.to(nameMainTextRef.current, {
                        y: self.progress * 30,
                        duration: 0.1
                    });
                }
            });
            
            // Parallax for background text
            ScrollTrigger.create({
                trigger: backgroundTextRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
                onUpdate: (self) => {
                    gsap.to(backgroundTextRef.current, {
                        y: self.progress * -60,
                        duration: 0.1
                    });
                }
            });
        });

        // Cleanup animations when component unmounts
        return () => {
            ctx.revert(); // Clean up all animations
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="pt-24 md:pt-32 overflow-hidden">
            {/* Top grid section */}
            <div ref={topGridRef} className="grid grid-cols-1 md:grid-cols-4 mb-16 relative">
                <div className="col-span-1 hidden sm:block"></div>
                <div className="col-span-1 text-xs sm:text-sm md:text-base font-semibold mb-4 leading-[0.8]">
                    <span>scroll</span>
                </div>
                <div className="col-span-1 text-xs sm:text-sm md:text-base font-semibold mb-4 leading-[1]">
                    <span>Crafting Narrative <br></br>Through Design.</span>
                </div>
                <div className="col-span-1 hidden sm:block"></div>
            </div>

            {/* Name section with blurred text */}
            <div className="relative my-12 sm:my-16 md:my-24">
                <div 
                    ref={nameBlurredTextRef}
                    className="relative flex flex-col text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold uppercase mb-4 leading-[1] blur-[2px] sm:blur-sm px-2 sm:px-4 opacity-32 sm:opacity-64"
                >
                    <div>Graphics &</div>
                    <div>UI/UX Designer,</div>
                    <div className="flex flex-row justify-between"><div>Based in</div><div>India</div></div>
                    <div>C2025</div>
                </div>    
                <div 
                    ref={nameMainTextRef}
                    className="absolute top-1/4 w-full text-center text-[18vw] sm:text-[20vw] md:text-[19vw] lg:text-[20vw] font-semibold mb-4 leading-[0.8]"
                >
                    <span>parmanand</span>
                </div>
            </div>

            {/* Main content section with multiple text elements */}
            <div className="relative my-32 sm:my-24">
                {/* Blurred background text */}
                <div 
                    ref={backgroundTextRef}
                    className="relative flex flex-col text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold mb-4 leading-[1] blur-[2px] sm:blur-sm px-2 sm:px-4 uppercase opacity-32 sm:opacity-64"
                >
                    <div>A lot of amazing </div>
                    <div>products are being</div>
                    <div>created in the world, but </div>
                    <div>often the way they are</div>
                    <div>presented in the digital </div>
                    <div>world spoils the overall</div>
                    <div>impression</div>
                </div> 

                {/* Top right text */}
                <div 
                    ref={topRightTextRef}
                    className="absolute top-0 right-0 text-[3vh] sm:text-[4vh]  flex flex-col font-semibold mb-4 leading-[1] px-4"
                >
                    <div>i'm just doing</div>
                    <div>design as other</div>
                    <div>nothing too</div>
                    <div>fancy</div>
                </div>

                {/* Center text */}
                <div 
                    ref={centerTextRef}
                    className="absolute top-1/2 inset-0 text-center text-[3vh] sm:text-[4vh] flex flex-col justify-self-center font-semibold mb-4 gap-2 sm:gap-3 md:gap-5 leading-[1] w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto px-4"
                >
                    <div>just turning ideas into 
                            functional designs, 
                            overthinking every detail, 
                            diving into frustration, 
                            obsessing over perfection, 
                            rethinking it all and...</div>
                    <div>finally — delivering.</div>
                </div>
            </div>

            {/* Footer */}
            <div ref={footerRef}>
                <NewFooter />
            </div>
        </div>
    );
}

export default Info;