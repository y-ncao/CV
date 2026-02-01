/**
 * Presentation Carousel
 * Auto-advances and supports manual navigation
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {

    // Lightbox functionality - defined first so it's available to all carousels
    function openLightbox(src) {
      // Create overlay
      var overlay = document.createElement('div');
      overlay.className = 'c-lightbox-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;';

      // Create image
      var img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.5);';

      // Create close button
      var closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = 'position:absolute;top:20px;right:30px;font-size:40px;color:#fff;background:none;border:none;cursor:pointer;opacity:0.8;';
      closeBtn.addEventListener('mouseenter', function() { closeBtn.style.opacity = '1'; });
      closeBtn.addEventListener('mouseleave', function() { closeBtn.style.opacity = '0.8'; });

      overlay.appendChild(img);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Close on click
      function closeLightbox() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }

      overlay.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', closeLightbox);

      // Close on escape key
      function handleEscape(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', handleEscape);
        }
      }
      document.addEventListener('keydown', handleEscape);
    }

    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(function(carousel) {
      const slides = carousel.querySelectorAll('.c-presentation-carousel__slide');
      const prevBtn = carousel.querySelector('.c-presentation-carousel__btn--prev');
      const nextBtn = carousel.querySelector('.c-presentation-carousel__btn--next');
      const dotsContainer = carousel.querySelector('.c-presentation-carousel__dots');

      // Hide nav controls if only one image, but still enable click-to-view
      if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';

        // Add click to view for single images
        slides.forEach(function(slide) {
          slide.style.cursor = 'pointer';
          slide.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(slide.src);
          });
        });
        return;
      }

      let currentIndex = 0;
      let autoPlayInterval;

      // Create dots
      if (dotsContainer) {
        slides.forEach(function(_, index) {
          const dot = document.createElement('button');
          dot.className = 'c-presentation-carousel__dot' + (index === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
          dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoPlay();
          });
          dotsContainer.appendChild(dot);
        });
      }

      const dots = dotsContainer ? dotsContainer.querySelectorAll('.c-presentation-carousel__dot') : [];

      function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        currentIndex = index;
        if (currentIndex >= slides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slides.length - 1;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 3000);
      }

      function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
      }

      // Event listeners
      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          prevSlide();
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          nextSlide();
          resetAutoPlay();
        });
      }

      // Pause on hover
      carousel.addEventListener('mouseenter', function() {
        clearInterval(autoPlayInterval);
      });

      carousel.addEventListener('mouseleave', function() {
        startAutoPlay();
      });

      // Click to view full image
      slides.forEach(function(slide) {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', function(e) {
          e.preventDefault();
          openLightbox(slide.src);
        });
      });

      // Start auto-play
      startAutoPlay();
    });
  });
})();
