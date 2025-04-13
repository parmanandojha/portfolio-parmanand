import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Create a reusable scroll triggered animation with reverse
export const createScrollAnimation = (element, fromProps, toProps, options = {}) => {
  if (!element) return null;
  
  // Default options
  const defaultOptions = {
    trigger: element,
    start: "top 80%",
    end: options.end || "top 20%",
    toggleActions: options.reverse ? "play reverse restart reverse" : "play none none none",
    scrub: options.reverse ? 0.3 : false,
    markers: false,
    once: !options.reverse // Only true when not using reverse
  };
  
  // Merge default options with provided options
  const scrollTriggerOptions = { ...defaultOptions, ...options };
  
  // Create and return the animation
  return gsap.fromTo(
    element,
    fromProps,
    {
      ...toProps,
      scrollTrigger: scrollTriggerOptions
    }
  );
};

// Create staggered animation with reverse capability
export const createStaggeredScrollAnimation = (elements, fromProps, toProps, options = {}) => {
  if (!elements || elements.length === 0) return null;
  
  // Default options
  const defaultOptions = {
    trigger: elements[0].parentElement || elements[0],
    start: "top 80%",
    end: options.end || "top 20%",
    toggleActions: options.reverse ? "play reverse restart reverse" : "play none none none",
    scrub: options.reverse ? 0.3 : false,
    markers: false,
    once: !options.reverse
  };
  
  // Default stagger options
  const defaultStaggerOptions = {
    amount: 0.3,
    from: "start",
    ease: "power2.out"
  };
  
  // Merge default options with provided options
  const scrollTriggerOptions = { ...defaultOptions, ...options };
  const staggerOptions = { ...defaultStaggerOptions, ...options.stagger };
  
  // Create and return the animation
  return gsap.fromTo(
    elements,
    fromProps,
    {
      ...toProps,
      stagger: staggerOptions,
      scrollTrigger: scrollTriggerOptions
    }
  );
};

// Create scroll-based parallax effect (always has scrub by design)
export const createParallaxEffect = (element, options = {}) => {
  if (!element) return null;
  
  // Default options
  const defaultOptions = {
    trigger: element.parentElement || element,
    start: "top bottom",
    end: "bottom top",
    scrub: options.scrub !== undefined ? options.scrub : 1, // Default scrub to true
    markers: false
  };
  
  // Default movement amount (how much the element moves relative to scroll)
  const movementY = options.movementY || 100; // pixels
  
  // Merge default options with provided options
  const scrollTriggerOptions = { ...defaultOptions, ...options };
  
  // Create and return the animation
  return gsap.fromTo(
    element,
    {
      y: -movementY / 2
    },
    {
      y: movementY / 2,
      ease: "none",
      scrollTrigger: scrollTriggerOptions
    }
  );
};

// Create a horizontal scroll animation with reverse
export const createHorizontalScrollAnimation = (element, options = {}) => {
  if (!element) return null;
  
  // Default options
  const defaultOptions = {
    trigger: element.parentElement || element,
    start: "top 80%",
    end: "top 20%", 
    scrub: options.scrub !== undefined ? options.scrub : 1,
    toggleActions: options.reverse ? "play reverse restart reverse" : "play none none none",
    markers: false
  };
  
  // Default movement amount
  const movementX = options.movementX || 100; // pixels
  
  // Merge default options with provided options
  const scrollTriggerOptions = { ...defaultOptions, ...options };
  
  // Create and return the animation
  return gsap.fromTo(
    element,
    {
      x: options.fromLeft ? -movementX : movementX
    },
    {
      x: 0,
      ease: options.ease || "power1.out",
      scrollTrigger: scrollTriggerOptions
    }
  );
};

// Create a reveal animation that uses a clip-path with reverse
export const createRevealAnimation = (element, options = {}) => {
  if (!element) return null;
  
  // Default options
  const defaultOptions = {
    trigger: element.parentElement || element,
    start: "top 75%",
    end: options.end || "top 25%",
    toggleActions: options.reverse ? "play reverse restart reverse" : "play none none none",
    scrub: options.reverse ? 0.3 : false,
    markers: false
  };
  
  // Direction of reveal
  const direction = options.direction || "left"; // left, right, top, bottom
  
  // Set initial and final clip paths based on direction
  let initialClip, finalClip;
  
  switch (direction) {
    case "left":
      initialClip = "inset(0 100% 0 0)";
      finalClip = "inset(0 0 0 0)";
      break;
    case "right":
      initialClip = "inset(0 0 0 100%)";
      finalClip = "inset(0 0 0 0)";
      break;
    case "top":
      initialClip = "inset(100% 0 0 0)";
      finalClip = "inset(0 0 0 0)";
      break;
    case "bottom":
      initialClip = "inset(0 0 100% 0)";
      finalClip = "inset(0 0 0 0)";
      break;
    default:
      initialClip = "inset(0 100% 0 0)";
      finalClip = "inset(0 0 0 0)";
  }
  
  // Merge default options with provided options
  const scrollTriggerOptions = { ...defaultOptions, ...options };
  
  // Create and return the animation
  return gsap.fromTo(
    element,
    {
      clipPath: initialClip,
      webkitClipPath: initialClip
    },
    {
      clipPath: finalClip,
      webkitClipPath: finalClip,
      duration: options.duration || 1,
      ease: options.ease || "power3.inOut",
      scrollTrigger: scrollTriggerOptions
    }
  );
};

// Helper function to create text reveal with characters or words
export const createTextRevealAnimation = (textElement, options = {}) => {
  if (!textElement) return null;
  
  // Default options
  const defaultOptions = {
    trigger: textElement.parentElement || textElement,
    start: "top 80%",
    end: "top 20%",
    toggleActions: options.reverse ? "play reverse restart reverse" : "play none none none",
    scrub: options.reverse ? 0.3 : false,
    markers: false,
    type: "chars", // 'chars', 'words', or 'lines'
    staggerAmount: 0.05,
    duration: 0.8
  };
  
  // Merge options
  const finalOptions = { ...defaultOptions, ...options };
  
  // Generate the text animation based on type
  let elements;
  const originalText = textElement.innerHTML;
  
  // Split into elements based on specified type
  if (finalOptions.type === "chars") {
    textElement.innerHTML = originalText.replace(/./g, "<span class='char'>$&</span>");
    elements = textElement.querySelectorAll('.char');
  } else if (finalOptions.type === "words") {
    textElement.innerHTML = originalText.replace(/\S+/g, "<span class='word'>$&</span>");
    elements = textElement.querySelectorAll('.word');
  } else if (finalOptions.type === "lines") {
    // Lines requires wrapping in a div and letting the browser handle line breaks
    textElement.innerHTML = `<span class="line">${originalText.replace(/\n/g, "</span><span class='line'>")}</span>`;
    elements = textElement.querySelectorAll('.line');
  }
  
  // Create the scroll trigger animation
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 20,
      rotateX: options.rotate ? 20 : 0
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: finalOptions.duration,
      stagger: finalOptions.staggerAmount,
      ease: finalOptions.ease || "power3.out",
      scrollTrigger: {
        trigger: finalOptions.trigger,
        start: finalOptions.start,
        end: finalOptions.end,
        toggleActions: finalOptions.toggleActions,
        scrub: finalOptions.scrub,
        markers: finalOptions.markers
      }
    }
  );
};