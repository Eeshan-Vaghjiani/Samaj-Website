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
                
                // Debug mobile menu logo
                const mobileLogo = document.querySelector('.mobile-menu-logo');
                const mobileLogoImg = document.querySelector('.mobile-menu-logo .logo');
                if (mobileLogo) {
                    console.log('Mobile logo container found:', mobileLogo);
                    console.log('Mobile logo display:', window.getComputedStyle(mobileLogo).display);
                } else {
                    console.error('Mobile logo container NOT found!');
                }
                
                if (mobileLogoImg) {
                    console.log('Mobile logo image found:', mobileLogoImg);
                    console.log('Mobile logo image src:', mobileLogoImg.src);
                    console.log('Mobile logo image visibility:', window.getComputedStyle(mobileLogoImg).visibility);
                    console.log('Mobile logo image display:', window.getComputedStyle(mobileLogoImg).display);
                } else {
                    console.error('Mobile logo image NOT found!');
                }
                
                // Execute header scripts manually after ensuring the DOM is fully loaded
                setTimeout(() => {
                    initMobileNav();
                    initHeaderScrollBehavior();
                    console.log('Header scripts executed manually');
                }, 300);
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerPlaceholder.innerHTML = '<div class="p-4 text-center bg-red-100 text-red-700">Error loading header</div>';
            });
    }
}

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileNavToggle && navContainer) {
        console.log('Mobile nav elements found');
        
        // Prevent default action on button when it's clicked directly
        mobileNavToggle.onclick = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        };
        
        // Ensure the icon is in hamburger state on load
        resetMobileIcon(mobileNavToggle);
        
        // Store the current scroll position globally
        window.lastScrollPosition = 0;
        
        // Direct click handler on the toggle button
        mobileNavToggle.addEventListener('click', function(e) {
            // Prevent any default behavior - extra thorough
            if (e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent document click from firing
            }
            console.log('Mobile toggle clicked');
            
            // Toggle menu state
            const isActive = navContainer.classList.contains('mobile-active');
            if (isActive) {
                closeMenu(navContainer, mobileNavToggle);
            } else {
                // Store current scroll position when opening the menu
                window.lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                console.log('Saving scroll position:', window.lastScrollPosition);
                openMenu(navContainer, mobileNavToggle);
            }
            
            // Prevent any hash navigation
            return false;
        }, {capture: true});
        
        // Prevent clicks on button from propagating
        mobileNavToggle.addEventListener('click', function(e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            return false;
        }, {capture: true});
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navContainer.classList.contains('mobile-active') &&
                !navContainer.contains(e.target) &&
                e.target !== mobileNavToggle &&
                !mobileNavToggle.contains(e.target)) {
                
                closeMenu(navContainer, mobileNavToggle);
                
                // Don't reset the scroll position
                console.log('Maintaining scroll position on outside click');
            }
        });
        
        // Improved mobile dropdown menus with smooth transitions
        const dropdownLinks = document.querySelectorAll('.nav-menu li.has-dropdown > a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent closing the mobile menu
                    
                    const parent = this.parentNode;
                    const dropdown = parent.querySelector('.dropdown-menu');
                    const isOpen = parent.classList.contains('show-dropdown');
                    
                    console.log('Dropdown clicked:', dropdown);
                    console.log('Is currently open:', isOpen);
                    
                    // First close any open dropdowns
                    document.querySelectorAll('.nav-menu li.has-dropdown.show-dropdown').forEach(item => {
                        if (item !== parent) {
                            item.classList.remove('show-dropdown');
                            console.log('Closed other dropdown');
                        }
                    });
                    
                    // Toggle this dropdown with a slight delay to ensure proper rendering
                    setTimeout(() => {
                        parent.classList.toggle('show-dropdown');
                        console.log('Toggled dropdown to:', parent.classList.contains('show-dropdown'));
                        
                        // Force browser to recalculate layout
                        dropdown.offsetHeight;
                    }, 10);
                    
                    // Smooth scroll to show dropdown content if needed
                    if (!isOpen && dropdown) {
                        // Wait for the dropdown to expand
                        setTimeout(() => {
                            // Check if the dropdown is below viewport
                            const dropdownBottom = dropdown.getBoundingClientRect().bottom;
                            const viewportHeight = window.innerHeight;
                            
                            console.log('Dropdown bottom:', dropdownBottom, 'Viewport height:', viewportHeight);
                            
                            if (dropdownBottom > viewportHeight - 50) { // Add extra margin
                                // Scroll to make entire dropdown visible
                                const scrollAmount = dropdownBottom - viewportHeight + 100; // 100px extra padding
                                console.log('Scrolling down by:', scrollAmount);
                                
                                window.scrollBy({
                                    top: scrollAmount,
                                    behavior: 'smooth'
                                });
                            }
                        }, 350); // Wait a bit longer for dropdown animation
                    }
                    
                    // Prevent any hash or default navigation
                    return false;
                }
            });
        });
        
        // Add search functionality
        const searchIcon = document.querySelector('.header-actions .search-icon');
        if (searchIcon) {
            searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                // Implement search functionality or toggle search box
                console.log('Search icon clicked');
                
                // Prevent any hash or default navigation
                return false;
            });
        }
    } else {
        console.error('Mobile nav elements not found');
    }
}

/**
 * Open the mobile menu
 */
function openMenu(navContainer, toggleButton) {
    // Store scroll position in body's data attribute
    document.body.setAttribute('data-scroll-position', window.lastScrollPosition);
    document.body.style.top = `-${window.lastScrollPosition}px`;
    
    // Add active classes
    navContainer.classList.add('mobile-active');
    document.body.classList.add('menu-open');
    
    // Change icon to X
    const icon = toggleButton.querySelector('i');
    if (icon) {
        icon.className = ''; // Clear all classes
        icon.classList.add('fas', 'fa-times');
        console.log('Icon changed to close (X)');
    }
    
    // Ensure mobile logo exists and is visible
    ensureMobileLogo(navContainer);
}

/**
 * Ensure mobile logo exists and is visible in the nav container
 */
function ensureMobileLogo(navContainer) {
    // Check if mobile logo already exists
    let mobileLogo = navContainer.querySelector('.mobile-menu-logo');
    
    // If not found or not visible, create it manually
    if (!mobileLogo || window.getComputedStyle(mobileLogo).display === 'none') {
        console.log('Mobile logo not found or not visible, creating manually');
        
        // Remove existing if found but not visible
        if (mobileLogo) {
            mobileLogo.remove();
        }
        
        // Create the mobile logo container
        mobileLogo = document.createElement('div');
        mobileLogo.className = 'mobile-menu-logo';
        mobileLogo.style.display = 'flex';
        mobileLogo.style.flexDirection = 'column';
        mobileLogo.style.justifyContent = 'center';
        mobileLogo.style.alignItems = 'center';
        mobileLogo.style.padding = '20px 0 30px';
        mobileLogo.style.borderBottom = '1px solid #eee';
        mobileLogo.style.marginBottom = '20px';
        mobileLogo.style.textAlign = 'center';
        mobileLogo.style.width = '100%';
        
        // Create the logo image
        const logoImg = document.createElement('img');
        logoImg.src = '../assets/images/Timeline Related Photos/samaj logo.png';
        logoImg.alt = 'Samaj Logo';
        logoImg.className = 'logo';
        logoImg.style.width = '80px';
        logoImg.style.height = 'auto';
        logoImg.style.display = 'block';
        logoImg.style.marginBottom = '15px';
        
        // Create the title
        const title = document.createElement('h3');
        title.className = 'mobile-title';
        title.textContent = 'Shree Cutchi Leva Patel Samaj';
        title.style.fontSize = '1.1rem';
        title.style.fontWeight = '600';
        title.style.margin = '0';
        title.style.padding = '0';
        
        // Add elements to the DOM
        mobileLogo.appendChild(logoImg);
        mobileLogo.appendChild(title);
        
        // Insert at the beginning of the nav container
        const mainNav = navContainer.querySelector('#main-nav');
        if (mainNav) {
            navContainer.insertBefore(mobileLogo, mainNav);
        } else {
            navContainer.insertBefore(mobileLogo, navContainer.firstChild);
        }
        
        console.log('Mobile logo created and inserted');
    }
}

/**
 * Close the mobile menu
 */
function closeMenu(navContainer, toggleButton) {
    // Get the stored scroll position
    const scrollPosition = parseInt(document.body.getAttribute('data-scroll-position'), 10) || 0;
    
    // Remove classes that lock the body
    navContainer.classList.remove('mobile-active');
    document.body.classList.remove('menu-open');
    
    // Reset the body position
    document.body.style.top = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
    console.log('Restoring scroll position:', scrollPosition);
    
    // Reset the mobile icon
    resetMobileIcon(toggleButton);
}

/**
 * Reset mobile icon to hamburger state
 */
function resetMobileIcon(toggleButton) {
    const icon = toggleButton.querySelector('i');
    if (icon) {
        icon.className = ''; // Clear all classes
        icon.classList.add('fas', 'fa-bars');
        console.log('Icon reset to hamburger');
    }
}

/**
 * Initialize header scroll behavior
 */
function initHeaderScrollBehavior() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header-wrapper');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
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