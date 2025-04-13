import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  initFooterAnimations, 
  setupFooterLinkHovers, 
  cleanupAnimation 
} from "../animations/index";

function Footer() {
  const footerRef = useRef(null);
  const contactRef = useRef(null);
  const emailRef = useRef(null);
  const linksRef = useRef(null);
  const creditRef = useRef(null);
  
  // GSAP animations
  useEffect(() => {
    if (!footerRef.current) return;
    
    // Set default visibility in case animations don't trigger
    gsap.set(footerRef.current, { opacity: 1 });
    if (contactRef.current) gsap.set(contactRef.current, { opacity: 1, y: 0 });
    if (emailRef.current) gsap.set(emailRef.current, { opacity: 1, y: 0 });
    if (linksRef.current) gsap.set(linksRef.current, { opacity: 1, y: 0 });
    if (creditRef.current) gsap.set(creditRef.current, { opacity: 1, y: 0 });
    
    const ctx = gsap.context(() => {
      // Initialize footer animations using our animation module
      initFooterAnimations({
        footerRef,
        contactRef,
        emailRef,
        linksRef,
        creditRef
      });
      
      // Set up hover animations for links
      setupFooterLinkHovers(linksRef, emailRef);
    }, footerRef);
    
    return () => {
      cleanupAnimation(ctx);
    };
  }, []);

  return (
    <div ref={footerRef} className="w-full opacity-100">
      {/* Check if the footer background image exists, add error handling */}
      <div>
        <img 
          src="project images/footer-bg.png" 
          alt="Footer background" 
          className="w-full" 
          onError={(e) => {
            console.log("Footer background image failed to load");
            e.target.style.display = "none"; // Hide the img element if it fails to load
          }}
        />
      </div>
      <div className="grid grid-cols-4 pt-32">
        <div ref={contactRef} className="col-span-2 opacity-100">
          <span className="text-[4vh] md:text-[10vh] font-semibold mb-4 leading-[0.8]">
            Lets work <br></br>together 
          </span>
        </div>
        <div ref={emailRef} className="col-span-2 opacity-100">
          <div className="text-[2vh] sm:text-[6vh] font-semibold mb-4 loader-text">
            <a href="mailto:ojha96p@gmail.com" className="hover:underline">
              ojha96p@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 pt-24 mb-8">
        <div ref={creditRef} className="col-span-2 opacity-100">
          <span className="text-[1.55vh] font-semibold mb-4 leading-[0.3]">
            Designed & Developed by - Parmanand Ojha
          </span>
        </div>
        <div ref={linksRef} className="col-span-2 opacity-100">
          <div className="text-[1.55vh] font-semibold mb-4 leading-[0.8]">
            <div className="flex flex-row justify-between">
              <span>
                <a 
                  href="https://www.behance.net/ojhap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Behance
                </a>
              </span>
              <span>
                <a 
                  href="https://www.linkedin.com/in/parmanand-ojha-81900a167/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </span>
              <span>
                <a 
                  href="https://drive.google.com/file/d/1q9GRAeRT0gYaj8BKIfoYqiDwqY3OEJDJ/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Resume
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;