/**
 * Main JavaScript file for the Samaj Website
 * Contains all interactive functionality and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load header component
    loadHeader();
    
    // Load footer component
    loadFooter();
    
    // Slideshow functionality
    initSlideshow();
    
    // Mobile navigation is now handled in the header
    // initMobileNav();
    
    // Scroll animations
    initScrollAnimations();
    
    // Timeline animations
    initTimelineAnimations();
    
    // Scroll to top button
    initScrollToTop();
    
    // Event filters
    initEventFilters();
});

/**
 * Load header component
 */
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('../components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                console.log('Header loaded successfully');
                
                // Extract and execute scripts
                const scriptContent = data.match(/<script>([\s\S]*?)<\/script>/);
                if (scriptContent && scriptContent[1]) {
                    try {
                        // Create a new script element
                        const script = document.createElement('script');
                        script.textContent = scriptContent[1];
                        document.body.appendChild(script);
                        console.log('Header scripts executed');
                    } catch (error) {
                        console.error('Error executing header scripts:', error);
                    }
                }
                
                // Initialize header animations after the header is loaded
                if (typeof initHeaderScrollAnimations === 'function') {
                    initHeaderScrollAnimations();
                    console.log('Header animations initialized');
                } else {
                    console.warn('Header animation function not found');
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = '<div class="p-4 text-center bg-red-100 text-red-700">Error loading header</div>';
            });
    }
}

/**
 * Load footer component
 */
function loadFooter() {
    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('../components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                console.log('Footer loaded successfully');
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                footerPlaceholder.innerHTML = 'Error loading footer';
            });
    }
}

/**
 * Initialize slideshow functionality
 */
function initSlideshow() {
    const slideshow = document.querySelector('.slideshow-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slideshow && slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        function showSlide(n) {
            // Reset all slides and dots
            slides.forEach(slide => slide.style.display = 'none');
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show current slide and activate dot
            slides[n].style.display = 'block';
            dots[n].classList.add('active');
            currentSlide = n;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // Initialize slideshow
        function initSlides() {
            // Set initial display for slides
            slides.forEach((slide, index) => {
                slide.style.display = index === 0 ? 'block' : 'none';
            });
            
            // Start automatic slideshow
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        slideshow.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        slideshow.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            if (touchStartX - touchEndX > 50) {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, 5000);
            }
            if (touchEndX - touchStartX > 50) {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, 5000);
            }
        }

        // Initialize the slideshow
        initSlides();
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const elements = document.querySelectorAll('.journey-card, .committee-card, .timeline-item, .event-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * Initialize timeline animations
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineYears = document.querySelectorAll('.timeline-year');
    
    if (timelineItems.length > 0 || timelineYears.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
        
        timelineYears.forEach(year => {
            observer.observe(year);
        });
    }
}

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    
    if (scrollUpBtn) {
        // Initially hide the button
        scrollUpBtn.style.display = 'none';
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollUpBtn.style.display = 'flex';
            } else {
                scrollUpBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        scrollUpBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize event filters
 */
function initEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (filterButtons.length > 0 && eventCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                
                eventCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
} 