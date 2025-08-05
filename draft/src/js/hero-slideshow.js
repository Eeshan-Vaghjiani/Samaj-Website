// Vanilla JS Slideshow for index.html hero
// Uses images from src/assets/images/index/

(function() {
  const imagePaths = [
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.38 AM.jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.39 AM.jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.39 AM (1).jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.40 AM.jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.40 AM (1).jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.41 AM.jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.41 AM (1).jpeg',
    '../assets/images/index/WhatsApp Image 2025-06-15 at 10.48.42 AM.jpeg'
  ];

  class Slideshow {
    constructor(options = {}) {
this.$el = document.querySelector('.slideshow-hero-section');
      this.showPagination = options.showPagination !== false;
      this.duration = options.duration || 10000;
      this.autoplay = options.autoplay !== false;
      this.currentSlide = 0;
      this.maxSlide = imagePaths.length;
      this.interval = null;
      this.isAnimating = false;
      this.animationDuration = 1200;
      this.init();
    }

    init() {
      // Create slideshow container for desktop layout
const slideshowContainer = document.createElement('div');
      slideshowContainer.className = 'slideshow-hero-container';
      
      // Create slides inside the container
      imagePaths.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'slideshow-hero-slide';
        slide.dataset.slide = i + 1;
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Slide ${i+1}`;
        slide.appendChild(img);
        slideshowContainer.appendChild(slide);
      });
      
      // Insert slideshow container before hero text content
      this.$el.insertBefore(slideshowContainer, this.$el.querySelector('.slideshow-hero-text'));
      
      // Create navigation arrows
      this.createNavigationArrows();
      
      this.goToSlide(1);
      if (this.autoplay) this.startAutoplay();
      if (this.showPagination) this.createPagination();
      
      // Add keyboard navigation
      this.initKeyboardNavigation();
    }

    goToSlide(index) {
      this.currentSlide = parseInt(index);
      if (this.currentSlide > this.maxSlide) this.currentSlide = 1;
      if (this.currentSlide < 1) this.currentSlide = this.maxSlide;
      const slides = this.$el.querySelectorAll('.slideshow-hero-slide');
      slides.forEach((slide, i) => {
        slide.classList.remove('is-current');
        if (i === this.currentSlide - 1) slide.classList.add('is-current');
      });
      // Pagination
      const pagItems = this.$el.querySelectorAll('.slideshow-hero-pagination-item');
      pagItems.forEach((item, i) => {
        item.classList.toggle('is-current', i === this.currentSlide - 1);
      });
    }

    nextSlide() {
      this.goToSlide(this.currentSlide + 1);
    }
    prevSlide() {
      this.goToSlide(this.currentSlide - 1);
    }
    startAutoplay() {
      this.interval = setInterval(() => {
        this.nextSlide();
      }, this.duration);
    }
    createPagination() {
      const pagination = document.createElement('div');
      pagination.className = 'slideshow-hero-pagination';
      imagePaths.forEach((_, i) => {
        const item = document.createElement('span');
        item.className = 'slideshow-hero-pagination-item' + (i === 0 ? ' is-current' : '');
        item.dataset.slide = i + 1;
        item.addEventListener('click', () => {
          this.pauseAutoplay();
          this.goToSlide(i + 1);
          this.resumeAutoplay();
        });
        pagination.appendChild(item);
      });
      
      // Append pagination to slideshow container if it exists (desktop), otherwise to main element (mobile)
const slideshowContainer = this.$el.querySelector('.slideshow-hero-container');
      if (slideshowContainer) {
        slideshowContainer.appendChild(pagination);
      } else {
        this.$el.appendChild(pagination);
      }
    }
    
    createNavigationArrows() {
      // Create previous arrow
      const prevArrow = document.createElement('div');
      prevArrow.className = 'slideshow-hero-nav prev';
      prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevArrow.addEventListener('click', () => {
        this.pauseAutoplay();
        this.prevSlide();
        this.resumeAutoplay();
      });
      
      // Create next arrow
      const nextArrow = document.createElement('div');
      nextArrow.className = 'slideshow-hero-nav next';
      nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextArrow.addEventListener('click', () => {
        this.pauseAutoplay();
        this.nextSlide();
        this.resumeAutoplay();
      });
      
      // Append arrows to slideshow container or main element
      const slideshowContainer = this.$el.querySelector('.slideshow-hero-container');
      if (slideshowContainer) {
        slideshowContainer.appendChild(prevArrow);
        slideshowContainer.appendChild(nextArrow);
      } else {
        this.$el.appendChild(prevArrow);
        this.$el.appendChild(nextArrow);
      }
    }
    
    initKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.pauseAutoplay();
          this.prevSlide();
          this.resumeAutoplay();
        } else if (e.key === 'ArrowRight') {
          this.pauseAutoplay();
          this.nextSlide();
          this.resumeAutoplay();
        }
      });
    }
    
    pauseAutoplay() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
    
    resumeAutoplay() {
      if (this.autoplay && !this.interval) {
        setTimeout(() => {
          this.startAutoplay();
        }, 3000); // Resume after 3 seconds
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    new Slideshow({ showPagination: true, duration: 10000, autoplay: true });
  });
})();
