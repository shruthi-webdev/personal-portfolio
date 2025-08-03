document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mainContent = document.getElementById('mainContent');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // Mobile Menu Functionality
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    function toggleMobileMenu() {
        const isActive = sidebar.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        sidebar.classList.add('active');
        mainContent.classList.add('shifted');
        mobileOverlay.classList.add('active');
        mobileOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Update menu button icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }

    function closeMobileMenu() {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Hide overlay after transition
        setTimeout(() => {
            if (!mobileOverlay.classList.contains('active')) {
                mobileOverlay.style.display = 'none';
            }
        }, 300);
        
        // Update menu button icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Close menu on window resize if desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calculate offset for mobile menu if active
                let offset = targetSection.offsetTop;
                
                // Adjust for mobile menu height
                if (window.innerWidth <= 768) {
                    offset -= 80; // Account for mobile menu button
                }
                
                if (targetId === 'home') {
                    offset = 0;
                }

                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });

                // Close mobile menu after navigation
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            }
        });
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    
    const updateActiveLink = () => {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Adjust for mobile offset
            const offset = window.innerWidth <= 768 ? 100 : 50;
            
            if (scrollPosition >= (sectionTop - offset) && scrollPosition < (sectionBottom - offset)) {
                current = section.getAttribute('id');
            }
        });

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Run on load

    // Enhanced Project Progress Bar Logic with Milestones
const projectProgressBar = document.querySelector('.project-progress-bar');
const playPauseBtn = projectProgressBar?.querySelector('.play-pause-btn');
const nextProjectBtn = projectProgressBar?.querySelector('.fa-forward')?.closest('button');
const prevProjectBtn = projectProgressBar?.querySelector('.fa-backward')?.closest('button');
const progressBarFill = projectProgressBar?.querySelector('.progress-bar-fill');
const progressCurrentTime = projectProgressBar?.querySelector('.current-time');
const projectStatus = projectProgressBar?.querySelector('.project-status');

class EnhancedProgressPlayer {
    constructor() {
        this.currentProjectIndex = 0;
        this.isPlaying = false;
        this.currentProgress = 0;
        this.progressInterval = null;
        this.isPaused = false;
        
        this.portfolioProjects = [
            {
                title: "Portfolio Website V2",
                thumbnail: "https://i.postimg.cc/QC5KRRSW/Woman-working-on-laptop-at-clean-white-desk-modern-workspace-mockup-for-branding-and-websites.jpg",
                milestones: {
                    0: "Ready to start development",
                    15: "Initial setup and planning",
                    35: "spotify inspired base structure",
                    45: "styling and layout complete",
                    60: "added timeline and progress bar",
                    75: "mobile responsivity implemented",
                    80: "testing and debugging",
                    90: "Performance optimized",
                    100: "Project completed successfully!"
                }
            },
            {
                title: "Expense Tracker",
                thumbnail: "https://i.postimg.cc/kMtQ6jv9/screencapture-expense-tracker-five-alpha-98-vercel-app-2025-07-30-16-23-01.png",
                milestones: {
                    0: "Planning application structure",
                    15: "Array setup complete",
                    35: "Core functionality implemented",
                    50: "Added bar graph and trend lines",
                    60: "Added Lottie animations for blob",
                    75: "Future expenses planning section",
                    80: "Testing and debugging",
                    95: "Final optimizations",
                    100: "Live and fully functional!"
                }
            },
            {
                title: "Sports Academy Website",
                thumbnail: "https://i.postimg.cc/7Y0ncB5X/Screenshot-2025-07-30-162115.png",
                milestones: {
                    0: "Content planning phase",
                    15: "Data collection complete",
                    35: "Homepage structure built",
                    50: "All pages implemented",
                    60: "Added forms and other features",
                    75: "Content management added",
                    80: "Deployed and tested",
                    90: "User reviews and feedback",
                    100: "Academy website is live!"
                }
            }
        ];
        
        this.milestonePoints = [15,35, 60, 80]; // Points where progress should pause
        this.pauseDuration = 2500; // 2.5 seconds pause at each milestone
        
        this.initializePlayer();
    }
    
    initializePlayer() {
        this.updateProjectInfo();
        this.bindEvents();
        this.createMilestoneMarkers();
    }
    
    bindEvents() {
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (nextProjectBtn) {
            nextProjectBtn.addEventListener('click', () => this.nextProject());
        }
        
        if (prevProjectBtn) {
            prevProjectBtn.addEventListener('click', () => this.previousProject());
        }
        
        // Click on progress bar to seek
        const progressContainer = document.querySelector('.progress-bar-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => this.seekTo(e));
        }
    }
    
    createMilestoneMarkers() {
        const progressContainer = document.querySelector('.progress-bar-container');
        if (!progressContainer) return;
        
        // Remove existing markers
        progressContainer.querySelectorAll('.milestone-marker').forEach(marker => marker.remove());
        
        // Create new markers
        this.milestonePoints.forEach(point => {
            const marker = document.createElement('div');
            marker.className = 'milestone-marker';
            marker.style.left = `${point}%`;
            marker.dataset.milestone = point;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'milestone-tooltip';
            
            const currentProject = this.portfolioProjects[this.currentProjectIndex];
            const milestoneText = currentProject.milestones[point] || `${point}% Complete`;
            tooltip.textContent = milestoneText;
            
            marker.appendChild(tooltip);
            progressContainer.appendChild(marker);
            
            // Add click event to marker
            marker.addEventListener('click', () => this.seekToMilestone(point));
        });
    }
    
    togglePlayPause() {
        const icon = playPauseBtn?.querySelector('i');
        if (!icon) return;
        
        if (!this.isPlaying && !this.isPaused) {
            // Start playing
            this.startProgress();
            icon.icon.classList.remove('fa-play');
           icon.classList.add('fa-pause');
       } else if (this.isPlaying && !this.isPaused) {
           // Pause manually
           this.pauseProgress();
           icon.classList.remove('fa-pause');
           icon.classList.add('fa-play');
       } else if (this.isPaused) {
           // Resume from pause
           this.resumeProgress();
           icon.classList.remove('fa-play');
           icon.classList.add('fa-pause');
       }
   }
   
   startProgress() {
       this.isPlaying = true;
       this.isPaused = false;
       
       const progressSpeed = 0.8; // Progress per interval (adjust for speed)
       const intervalTime = 60; // milliseconds
       
       this.progressInterval = setInterval(() => {
           if (this.currentProgress >= 100) {
               this.completeProgress();
               return;
           }
           
           // Check if we've hit a milestone
           const nextMilestone = this.milestonePoints.find(point => 
               point > this.currentProgress && point <= this.currentProgress + progressSpeed
           );
           
           if (nextMilestone) {
               // Pause at milestone
               this.currentProgress = nextMilestone;
               this.updateProgressDisplay();
               this.pauseAtMilestone(nextMilestone);
               return;
           }
           
           this.currentProgress += progressSpeed;
           this.updateProgressDisplay();
           
       }, intervalTime);
   }
   
   pauseAtMilestone(milestone) {
       this.pauseProgress();
       
       // Mark milestone as reached
       const marker = document.querySelector(`[data-milestone="${milestone}"]`);
       if (marker) {
           marker.classList.add('reached');
           // Add visual feedback
           marker.style.transform = 'translateY(-50%) scale(1.3)';
           marker.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
       }
       
       // Update status with milestone achievement
       if (projectStatus) {
           projectStatus.classList.add('milestone');
           projectStatus.style.color = '#ffd700';
       }
       
       // Auto-resume after pause duration
       setTimeout(() => {
           if (this.isPaused) {
               this.resumeProgress();
               
               // Reset milestone visual effects
               if (marker) {
                   marker.style.transform = '';
                   marker.style.boxShadow = '';
               }
               
               if (projectStatus) {
                   projectStatus.classList.remove('milestone');
                   projectStatus.style.color = '';
               }
               
               // Update play button icon
               const icon = playPauseBtn?.querySelector('i');
               if (icon) {
                   icon.classList.remove('fa-play');
                   icon.classList.add('fa-pause');
               }
           }
       }, this.pauseDuration);
   }
   
   pauseProgress() {
       clearInterval(this.progressInterval);
       this.isPlaying = false;
       this.isPaused = true;
   }
   
   resumeProgress() {
       this.isPaused = false;
       this.startProgress();
   }
   
   completeProgress() {
       clearInterval(this.progressInterval);
       this.isPlaying = false;
       this.isPaused = false;
       this.currentProgress = 100;
       this.updateProgressDisplay();
       
       // Update button icon
       const icon = playPauseBtn?.querySelector('i');
       if (icon) {
           icon.classList.remove('fa-pause');
           icon.classList.add('fa-play');
       }
       
       // Show completion status
       if (projectStatus) {
           projectStatus.style.color = '#1db954';
           projectStatus.classList.add('milestone');
       }
       
       // Auto-reset after 4 seconds
       setTimeout(() => {
           this.resetProgress();
       }, 4000);
   }
   
   resetProgress() {
       this.currentProgress = 0;
       this.isPlaying = false;
       this.isPaused = false;
       this.updateProgressDisplay();
       
       // Reset milestone markers
       document.querySelectorAll('.milestone-marker').forEach(marker => {
           marker.classList.remove('reached');
           marker.style.transform = '';
           marker.style.boxShadow = '';
       });
       
       // Reset status styling
       if (projectStatus) {
           projectStatus.classList.remove('milestone');
           projectStatus.style.color = '';
       }
       
       // Reset button icon
       const icon = playPauseBtn?.querySelector('i');
       if (icon) {
           icon.classList.remove('fa-pause');
           icon.classList.add('fa-play');
       }
   }
   
   seekTo(e) {
       const progressContainer = document.querySelector('.progress-bar-container');
       if (!progressContainer) return;
       
       const rect = progressContainer.getBoundingClientRect();
       const clickX = e.clientX - rect.left;
       const newProgress = (clickX / rect.width) * 100;
       
       this.currentProgress = Math.max(0, Math.min(100, newProgress));
       this.updateProgressDisplay();
       
       // Update milestone markers
       document.querySelectorAll('.milestone-marker').forEach(marker => {
           const milestone = parseInt(marker.dataset.milestone);
           if (milestone <= this.currentProgress) {
               marker.classList.add('reached');
           } else {
               marker.classList.remove('reached');
           }
       });
   }
   
   seekToMilestone(milestone) {
       this.currentProgress = milestone;
       this.updateProgressDisplay();
       
       // Update milestone markers
       document.querySelectorAll('.milestone-marker').forEach(marker => {
           const markerMilestone = parseInt(marker.dataset.milestone);
           if (markerMilestone <= milestone) {
               marker.classList.add('reached');
           } else {
               marker.classList.remove('reached');
           }
       });
   }
   
   updateProgressDisplay() {
       if (progressBarFill) {
           progressBarFill.style.width = `${this.currentProgress}%`;
       }
       
       if (progressCurrentTime) {
           progressCurrentTime.textContent = `${Math.round(this.currentProgress)}%`;
       }
       
       // Update status based on progress
       const currentProject = this.portfolioProjects[this.currentProjectIndex];
       const milestones = Object.keys(currentProject.milestones)
           .map(Number)
           .sort((a, b) => a - b);
       
       let currentStatus = currentProject.milestones[0];
       
       for (let milestone of milestones) {
           if (this.currentProgress >= milestone) {
               currentStatus = currentProject.milestones[milestone];
           }
       }
       
       if (projectStatus) {
           projectStatus.textContent = currentStatus;
       }
   }
   
   nextProject() {
       this.resetProgress();
       this.currentProjectIndex = (this.currentProjectIndex + 1) % this.portfolioProjects.length;
       this.updateProjectInfo();
       this.createMilestoneMarkers();
   }
   
   previousProject() {
       this.resetProgress();
       this.currentProjectIndex = (this.currentProjectIndex - 1 + this.portfolioProjects.length) % this.portfolioProjects.length;
       this.updateProjectInfo();
       this.createMilestoneMarkers();
   }
   
   updateProjectInfo() {
       const project = this.portfolioProjects[this.currentProjectIndex];
       
       // Update project info
       const titleElement = document.querySelector('.project-title');
       const thumbnailElement = document.querySelector('.project-thumbnail');
       
       if (titleElement) titleElement.textContent = project.title;
       if (thumbnailElement) thumbnailElement.src = project.thumbnail;
       if (projectStatus) projectStatus.textContent = project.milestones[0];
       
       // Reset progress
       this.resetProgress();
   }
}

// Initialize the enhanced progress player
if (projectProgressBar) {
   const enhancedPlayer = new EnhancedProgressPlayer();
}

function startProgress() {
    const targetProgress = portfolioProjects[currentProjectIndex].progress;
    let currentProgress = 0;
        
        const duration = 2000; // 2 seconds
        const intervalTime = 20;
        const steps = duration / intervalTime;
        const progressIncrement = targetProgress / steps;

        clearInterval(progressInterval);
        isPlaying = true;

        progressInterval = setInterval(() => {
            if (currentProgress < targetProgress) {
                currentProgress += progressIncrement;
                if (currentProgress > targetProgress) {
                    currentProgress = targetProgress;
                }
                
                if (progressBarFill) {
                    progressBarFill.style.width = `${currentProgress}%`;
                }
                if (progressCurrentTime) {
                    progressCurrentTime.textContent = `${Math.round(currentProgress)}%`;
                }
            } else {
                clearInterval(progressInterval);
                isPlaying = false;
                
                // Update play button icon
                const icon = playPauseBtn?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
        }, intervalTime);
    }

    // Initialize progress bar
    updateProgressBar(currentProjectIndex);

    // Play/Pause button event listener
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            const icon = playPauseBtn.querySelector('i');
            
            if (!isPlaying) {
                // Start playing
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                startProgress();
            } else {
                // Pause/Reset
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                clearInterval(progressInterval);
                isPlaying = false;
                resetProgressBar();
            }
        });
    }

    // Next project button
    if (nextProjectBtn) {
        nextProjectBtn.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex + 1) % portfolioProjects.length;
            updateProgressBar(currentProjectIndex);
        });
    }

    // Previous project button
    if (prevProjectBtn) {
        prevProjectBtn.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
            updateProgressBar(currentProjectIndex);
        });
    }

    // Touch event handling for better mobile experience
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        // Close mobile menu on swipe up if menu is open
        if (Math.abs(diff) > swipeThreshold && window.innerWidth <= 768) {
            if (sidebar.classList.contains('active') && diff > 0) {
                closeMobileMenu();
            }
        }
    }

    // Improved form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;
                
                // Reset button after 3 seconds (in case of success/error)
                setTimeout(() => {
                    submitBtn.textContent = 'SEND';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // Optimize scroll performance with throttling
    let scrollTimeout;
    const throttledScrollHandler = () => {
        if (scrollTimeout) {
            return;
        }
        
        scrollTimeout = setTimeout(() => {
            updateActiveLink();
            scrollTimeout = null;
        }, 16); // ~60fps
    };

    window.removeEventListener('scroll', updateActiveLink);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Add focus management for accessibility
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Skip to main content on Tab (accessibility)
        if (e.key === 'Tab' && e.target === mobileMenuBtn) {
            const firstSection = document.querySelector('#home');
            if (firstSection && window.innerWidth <= 768) {
                setTimeout(() => {
                    firstSection.focus();
                }, 100);
            }
        }
    });

    // Performance optimization: Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animations
    const animateElements = document.querySelectorAll('.section-card, .project-card, .timeline-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add loading states for better UX
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove any loading spinners or add fade-in effects
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.style.display = 'none';
        });
    });

    console.log('Portfolio initialized successfully! 🚀');
});