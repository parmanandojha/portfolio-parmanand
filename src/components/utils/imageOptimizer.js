// utils/imageOptimizer.js
export const optimizeImagesForMobile = () => {
    // Check if it's a mobile device or connection
    const isMobile = window.innerWidth < 768 || 
                    (navigator.connection && 
                     (navigator.connection.saveData || 
                      navigator.connection.effectiveType.includes('2g') ||
                      navigator.connection.effectiveType.includes('3g')));
    
    // Mobile-specific image quality parameters
    const mobileParams = isMobile ? {
      quality: 'medium',
      width: '600',
      format: 'webp'
    } : {
      quality: 'high',
      width: '1200',
      format: 'original'
    };
    
    // Function to get optimized image URL
    const getOptimizedImageUrl = (originalUrl) => {
      if (!originalUrl) return '';
      
      if (isMobile) {
        // For images that support URL parameters
        if (originalUrl.includes('w=')) {
          return originalUrl
            .replace(/w=\d+/, `w=${mobileParams.width}`);
        }
        // For image paths that don't have parameters
        return originalUrl;
      }
      return originalUrl;
    };
    
    // Implement progressive loading with low-quality placeholders
    const setupProgressiveImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // First load low-quality placeholder
            if (!img.src || img.src === '') {
              img.src = img.dataset.placeholder || getOptimizedImageUrl(img.dataset.src);
              img.classList.add('loading');
            }
            
            // Then load high-quality image
            const highQualityImage = new Image();
            highQualityImage.src = getOptimizedImageUrl(img.dataset.src);
            
            highQualityImage.onload = () => {
              img.src = highQualityImage.src;
              img.classList.remove('loading');
              img.classList.add('loaded');
            };
            
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' }); // Start loading when within 200px of viewport
      
      images.forEach(img => observer.observe(img));
      
      return () => observer.disconnect();
    };
    
    return {
      getOptimizedImageUrl,
      setupProgressiveImages
    };
  };