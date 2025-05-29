/**
 * Animations for Samaj Website
 * Handles animations triggered by scrolling and page load
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations when page loads
    initAnimations();
});

/**
 * Initialize all animations
 */
function initAnimations() {
    // First, immediately show elements that are already in viewport
    showInitiallyVisibleElements();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Start any manual animations (those not triggered by scroll)
    startManualAnimations();
    
    // Note: Header animations are now initialized after header is loaded in main.js
    // to solve the timing issue. We don't call it here anymore.
}

/**
 * Immediately show elements that are already visible in the viewport
 * This prevents the "blank HTML" issue for elements that are already in view on page load
 */
function showInitiallyVisibleElements() {
    // Target all animated elements that might be in the initial viewport
    const elements = document.querySelectorAll('.journey-card, .committee-card, .trust-content, .section-title, .section-subtitle, .trust-committee-cards .committee-card');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        // Consider an element visible if it's in the viewport or just below it
        const isVisible = (
            rect.top >= -200 && // Include elements slightly above viewport
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 200 // Include elements slightly below viewport
        );
        
        if (isVisible) {
            // Immediately add visible class without animation delay
            element.style.transitionDelay = '0ms';
            element.classList.add('visible');
            console.log('Initially visible element:', element);
        }
    });
}

/**
 * Initialize animations triggered by scrolling
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const elements = document.querySelectorAll('.journey-card, .committee-card, .trust-content, .section-title, .section-subtitle');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add 'visible' class when element enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optional: stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05, // Reduced from 0.1 - trigger when just 5% of the element is visible
        rootMargin: '0px 0px 100px 0px' // Changed from -50px to 100px to trigger earlier
    });
    
    // Observe all elements
    elements.forEach(element => {
        observer.observe(element);
    });
    
    // Add staggered animation delays to journey and committee cards - reduced delay
    document.querySelectorAll('.journey-card, .committee-card').forEach((card, index) => {
        // Reduced delay from 100ms to 50ms per card
        card.style.transitionDelay = `${index * 50}ms`;
    });
    
    // Pre-load cards that are already visible on page load
    setTimeout(() => {
        // Find all committee and trust cards initially in viewport
        document.querySelectorAll('.committee-card, .trust-committee-cards .committee-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
            
            if (isVisible) {
                card.classList.add('visible');
            }
        });
    }, 100); // Very short timeout to ensure DOM is ready
}

/**
 * Start animations that are not triggered by scrolling
 */
function startManualAnimations() {
    // Add shimmer effect to certain elements
    document.querySelectorAll('.journey-date').forEach(element => {
        element.classList.add('animate-shimmer');
    });
    
    // Add subtle pulse to call-to-action buttons
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('animate-pulse');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('animate-pulse');
        });
    });
    
    // Add hover effects to committee cards
    document.querySelectorAll('.committee-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Find the heading and add a wave animation
            const heading = card.querySelector('h3');
            if (heading) {
                heading.classList.add('animate-wave');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const heading = card.querySelector('h3');
            if (heading) {
                heading.classList.remove('animate-wave');
            }
        });
    });
}

/**
 * Initialize header scroll animations
 * Made global so it can be called from main.js after header loads
 */
window.initHeaderScrollAnimations = function() {
    const headerWrapper = document.querySelector('.header-wrapper');
    
    if (headerWrapper) {
        console.log('Header scroll animations initialized');
        
        function updateHeaderScroll() {
            // Add or remove scrolled class based on scroll position
            if (window.scrollY > 50) {
                headerWrapper.classList.add('scrolled');
                console.log('Header scrolled state: active');
            } else {
                headerWrapper.classList.remove('scrolled');
                console.log('Header scrolled state: inactive');
            }
        }
        
        // Initial state
        updateHeaderScroll();
        
        // Add scroll listener
        window.addEventListener('scroll', updateHeaderScroll);
        
        // Also update on resize to handle mobile/desktop transitions
        window.addEventListener('resize', updateHeaderScroll);
    } else {
        console.error('Header wrapper element not found - cannot initialize animations');
    }
}; 