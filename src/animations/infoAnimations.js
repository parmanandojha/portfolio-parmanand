import { gsap } from "gsap";
import { setInitialState } from './utils';

// Initialize animations for the Info page
export const initInfoAnimations = (refs) => {
  // Main timeline for animation sequence
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
      duration: 1
    }
  });
  
  // Extract all the refs
  const { 
    nameRef, 
    yearRef, 
    titleRef1, 
    titleRef2, 
    titleRef3, 
    contactRef, 
    taglineRef 
  } = refs;
  
  // Setup initial states
  setInitialState(
    [nameRef.current, yearRef.current, titleRef1.current, titleRef2.current],
    { y: 100, opacity: 0 }
  );
  
  setInitialState(
    [contactRef.current, taglineRef.current, titleRef3.current],
    { y: 30, opacity: 0 }
  );
  
  // Animation sequence
  tl.to(nameRef.current, { y: 0, opacity: 1 })
    .to([yearRef.current, contactRef.current], { y: 0, opacity: 1, stagger: 0.1 }, "-=0.7")
    .to(titleRef1.current, { y: 0, opacity: 1 }, "-=0.5")
    .to(titleRef2.current, { y: 0, opacity: 1 }, "-=0.7")
    .to(taglineRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
    .to(titleRef3.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.1");
  
  return tl;
};