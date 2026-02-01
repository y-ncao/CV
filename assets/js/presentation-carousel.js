/**
 * Presentation Carousel
 * Auto-advances and supports manual navigation
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    // Lightbox functionality - defined first so it's available to all carousels
    function openLightbox(slidesArray, startIndex) {
      var currentLightboxIndex = startIndex;

      // Create overlay
      var overlay = document.createElement('div');
      overlay.className = 'c-lightbox-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;';

      // Create image container to prevent clicks on image from closing
      var imgContainer = document.createElement('div');
      imgContainer.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;max-width:90%;max-height:90%;';

      // Create image
      var img = document.createElement('img');
      img.src = slidesArray[currentLightboxIndex].src;
      img.style.cssText = 'max-width:100%;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.5);';

      // Create close button
      var closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = 'position:absolute;top:20px;right:30px;font-size:40px;color:#fff;background:none;border:none;cursor:pointer;opacity:0.8;z-index:10001;';
      closeBtn.addEventListener('mouseenter', function () { closeBtn.style.opacity = '1'; });
      closeBtn.addEventListener('mouseleave', function () { closeBtn.style.opacity = '0.8'; });

      // Navigation button styles
      var navBtnStyle = 'position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;width:48px;height:48px;border-radius:50%;cursor:pointer;font-size:24px;color:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;z-index:10001;';

      // Create prev button
      var prevBtn = document.createElement('button');
      prevBtn.innerHTML = '&#8249;';
      prevBtn.style.cssText = navBtnStyle + 'left:30px;';
      prevBtn.addEventListener('mouseenter', function () {
        prevBtn.style.background = 'rgba(255,255,255,0.3)';
        prevBtn.style.color = '#fff';
      });
      prevBtn.addEventListener('mouseleave', function () {
        prevBtn.style.background = 'rgba(255,255,255,0.15)';
        prevBtn.style.color = 'rgba(255,255,255,0.7)';
      });

      // Create next button
      var nextBtn = document.createElement('button');
      nextBtn.innerHTML = '&#8250;';
      nextBtn.style.cssText = navBtnStyle + 'right:30px;';
      nextBtn.addEventListener('mouseenter', function () {
        nextBtn.style.background = 'rgba(255,255,255,0.3)';
        nextBtn.style.color = '#fff';
      });
      nextBtn.addEventListener('mouseleave', function () {
        nextBtn.style.background = 'rgba(255,255,255,0.15)';
        nextBtn.style.color = 'rgba(255,255,255,0.7)';
      });

      // Create image counter
      var counter = document.createElement('div');
      counter.style.cssText = 'position:absolute;bottom:30px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.7);font-size:14px;font-family:Inter,sans-serif;';
      function updateCounter() {
        counter.textContent = (currentLightboxIndex + 1) + ' / ' + slidesArray.length;
      }
      updateCounter();

      // Hide nav buttons if only one image
      if (slidesArray.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        counter.style.display = 'none';
      }

      // Navigation functions
      function showSlide(index) {
        currentLightboxIndex = index;
        if (currentLightboxIndex >= slidesArray.length) currentLightboxIndex = 0;
        if (currentLightboxIndex < 0) currentLightboxIndex = slidesArray.length - 1;
        img.src = slidesArray[currentLightboxIndex].src;
        updateCounter();
      }

      function nextSlide(e) {
        e.stopPropagation();
        showSlide(currentLightboxIndex + 1);
      }

      function prevSlide(e) {
        e.stopPropagation();
        showSlide(currentLightboxIndex - 1);
      }

      prevBtn.addEventListener('click', prevSlide);
      nextBtn.addEventListener('click', nextSlide);

      // Prevent image click from closing
      imgContainer.addEventListener('click', function (e) {
        e.stopPropagation();
      });

      imgContainer.appendChild(img);
      overlay.appendChild(imgContainer);
      overlay.appendChild(closeBtn);
      overlay.appendChild(prevBtn);
      overlay.appendChild(nextBtn);
      overlay.appendChild(counter);
      document.body.appendChild(overlay);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Close on click (overlay background only)
      function closeLightbox() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyboard);
      }

      overlay.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });

      // Keyboard navigation
      function handleKeyboard(e) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight' || e.key === 'Right') {
          showSlide(currentLightboxIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
          showSlide(currentLightboxIndex - 1);
        }
      }
      document.addEventListener('keydown', handleKeyboard);
    }

    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(function (carousel) {
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
        slides.forEach(function (slide, index) {
          slide.style.cursor = 'pointer';
          slide.addEventListener('click', function (e) {
            e.preventDefault();
            openLightbox(Array.from(slides), index);
          });
        });
        return;
      }

      let currentIndex = 0;
      let autoPlayInterval;

      // Create dots
      if (dotsContainer) {
        slides.forEach(function (_, index) {
          const dot = document.createElement('button');
          dot.className = 'c-presentation-carousel__dot' + (index === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
          dot.addEventListener('click', function () {
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
        prevBtn.addEventListener('click', function () {
          prevSlide();
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          nextSlide();
          resetAutoPlay();
        });
      }

      // Pause on hover
      carousel.addEventListener('mouseenter', function () {
        clearInterval(autoPlayInterval);
      });

      carousel.addEventListener('mouseleave', function () {
        startAutoPlay();
      });

      // Click to view full image
      slides.forEach(function (slide, index) {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', function (e) {
          e.preventDefault();
          openLightbox(Array.from(slides), index);
        });
      });

      // Start auto-play
      startAutoPlay();
    });
  });
})();
