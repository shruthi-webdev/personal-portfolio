document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('section');
    const mobileMenuToggle = document.createElement('button');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content'); // Get main content area

    mobileMenuToggle.classList.add('mobile-menu-toggle');
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i> Menu';
    document.body.prepend(mobileMenuToggle); // Add button to the top of the body

    // --- Smooth Scrolling for Navigation Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calculate offset considering fixed elements (like the player bar)
                const playerHeight = document.querySelector('.project-progress-bar')?.offsetHeight || 0;
                let offset = targetSection.offsetTop;

                // If the target section is 'home', scroll to very top
                if (targetId === 'home') {
                    offset = 0;
                } else {
                    // For other sections, leave some space above it so it's not hidden by player
                    // This is a common adjustment for fixed headers/footers
                    offset = targetSection.offsetTop - 50; // Adjust 50px as needed for visual spacing
                    if (offset < 0) offset = 0; // Don't scroll to negative values
                }

                // Smooth scroll
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('shifted'); // Remove shift when closing
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i> Menu'; // Reset icon
                }
            }
        });
    });

    // --- Highlight Active Section in Sidebar on Scroll ---
    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Check if the top of the section is in view or slightly above
            // Adjust 150px here based on your visual preference and player height
            if (pageYOffset >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Menu Toggle Functionality ---
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted'); // Shift main content when sidebar is active
        if (sidebar.classList.contains('active')) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i> Close'; // Change icon to 'X'
        } else {
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i> Menu'; // Change back to bars
        }
    });

    // --- Project category filtering (Now uses data-attributes for robustness) ---
    const categoryTags = document.querySelectorAll('.category-tag');
    const projectCards = document.querySelectorAll('.project-card');

    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            categoryTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            this.classList.add('active');

            const filter = this.dataset.filter; // Get filter from data-filter attribute

            projectCards.forEach(card => {
                const cardCategories = card.dataset.categories ? card.dataset.categories.split(' ') : []; // Get categories from data-categories

                if (filter === 'all' || cardCategories.includes(filter)) {
                    card.style.display = 'flex'; // Use flex for column layout
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    // Set initial active state for 'All' category
    document.querySelector('.category-tag[data-filter="all"]').click();


    // --- Project Progress Bar Interaction & "My Work" Integration ---
    const currentProjectTitle = document.querySelector('.project-title');
    const currentProjectStatus = document.querySelector('.project-status');
    const projectThumbnail = document.querySelector('.project-thumbnail');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const progressCurrentTime = document.querySelector('.progress-time.current-time');
    const nextProjectBtn = document.querySelector('.control-btn .fa-forward').closest('button');
    const prevProjectBtn = document.querySelector('.control-btn .fa-backward').closest('button');
    const playPauseBtn = document.querySelector('.play-pause-btn');

    // Define your projects here with 'targetId' and 'simulatedEndProgress'
    const portfolioProjects = [
        {
            title: 'Expense Tracker App',
            status: 'Starting: Backend Setup',
            thumbnail: 'https://i.postimg.cc/pd4TRsmQ/Aprenda-a-organizar-suas-finan-as.jpg',
            targetId: 'project-expense-tracker', // Matches ID in index.html
            simulatedEndProgress: 40 // New property: stop at 40%
        },
        {
            title: 'My Dream Sports Academy',
            status: 'Phase 2: Product Catalog & Search',
            thumbnail: 'https://i.postimg.cc/RFwM9459/Many-different-sport-balls-dark-background-stock-image.jpg',
            targetId: 'project-sports-academy', // Matches ID in index.html
            simulatedEndProgress: 60 // New property: stop at 60%
        },
        {
            title: 'Personal Portfolio Refactor',
            status: 'Ongoing: UI/UX Improvements',
            thumbnail: 'https://i.postimg.cc/fRFZ9JMD/portfolio.jpg',
            targetId: 'project-portfolio-website', // Matches ID in index.html
            simulatedEndProgress: 60 // New property: stop at 60%
        },
    ];

    let currentProjectIndex = 0;
    let progressInterval;
    let highlightTimeout;

    function updateProgressBar(index) {
        const project = portfolioProjects[index];
        if (project) {
            currentProjectTitle.textContent = project.title;
            currentProjectStatus.textContent = project.status;
            projectThumbnail.src = project.thumbnail;

            // Reset play/pause button when changing project
            const icon = playPauseBtn.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');

            // Ensure highlight is removed from any previously highlighted project
            const highlightedProject = document.querySelector('.project-card.highlight');
            if (highlightedProject) {
                highlightedProject.classList.remove('highlight');
            }
            clearTimeout(highlightTimeout); // Clear any pending highlight removal
            clearInterval(progressInterval); // Stop any ongoing progress animation
            progressBarFill.style.width = `0%`; // Reset visual progress
            progressCurrentTime.textContent = `0%`;
            progressCurrentTime.style.left = `0px`; // Reset position of current time text to the start
        }
    }

    // Initialize with the first project
    updateProgressBar(currentProjectIndex);

    nextProjectBtn.addEventListener('click', () => {
        currentProjectIndex = (currentProjectIndex + 1) % portfolioProjects.length;
        updateProgressBar(currentProjectIndex);
    });

    prevProjectBtn.addEventListener('click', () => {
        currentProjectIndex = (currentProjectIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
        updateProgressBar(currentProjectIndex);
    });

    // Play/Pause Functionality (UPDATED FOR "MY WORK" INTEGRATION)
    playPauseBtn.addEventListener('click', () => {
        const icon = playPauseBtn.querySelector('i');
        const currentProject = portfolioProjects[currentProjectIndex];

        // Get the target project card in "My Work" section using its ID
        const targetProjectCard = document.getElementById(currentProject.targetId);

        if (icon.classList.contains('fa-play')) {
            // Change to pause icon
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');

            if (targetProjectCard) {
                // Scroll to the project card, centering it in the viewport
                targetProjectCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Add highlight class
                targetProjectCard.classList.add('highlight');

                // Set a timeout to remove the highlight after a few seconds
                clearTimeout(highlightTimeout); // Clear any previous highlight timeout
                highlightTimeout = setTimeout(() => {
                    targetProjectCard.classList.remove('highlight');
                    // Reset play button icon after highlight is removed
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                    clearInterval(progressInterval); // Stop simulated progress
                    progressBarFill.style.width = `0%`;
                    progressCurrentTime.textContent = `0%`;
                    progressCurrentTime.style.left = `0px`; // Reset position of current time text
                }, 5000); // Highlight for 5 seconds (adjust duration as needed)
            }

            // --- Simulate Progress Bar (Visual feedback for "playing") ---
            let currentProgress = 0;
            progressBarFill.style.width = `0%`;
            progressCurrentTime.textContent = `0%`;
            progressCurrentTime.style.left = `0px`; // Initialize position

            clearInterval(progressInterval); // Clear any existing interval

            const targetProgress = currentProject.simulatedEndProgress; // Get the target percentage for THIS project
            const duration = 5000; // 5 seconds (5000 milliseconds) for the full animation
            const intervalTime = 50; // Update every 50ms

            progressInterval = setInterval(() => {
                // Calculate how much to increment to reach targetProgress in 5 seconds
                currentProgress += (targetProgress / (duration / intervalTime));

                if (currentProgress <= targetProgress) { // Stop at targetProgress
                    progressBarFill.style.width = `${currentProgress}%`;
                    progressCurrentTime.textContent = `${Math.round(currentProgress)}%`;

                    // Update the position of the current time text and dot
                    const progressBarLineWidth = progressBarFill.parentElement.offsetWidth;
                    let currentProgressPx = (currentProgress / 100) * progressBarLineWidth;
                    // Clamp the position to ensure it stays within the bar's width
                    currentProgressPx = Math.min(Math.max(0, currentProgressPx), progressBarLineWidth);

                    progressCurrentTime.style.left = `${currentProgressPx}px`;

                } else {
                    // Ensure it exactly reaches the target progress visually and numerically
                    progressBarFill.style.width = `${targetProgress}%`;
                    progressCurrentTime.textContent = `${targetProgress}%`;
                    const progressBarLineWidth = progressBarFill.parentElement.offsetWidth;
                    progressCurrentTime.style.left = `${(targetProgress / 100) * progressBarLineWidth}px`;

                    clearInterval(progressInterval); // Stop the interval
                }
            }, intervalTime);

        } else {
            // Change to play icon (Pause action)
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            clearInterval(progressInterval); // Stop the progress animation
            progressBarFill.style.width = `0%`; // Reset visual progress
            progressCurrentTime.textContent = `0%`;
            progressCurrentTime.style.left = `0px`; // Reset position

            // Remove highlight if currently active
            const highlightedProject = document.querySelector('.project-card.highlight');
            if (highlightedProject) {
                highlightedProject.classList.remove('highlight');
            }
            clearTimeout(highlightTimeout); // Clear the timeout if user pauses manually
        }
    });
});