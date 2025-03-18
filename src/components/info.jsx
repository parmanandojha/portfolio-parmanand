import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

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
    
    useEffect(() => {
        // Create context for automatic cleanup
        const ctx = gsap.context(() => {
            // Main timeline for animation sequence
            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                    duration: 1
                }
            });
            
            // Setup initial states
            gsap.set([nameRef.current, yearRef.current, titleRef1.current, titleRef2.current, titleRef3.current], { 
                y: 100, 
                opacity: 0
            });
            gsap.set([contactRef.current, taglineRef.current], { 
                opacity: 0 
            });
            
            // Animation sequence
            tl.to(nameRef.current, { y: 0, opacity: 1 })
              .to([yearRef.current, contactRef.current], { y: 0, opacity: 1, stagger: 0.1 }, "-=0.7")
              .to(titleRef1.current, { y: 0, opacity: 1 }, "-=0.5")
              .to(titleRef2.current, { y: 0, opacity: 1 }, "-=0.7")
              .to(titleRef3.current, { y: 0, opacity: 1 }, "-=0.9")
              .to(taglineRef.current, { opacity: 1, duration: 0.8 }, "-=0.3");
              
        }, containerRef); // Scope to container
        
        // Cleanup
        return () => ctx.revert();
    }, []);

    return (
        <>
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 h-full content-center pt-54 md:pt-32 ">
            <div className="hidden md:block"></div>
            <div className="col-span-1 md:col-span-2">
                <div className="flex flex-col leading-none">
                    <div><span ref={nameRef} className="text-[4vh] md:text-[10vh] font-semibold uppercase inline-block">Parmanand Ojha</span></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div><span ref={yearRef} className="text-[4vh] md:text-[10vh] font-semibold uppercase inline-block py-2 md:py-0">C. 2025</span></div>
                        <div ref={contactRef} className="flex flex-col text-[1.55vh] py-2 md:py-0">
                            <div><span>For Enquiry</span></div>
                            <div><a href="mailto:ojha96p@gmail.com" className="hover:underline"><span>ojha96p@gmail.com</span></a></div>
                        </div>
                    </div>
                    <div><span ref={titleRef1} className="text-[4vh] md:text-[10vh] font-semibold uppercase inline-block py-2 md:py-0">Multidisciplinary</span></div>
                    <div><span ref={titleRef2} className="text-[4vh] md:text-[10vh] font-semibold uppercase inline-block py-2 md:py-0">Designer</span></div>
                    <div ref={taglineRef} className="my-2 mx-0 md:mx-1 text-[1.55vh]"><span>Crafting Narrative<br></br>Through Design.</span></div>
                </div>
               
            </div>
        </div>
        </>
    )
}

export default Info;