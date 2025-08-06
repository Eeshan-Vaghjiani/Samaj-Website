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
    
    // Committee page animations
    initCommitteeAnimations();

    // Check if we're on the history-in-pictures page
    if (document.querySelector('.gallery-grid')) {
        // Load gallery images
        loadGalleryImages();
        
        // Initialize gallery lightbox after images are loaded
        // The lightbox initialization is moved inside loadGalleryImages()
    }
    
    // Load timeline data if on the events-timeline page
    if (document.getElementById('timeline')) {
        // Initialize language switcher if we're on timeline page
        initLanguageSwitcher();
        
        // Load timeline data
        loadTimeline();
        
        // Mark timeline as loaded after a short delay for animation
        setTimeout(() => {
            const timeline = document.getElementById('timeline');
            if (timeline) {
                timeline.classList.add('loaded');
            }
        }, 500);
        
        // Add image preview functionality for timeline images
        addTimelineImagePreview();
    }
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
                    // Make sure navigation elements exist before highlighting
                    const navLinks = document.querySelectorAll('.nav-link');
                    if (navLinks.length > 0) {
                        initMobileNav();
                        initHeaderScrollBehavior();
                        highlightActiveLink();
                        console.log('Header scripts executed manually');
                    } else {
                        console.warn('Navigation links not found, waiting...');
                        // Try again after a short delay
                        setTimeout(() => {
                            initMobileNav();
                            initHeaderScrollBehavior();
                            highlightActiveLink();
                            console.log('Header scripts executed after delay');
                        }, 500);
                    }
                    
                    // Add additional mobile nav setup after a brief delay to ensure stability
                    setTimeout(() => {
                        const mobileToggle = document.querySelector('.mobile-nav-toggle');
                        const navContainer = document.querySelector('.nav-container');
                        
                        if (mobileToggle && navContainer) {
                            // Ensure mobile navigation is properly set up
                            console.log('Mobile navigation double-check complete');
                        }
                    }, 100);
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
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.querySelector('.nav-container');

    if (mobileToggle && navContainer) {
        // Add click event to mobile toggle button
        mobileToggle.addEventListener('click', function() {
            if (navContainer.classList.contains('mobile-active')) {
                closeMenu(navContainer, mobileToggle);
            } else {
                openMenu(navContainer, mobileToggle);
            }
        });

        // Add click event to all dropdown menus for mobile
        const dropdownItems = document.querySelectorAll('.nav-menu li.has-dropdown');
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('a, p'); // Include both a and p elements
            if (link) {
                // Mobile dropdown handler
                const mobileClickHandler = function(e) {
                    if (window.innerWidth <= 768 && navContainer.classList.contains('mobile-active')) {
                        const dropdownMenu = item.querySelector('.dropdown-menu');
                        if (dropdownMenu) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Toggle dropdown
                            item.classList.toggle('show-dropdown');
                            
                            // Update aria attributes
                            const isExpanded = item.classList.contains('show-dropdown');
                            link.setAttribute('aria-expanded', isExpanded.toString());
                        }
                    }
                };
                
                link.addEventListener('click', mobileClickHandler);
                
                // Store reference to handler for cleanup
                link._mobileHandler = mobileClickHandler;
            }
        });

        // Set dropdown behavior on window resize
        window.addEventListener('resize', function() {
            const dropdownItems = document.querySelectorAll('.nav-menu li.has-dropdown');
            
            if (window.innerWidth > 768) {
                // Desktop behavior: close mobile menu if open and reset dropdowns
                if (navContainer.classList.contains('mobile-active')) {
                    closeMenu(navContainer, mobileToggle);
                }
                
                dropdownItems.forEach(item => {
                    item.classList.remove('show-dropdown');
                    const link = item.querySelector('a, p');
                    if (link) {
                        link.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Hide overlay if it exists
                const overlay = document.querySelector('.nav-overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });

        // Desktop dropdown behavior
        if (window.innerWidth > 768) {
            // Clear any existing event handlers first
            dropdownItems.forEach(item => {
                const link = item.querySelector('a');
                link.removeEventListener('click', function(){});
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navContainer.classList.contains('mobile-active') && 
                !e.target.closest('.nav-container') && 
                !e.target.closest('.mobile-nav-toggle')) {
                closeMenu(navContainer, mobileToggle);
            }
        });

        // Initialize dropdown on page load
        initDropdownMenus();
    }
}

/**
 * Initialize dropdown menus for both mobile and desktop
 */
function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav-menu li.has-dropdown');
    
    dropdownItems.forEach(item => {
        // Add accessibility attributes
        const link = item.querySelector('a, p'); // Support both a and p elements
        const dropdownMenu = item.querySelector('.dropdown-menu');
        
        if (link && dropdownMenu) {
            link.setAttribute('aria-expanded', 'false');
            link.setAttribute('aria-haspopup', 'true');
            
            // For desktop: handle hover events
            if (window.innerWidth > 768) {
                item.addEventListener('mouseenter', function() {
                    dropdownMenu.style.display = 'block';
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                    link.setAttribute('aria-expanded', 'true');
                });
                
                item.addEventListener('mouseleave', function() {
                    dropdownMenu.style.display = '';
                    dropdownMenu.style.opacity = '';
                    dropdownMenu.style.visibility = '';
                    link.setAttribute('aria-expanded', 'false');
                });
            } else {
                // For mobile: ensure dropdowns are properly reset
                item.classList.remove('show-dropdown');
                link.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * Open mobile menu with animation
 */
function openMenu(navContainer, toggleButton) {
    // Ensure we have the mobile logo visible
    ensureMobileLogo(navContainer);
    
    // Create or show overlay
    // let overlay = document.querySelector('.nav-overlay');
    // if (!overlay) {
    //     overlay = document.createElement('div');
    //     overlay.className = 'nav-overlay';
    //     document.body.appendChild(overlay);
        
    //     // Add click event to close menu when clicking overlay
    //     overlay.addEventListener('click', function() {
    //         closeMenu(navContainer, toggleButton);
    //     });
    // }
    // overlay.classList.add('active');
    
    // Change the toggle button to X while preserving color styling
    const icon = toggleButton.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-times';
        icon.style.color = '#4b5563';
        icon.style.display = 'block';
        icon.style.opacity = '1';
        icon.style.visibility = 'visible';
    }
    toggleButton.setAttribute('aria-expanded', 'true');
    
    // Add active class to nav container with transition
    navContainer.classList.add('mobile-active');
    
    // Prevent body scrolling
    document.body.classList.add('menu-open');
    
    console.log('Menu opened, icon changed to close');
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
    // Hide overlay
    const overlay = document.querySelector('.nav-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Remove classes that lock the body
    navContainer.classList.remove('mobile-active');
    document.body.classList.remove('menu-open');
    
    // Close all open dropdowns in mobile menu
    const openDropdowns = navContainer.querySelectorAll('.has-dropdown.show-dropdown');
    openDropdowns.forEach(dropdown => {
        dropdown.classList.remove('show-dropdown');
        const link = dropdown.querySelector('a, p');
        if (link) {
            link.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Reset the mobile icon
    resetMobileIcon(toggleButton);
}

/**
 * Reset mobile icon to hamburger state
 */
function resetMobileIcon(toggleButton) {
    const icon = toggleButton.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-bars'; // Set hamburger classes
        icon.style.color = '#4b5563'; // Ensure color is preserved
        icon.style.display = 'block';
        icon.style.opacity = '1';
        icon.style.visibility = 'visible';
        console.log('Icon reset to hamburger');
    }
}

/**
 * Initialize header scroll behavior
 */
function initHeaderScrollBehavior() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header-wrapper');
        const navContainer = document.querySelector('.nav-container');
        
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Ensure mobile navigation functionality is preserved regardless of scroll state
            // Re-initialize mobile nav to prevent state conflicts
            if (navContainer && window.innerWidth <= 768) {
                // Keep mobile menu state intact when scrolling
                const mobileToggle = document.querySelector('.mobile-nav-toggle');
                if (mobileToggle && navContainer) {
                    // Preserve the mobile menu state during scroll changes
                    const isMenuOpen = navContainer.classList.contains('mobile-active');
                    
                    // If menu was open, keep it open after scroll state change
                    if (isMenuOpen) {
                        navContainer.classList.add('mobile-active');
                        const icon = mobileToggle.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-times';
                        }
                    }
                }
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
    const timelineItems = document.querySelectorAll('.timeline-item, .timeline-year');
    
    if (timelineItems.length) {
        // Use Intersection Observer for timeline animations
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

/**
 * Load and display timeline from events.json
 */
function loadTimeline() {
    try {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;
        
        timeline.innerHTML = '<div class="loading-message">Loading timeline...</div>';
        
        // Get language preference from localStorage or default to English
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        
        // Determine which JSON file to load
        const jsonFile = lang === 'gu' ? '../data/events-gu.json' : '../data/events.json';
        
        // Fetch events data from JSON file
        fetch(jsonFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                timeline.innerHTML = ''; // Clear loading message
                
                if (!data || data.length === 0) {
                    timeline.innerHTML = '<div class="error-message">No timeline data available.</div>';
                    return;
                }
                
                // Sort events by date
                const events = [...data].sort((a, b) => {
                    const dateA = new Date(a.eventDate);
                    const dateB = new Date(b.eventDate);
                    return dateA - dateB;
                });
        
                let currentYear = '';
                events.forEach((event) => {
                    const eventDateParts = event.eventDate.split(' ');
                    const year = eventDateParts[eventDateParts.length - 1];
                    
                    if (year !== currentYear) {
                        const yearMarker = document.createElement('div');
                        yearMarker.className = 'timeline-year';
                        yearMarker.textContent = year;
                        timeline.appendChild(yearMarker);
                        currentYear = year;
                    }
                    
                    const timelineItem = createTimelineItem(event);
                    timeline.appendChild(timelineItem);
                });

                // Enhance timeline after loading
                enhanceTimelineAnimations();

                // Intersection Observer for animations
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

                document.querySelectorAll('.timeline-item, .timeline-year').forEach(item => {
                    observer.observe(item);
                });
            })
            .catch(error => {
                console.error('Error loading timeline:', error);
                timeline.innerHTML = '<div class="error-message">Error loading timeline data. Please try again later.</div>';
            });
    } catch (error) {
        console.error('Error in loadTimeline function:', error);
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.innerHTML = '<div class="error-message">Error loading timeline. Please try again later.</div>';
        }
    }
}

/**
 * Create timeline item element from event data
 * Made accessible globally for the language switcher functionality
 */
function createTimelineItem(event) {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    // Get current count of timeline items to determine position
    const existingItems = document.querySelectorAll('.timeline-item').length;
    timelineItem.dataset.index = existingItems; // Add index data attribute
    
    // Add classes for alternating pattern
    if (existingItems % 2 === 0) {
        timelineItem.classList.add('timeline-left');
    } else {
        timelineItem.classList.add('timeline-right');
    }
    
    const content = `
        <div class="timeline-content">
            <span class="timeline-date">${event.eventDate}</span>
            <p>${event.eventDescription}</p>
            ${event.eventItems && event.eventItems.length > 0 ? `
                <ul>
                    ${event.eventItems.map(item => `<li>${item.item}</li>`).join('')}
                </ul>
            ` : ''}
            ${event.eventImage ? `<img src="${event.eventImage}" alt="${event.eventDescription}" class="timeline-image">` : ''}
        </div>
        <div class="timeline-dot"></div>
    `;
    
    timelineItem.innerHTML = content;
    return timelineItem;
}

/**
 * Enhanced timeline animations to enforce alternating pattern
 */
function enhanceTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const isMobile = window.innerWidth <= 768;
    
    // First, remove any existing classes that might interfere
    timelineItems.forEach(item => {
        item.classList.remove('timeline-left', 'timeline-right');
    });
    
    // Apply different layouts based on viewport size
    if (isMobile) {
        // For mobile: all items on one side
        timelineItems.forEach(item => {
            // Reset any desktop specific styles
            item.style.left = '0';
            item.style.textAlign = 'left';
            
            // Add mobile specific class if needed
            item.classList.add('timeline-mobile');
        });
    } else {
        // For desktop: alternating pattern (even = left, odd = right)
        timelineItems.forEach((item, index) => {
            if (index % 2 === 0) { // Even indexes (0, 2, 4...)
                item.classList.add('timeline-left');
                item.style.left = '0';
                item.style.textAlign = 'right';
            } else { // Odd indexes (1, 3, 5...)
                item.classList.add('timeline-right');
                item.style.left = '50%';
                item.style.textAlign = 'left';
            }
        });
    }
    
    // Create IntersectionObserver for animation
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add custom animation class based on item position
                if (entry.target.classList.contains('timeline-item')) {
                    if (isMobile) {
                        // Simple fade-in for mobile
                        entry.target.style.animation = 'fadeInRight 0.8s ease forwards';
                    } else {
                        // Direction-specific animations for desktop
                        if (entry.target.classList.contains('timeline-left')) {
                            entry.target.style.animation = 'fadeInLeft 0.8s ease forwards';
                        } else {
                            entry.target.style.animation = 'fadeInRight 0.8s ease forwards';
                        }
                    }
                }
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all timeline items and year markers
    document.querySelectorAll('.timeline-item, .timeline-year').forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Add window resize listener to reapply layouts on window resize
    window.addEventListener('resize', debounce(() => {
        // Only re-run if viewport width crosses the mobile threshold
        if ((window.innerWidth <= 768 && !isMobile) || 
            (window.innerWidth > 768 && isMobile)) {
            enhanceTimelineAnimations();
        }
    }, 250));
}

/**
 * Simple debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Add image preview functionality to timeline images
 */
function addTimelineImagePreview() {
    // Add image preview functionality using event delegation
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('timeline-image')) {
            // Toggle expanded class
            e.target.classList.toggle('expanded');
            
            // Create or remove overlay
            if (e.target.classList.contains('expanded')) {
                const overlay = document.createElement('div');
                overlay.className = 'timeline-image-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                overlay.style.zIndex = '999';
                overlay.style.cursor = 'zoom-out';
                document.body.appendChild(overlay);
                
                // Add click event to close when clicking anywhere
                overlay.addEventListener('click', () => {
                    e.target.classList.remove('expanded');
                    document.body.removeChild(overlay);
                });
                
                // Prevent scrolling when image is expanded
                document.body.style.overflow = 'hidden';
            } else {
                // Remove overlay if it exists
                const overlay = document.querySelector('.timeline-image-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
                
                // Re-enable scrolling
                document.body.style.overflow = '';
            }
        }
    });
}

/**
 * Initialize language switcher for timeline page
 */
function initLanguageSwitcher() {
    const languageOptions = document.querySelectorAll('.language-option');
    const languageSlider = document.querySelector('.language-slider');
    
    if (!languageOptions.length || !languageSlider) return;
    
    // Get saved language preference from localStorage or default to English
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Initial slider setup with proper width and position
    if (languageSlider && languageOptions.length > 0) {
        // Set initial position based on saved language
        const activeOption = document.querySelector(`.language-option[data-lang="${savedLang}"]`) || languageOptions[0];
        const width = activeOption.offsetWidth;
        const left = activeOption.offsetLeft;
        
        // Set slider width and position
        languageSlider.style.width = `${width}px`;
        languageSlider.style.transform = `translateX(${left}px)`;
    }
    
    // Set initial slider position and active state
    updateLanguageSwitcher(savedLang);
    
    // Load timeline data with the saved language
    loadTimelineData(savedLang);
    
    // Add event listeners to language options
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Update the UI
            updateLanguageSwitcher(lang);
            
            // Save preference
            localStorage.setItem('preferredLanguage', lang);
            
            // Reload timeline data
            loadTimelineData(lang);
        });
    });
}

/**
 * Update language switcher UI
 */
function updateLanguageSwitcher(lang) {
    const languageOptions = document.querySelectorAll('.language-option');
    const languageSlider = document.querySelector('.language-slider');
    
    if (!languageOptions.length || !languageSlider) return;
    
    // Update active state
    languageOptions.forEach(opt => {
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('active');
            // Move slider to selected option
            const width = opt.offsetWidth;
            const left = opt.offsetLeft;
            languageSlider.style.width = `${width}px`;
            languageSlider.style.transform = `translateX(${left}px)`;
        } else {
            opt.classList.remove('active');
        }
    });
}

/**
 * Load timeline data based on language
 */
function loadTimelineData(lang) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '<div class="loading-message">Loading timeline...</div>';
    
    // Determine which JSON file to load
    const jsonFile = lang === 'gu' ? '../data/events-gu.json' : '../data/events.json';
    
    // Fetch events data from JSON file
    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            timeline.innerHTML = ''; // Clear loading message
            
            if (!data || data.length === 0) {
                timeline.innerHTML = '<div class="error-message">No timeline data available.</div>';
                return;
            }
            
            // Sort events by date
            const events = [...data].sort((a, b) => {
                const dateA = new Date(a.eventDate);
                const dateB = new Date(b.eventDate);
                return dateA - dateB;
            });
    
            let currentYear = '';
            events.forEach((event) => {
                const eventDateParts = event.eventDate.split(' ');
                const year = eventDateParts[eventDateParts.length - 1];
                
                if (year !== currentYear) {
                    const yearMarker = document.createElement('div');
                    yearMarker.className = 'timeline-year';
                    yearMarker.textContent = year;
                    timeline.appendChild(yearMarker);
                    currentYear = year;
                }
                
                const timelineItem = createTimelineItem(event);
                timeline.appendChild(timelineItem);
            });
            
            // Call enhanced animations after loading new data
            enhanceTimelineAnimations();
        })
        .catch(error => {
            console.error('Error loading timeline:', error);
            timeline.innerHTML = `<div class="error-message">Error loading timeline data. Please try again later.</div>`;
        });
}

/**
 * Initialize lightbox functionality for gallery images
 */
function initGalleryLightbox() {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';
    
    const lightboxClose = document.createElement('div');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';
    
    const lightboxNavigation = document.createElement('div');
    lightboxNavigation.className = 'lightbox-navigation';
    
    const prevButton = document.createElement('div');
    prevButton.className = 'lightbox-nav prev';
    prevButton.innerHTML = '&#10094;';
    
    const nextButton = document.createElement('div');
    nextButton.className = 'lightbox-nav next';
    nextButton.innerHTML = '&#10095;';
    
    // Append elements
    lightboxNavigation.appendChild(prevButton);
    lightboxNavigation.appendChild(nextButton);
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(lightboxCaption);
    lightbox.appendChild(lightboxContent);
    lightbox.appendChild(lightboxClose);
    lightbox.appendChild(lightboxNavigation);
    
    // Add to document
    document.body.appendChild(lightbox);
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        
        item.addEventListener('click', function() {
            currentIndex = index;
            updateLightbox(img.src, caption.textContent);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scrolling
    });
    
    // Close on lightbox background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Enable scrolling
        }
    });
    
    // Navigate to previous image
    prevButton.addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        const img = galleryItems[currentIndex].querySelector('img');
        const caption = galleryItems[currentIndex].querySelector('.gallery-caption');
        updateLightbox(img.src, caption.textContent);
    });
    
    // Navigate to next image
    nextButton.addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        const img = galleryItems[currentIndex].querySelector('img');
        const caption = galleryItems[currentIndex].querySelector('.gallery-caption');
        updateLightbox(img.src, caption.textContent);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Enable scrolling
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            const img = galleryItems[currentIndex].querySelector('img');
            const caption = galleryItems[currentIndex].querySelector('.gallery-caption');
            updateLightbox(img.src, caption.textContent);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            const img = galleryItems[currentIndex].querySelector('img');
            const caption = galleryItems[currentIndex].querySelector('.gallery-caption');
            updateLightbox(img.src, caption.textContent);
        }
    });
    
    // Update lightbox content
    function updateLightbox(src, caption) {
        // Animate transition
        lightboxImage.style.opacity = 0;
        lightboxCaption.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImage.src = src;
            lightboxCaption.textContent = caption;
            
            // Wait for image to load
            lightboxImage.onload = function() {
                lightboxImage.style.opacity = 1;
                lightboxCaption.style.opacity = 1;
            };
        }, 300);
    }
    
    // Add CSS transition for smooth image changes
    lightboxImage.style.transition = 'opacity 0.3s ease';
    lightboxCaption.style.transition = 'opacity 0.3s ease';
}

/**
 * Load gallery images for the history-in-pictures page
 */
function loadGalleryImages() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadingIndicator = document.getElementById('gallery-loading');
    
    if (!galleryGrid || !loadingIndicator) {
        console.error('Gallery elements not found');
        return;
    }
    
    console.log('Starting to load gallery images');
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    galleryGrid.innerHTML = ''; // Clear any existing content
    
    // Specify the timeline photos path - updated to use correct relative path
    const basePath = '../assets/images/Timeline Related Photos/';
    
    // Files to exclude
    const excludeFiles = ['samaj logo.png', 'samaj.jpg', 'school.jpg'];
    
    // Fetch image paths from JSON file
    fetch('../data/gallery-images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            console.log('Successfully fetched gallery-images.json');
            return response.json();
        })
        .then(data => {
            if (!data || !data.images || data.images.length === 0) {
                throw new Error('No images found in gallery data');
            }
            
            console.log(`Found ${data.images.length} images in JSON data`);
            
            // Create a manual set of images as a fallback
            const manualImages = [
                '25-12-54 Inauguration of Ronald Ngala Samaj.jpg',
                '09-08-81 Visit by Indira Gandhi.jpg',
                '21-10-91 Foundation Stone Laying of Devshi Dhanji Memorial Hall by Mr _ Mrs. Ramji Devshi Vekaria.jpg',
                '15-08-10 Kay Pavilion Foundation.JPG',
                '2.Ronald Ngala/1954 Opening Ceremony by Mr. Khimji Ramji Patel, Mr.Ramji Kurji Raghwani _ Mr. Lalji Harji Varsani.jpg',
                '3 First 10 Years 1993-2002/Foundation Stone Laying of Samaj Flats Phase II on 14th February 1999.jpg',
                '4. 5 Years (2003-2007)/Youth League Volleyball Tournament March 2006.JPG',
                '6. Next 10 Years (2008 - 2018)/2016 Free Medical Camp - Eye Checkup.JPG'
            ];
            
            // Use manual images if necessary
            const imagesToUse = data.images.length > 0 ? data.images : manualImages;
            console.log(`Using ${imagesToUse.length} images for gallery`);
            
            // Filter out excluded files and remove duplicates
            const uniquePaths = new Set();
            const filteredImages = imagesToUse.filter(path => {
                const filename = path.split('/').pop(); // Get just the filename
                
                // Skip excluded files
                if (excludeFiles.includes(filename)) {
                    return false;
                }
                
                // Skip duplicates
                if (uniquePaths.has(path)) {
                    return false;
                }
                
                uniquePaths.add(path);
                return true;
            });
            
            if (filteredImages.length === 0) {
                throw new Error('No valid images found after filtering');
            }
            
            console.log(`After filtering, using ${filteredImages.length} images`);
            
            // Keep track of loading progress
            let loadedImages = 0;
            let failedImages = 0;
            
            // Create gallery items for each image
            filteredImages.forEach((imagePath, index) => {
                const relativePath = basePath + imagePath;
                const filename = imagePath.split('/').pop();
                
                console.log(`Processing image ${index + 1}/${filteredImages.length}: ${relativePath}`);
                
                // Create a nice caption from the filename
                let caption = filename
                    .replace(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/, '') // Remove file extension
                    .replace(/^\d+\-\d+\-\d+\s+/, '') // Remove date prefix
                    .replace(/\_/g, ' ') // Replace underscores with spaces
                    .replace(/(\d+)\-(\d+)\-(\d+)/g, (match, day, month, year) => {
                        // Format dates
                        if (year.length === 2) {
                            year = parseInt(year) < 50 ? '20' + year : '19' + year;
                        }
                        return `(${month}/${day}/${year})`;
                    })
                    .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, (match, month, day, year) => {
                        // Format dates as "Month Day, Year"
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        try {
                            const monthIndex = parseInt(month) - 1;
                            if (monthIndex >= 0 && monthIndex < 12) {
                                return `(${months[monthIndex]} ${day}, ${year})`;
                            }
                        } catch (e) {
                            console.error('Error formatting date:', e);
                        }
                        return match;
                    })
                    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lower and uppercase letters
                    .replace(/  +/g, ' ') // Replace multiple spaces with a single space
                    .trim();
                
                // Create gallery item
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                // Create image element
                const img = document.createElement('img');
                img.src = relativePath;
                img.alt = caption;
                img.loading = 'lazy';
                
                // Create caption element
                const captionDiv = document.createElement('div');
                captionDiv.className = 'gallery-caption';
                captionDiv.textContent = caption;
                
                // Handle image load error
                img.onerror = function() {
                    console.error('Failed to load image:', relativePath);
                    failedImages++;
                    galleryItem.remove();
                    
                    // Check if all images have been processed
                    if (loadedImages + failedImages === filteredImages.length) {
                        finishLoading();
                    }
                };
                
                // Handle image load success
                img.onload = function() {
                    console.log('Successfully loaded image:', relativePath);
                    loadedImages++;
                    
                    // Check if all images have been processed
                    if (loadedImages + failedImages === filteredImages.length) {
                        finishLoading();
                    }
                };
                
                // Append elements to gallery item
                galleryItem.appendChild(img);
                galleryItem.appendChild(captionDiv);
                
                // Add gallery item to grid
                galleryGrid.appendChild(galleryItem);
            });
            
            // Function to finalize loading
            function finishLoading() {
                console.log(`Finished loading gallery: ${loadedImages} loaded, ${failedImages} failed`);
                
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                
                // Check if any images were successfully loaded
                if (loadedImages === 0) {
                    galleryGrid.innerHTML = '<div class="error-message">No images could be loaded. Please try again later.</div>';
                    return;
                }
                
                // Initialize lightbox after images are loaded
                console.log('Initializing gallery lightbox');
                initGalleryLightbox();
                
                // Add animation to gallery items
                const galleryItems = document.querySelectorAll('.gallery-item');
                galleryItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate__animated', 'animate__fadeInUp');
                    }, index * 100);
                });
            }
        })
        .catch(error => {
            console.error('Error loading gallery images:', error);
            loadingIndicator.style.display = 'none';
            galleryGrid.innerHTML = `<div class="error-message">Error loading images: ${error.message}</div>`;
        });
}

/**
 * Initialize animations for committee pages
 */
function initCommitteeAnimations() {
    // Check if we're on a committee page
    if (document.querySelector('.committee-main')) {
        console.log('Initializing committee page animations');
        
        // Add animation class to hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animated');
        }
        
        // Apply animations to each committee column
        const committeeColumns = document.querySelectorAll('.committee-col');
        committeeColumns.forEach((col, index) => {
            // Add a slight delay based on index
            col.style.animationDelay = `${index * 0.2}s`;
            
            // Add entrance animation
            col.classList.add('animate__animated', 'animate__fadeInUp');
            
            // Apply item index to paragraphs for staggered animation
            const paragraphs = col.querySelectorAll('p');
            paragraphs.forEach((p, pIndex) => {
                p.style.setProperty('--item-index', pIndex + 1);
            });
            
            // Apply item index to list items for staggered animation
            const listItems = col.querySelectorAll('ul li');
            listItems.forEach((li, liIndex) => {
                li.style.setProperty('--item-index', liIndex + 1);
            });
            
            // Add hover animation for headings
            const headings = col.querySelectorAll('.committee-heading');
            headings.forEach(heading => {
                heading.addEventListener('mouseenter', function() {
                    heading.classList.add('heading-hover');
                });
                
                heading.addEventListener('mouseleave', function() {
                    heading.classList.remove('heading-hover');
                });
            });
        });
        
        // Add smooth scroll to anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Intersection Observer for on-scroll animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe committee rows
        const committeeRows = document.querySelectorAll('.committee-row');
        committeeRows.forEach(row => {
            observer.observe(row);
        });
    }
} 

function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop(); // e.g. 'board-and-management.html'
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');

            // Now highlight the parent dropdown link too
            const parentLi = link.closest('li.has-dropdown');
            if (parentLi) {
                // Find the first direct child <a> of the parent dropdown li and add active class
                const parentLink = parentLi.querySelector(':scope > a.nav-link');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
}