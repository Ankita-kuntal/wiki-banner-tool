// Get DOM elements
const banner = document.getElementById('main-banner');
const bannerContent = document.querySelector('.banner-content');
const bannerTitle = document.getElementById('banner-title');
const bannerParagraph = document.getElementById('banner-description');
const hobbyImage = document.getElementById('hobby-img');
const titleInput = document.getElementById('title-input');
const hobbySelect = document.getElementById('hobby-select');
const applyButton = document.getElementById('apply-button');
const resetButton = document.getElementById('reset-button');
const themeOptions = document.querySelectorAll('.theme-option');
const notification = document.getElementById('notification');
const bannerForm = document.getElementById('banner-form');

// Store original values for reset functionality
const originalState = {
    title: bannerTitle.textContent.trim(),
    text: bannerParagraph.textContent.trim(),
    image: hobbyImage.src,
    imageAlt: hobbyImage.alt,
    theme: "purple"
};

// Hobby content
const hobbies = {
    all: {
        text: "When life feels boring, I turn to my three favorite creative activities. Coding helps me create digital things, dancing lets me express myself through music, and sketching captures special moments. Each hobby gives me a way to express feelings that words can't.",
        image: "./download (6).jpeg",
        alt: "All creative hobbies - coding, dancing, and sketching"
    },
    coding: {
        text: "Coding is where logic meets creativity. I love building websites, apps, and solving problems through programming. Each line of code is a step toward creating something meaningful.",
        image: "./Coding.jpeg",
        alt: "Person coding on a computer"
    },
    dancing: {
        text: "Dancing allows me to express myself through movement and music. Whether it's freestyle or choreographed, dance helps me release stress and connect with my emotions.",
        image: "./00f496a7-5c19-4eea-a5ac-0d9da3f2cfb7.jpeg",
        alt: "Person dancing expressively"
    },
    sketching: {
        text: "Sketching lets me capture moments and ideas visually. With just a pencil and paper, I can create worlds, preserve memories, and share my perspective with others.",
        image: "./dark academia.jpeg",
        alt: "Sketching and art supplies"
    }
};

// Theme colors (gradients) with contrast ratios that meet WCAG AAA guidelines
const themeColors = {
    purple: "linear-gradient(135deg, #6b46c1 0%, #805ad5 50%, #9f7aea 100%)",
    green: "linear-gradient(135deg, #2f855a 0%, #38a169 50%, #48bb78 100%)",
    orange: "linear-gradient(135deg, #c05621 0%, #dd6b20 50%, #ed8936 100%)",
    blue: "linear-gradient(135deg, #2b6cb0 0%, #4299e1 50%, #63b3ed 100%)"
};

// Store selected theme
let selectedTheme = "purple";
let lastInteractionTime = Date.now();
const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

// Initialize the page - making it more robust for different loading scenarios
function initializePage() {
    // Set initial state
    resetBanner(false); // Reset without animation
    
    // Check for saved preferences in localStorage if possible
    try {
        const savedTheme = localStorage.getItem('preferredTheme');
        if (savedTheme && themeColors[savedTheme]) {
            selectedTheme = savedTheme;
            updateSelectedThemeUI(savedTheme);
            banner.style.backgroundImage = themeColors[savedTheme];
        }
    } catch (e) {
        // Local storage not available or error
        console.warn("Could not access localStorage", e);
    }
    
    // Announce page load complete for screen readers
    showNotification("Page loaded successfully. You can now customize the banner.", true);
    
    // Start session timeout checker
    startSessionTimeoutChecker();
}

// Update which theme option is visually selected
function updateSelectedThemeUI(themeColor) {
    themeOptions.forEach(opt => {
        const isSelected = opt.dataset.color === themeColor;
        opt.classList.toggle('selected', isSelected);
        opt.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
}

// Keyboard accessibility for theme options
themeOptions.forEach(option => {
    option.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectTheme(this);
        }
        // Left/Right/Up/Down arrow navigation between theme options
        else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            navigateThemeOptions(e.key, this);
        }
    });
});

// Navigate between theme options with keyboard
function navigateThemeOptions(key, currentOption) {
    const currentIndex = Array.from(themeOptions).indexOf(currentOption);
    let nextIndex;
    
    // Calculate next index based on arrow key
    if (key === 'ArrowRight' || key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % themeOptions.length;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + themeOptions.length) % themeOptions.length;
    }
    
    // Focus and select next option
    themeOptions[nextIndex].focus();
    selectTheme(themeOptions[nextIndex]);
}

// Add event listeners for theme options
themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        selectTheme(this);
    });
});

function selectTheme(themeOption) {
    // Remove selected class and update aria-checked from all options
    themeOptions.forEach(opt => {
        opt.classList.remove('selected');
        opt.setAttribute('aria-checked', 'false');
    });
    
    // Add selected class and update aria-checked to clicked option
    themeOption.classList.add('selected');
    themeOption.setAttribute('aria-checked', 'true');
    
    // Store the selected theme
    selectedTheme = themeOption.dataset.color;
    
    // Try to save preference
    try {
        localStorage.setItem('preferredTheme', selectedTheme);
    } catch (e) {
        console.warn("Could not save theme preference", e);
    }
    
    // Update last interaction time for session timeout
    updateLastInteraction();
}

// Function to show notification
function showNotification(message, isSimple = false) {
    notification.textContent = message;
    notification.classList.add('show');
    
    if (!isSimple) {
        // Simulate a loader for visual feedback
        let dots = "";
        let count = 0;
        const originalMessage = message;
        
        const interval = setInterval(() => {
            count++;
            dots = ".".repeat(count % 4);
            notification.textContent = originalMessage + dots;
            
            if (count >= 5) {
                clearInterval(interval);
                notification.textContent = originalMessage + " Done!";
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 1000);
            }
        }, 300);
    } else {
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Apply changes when form is submitted
bannerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    applyChanges();
});

// Apply changes when button is clicked
applyButton.addEventListener('click', applyChanges);

function applyChanges(animate = true) {
    // Validate input
    let titleValue = titleInput.value.trim();
    if (titleValue.length > 50) {
        showNotification("Title is too long. Maximum 50 characters allowed.", true);
        titleInput.focus();
        return;
    }
    
    // Fade out content if animation is enabled
    if (animate) {
        bannerContent.classList.add('fade');
    }
    
    // Use setTimeout to ensure proper animation sequence
    setTimeout(() => {
        // Update title if provided
        if (titleValue !== '') {
            bannerTitle.textContent = titleValue;
        }
        
        // Update content based on selected hobby
        const selectedHobby = hobbySelect.value;
        bannerParagraph.textContent = hobbies[selectedHobby].text;
        
        // Update image with alt text
        hobbyImage.src = hobbies[selectedHobby].image;
        hobbyImage.alt = hobbies[selectedHobby].alt;
        
        // Update banner color theme
        banner.style.backgroundImage = themeColors[selectedTheme];
        
        // Update last interaction time for session timeout
        updateLastInteraction();
        
        // Fade in content if animation is enabled
        if (animate) {
            bannerContent.classList.remove('fade');
            bannerContent.classList.add('fade-in');
            
            // Show notification
            showNotification('Updating banner');
            
            // Remove fade-in class after animation completes
            setTimeout(() => {
                bannerContent.classList.remove('fade-in');
            }, 800);
        }
    }, animate ? 300 : 0);
}

// Reset button functionality
resetButton.addEventListener('click', function() {
    resetBanner(true);
});

// Reset with keyboard (for accessibility)
resetButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        resetBanner(true);
    }
});

function resetBanner(animate = true) {
    // Fade out content if animation is enabled
    if (animate) {
        bannerContent.classList.add('fade');
    }
    
    setTimeout(() => {
        // Reset to original values
        bannerTitle.textContent = originalState.title;
        bannerParagraph.textContent = originalState.text;
        hobbyImage.src = originalState.image;
        hobbyImage.alt = originalState.imageAlt;
        banner.style.backgroundImage = themeColors[originalState.theme];
        
        // Reset form elements
        titleInput.value = '';
        hobbySelect.value = 'all';
        
        // Reset theme selection
        updateSelectedThemeUI(originalState.theme);
        selectedTheme = originalState.theme;
        
        // Update last interaction time for session timeout
        updateLastInteraction();
        
        // Try to save preference
        try {
            localStorage.setItem('preferredTheme', selectedTheme);
        } catch (e) {
            console.warn("Could not save theme preference", e);
        }
        
        // Fade in content if animation is enabled
        if (animate) {
            bannerContent.classList.remove('fade');
            bannerContent.classList.add('fade-in');
            
            // Show notification
            showNotification('Banner reset to default');
            
            // Remove fade-in class after animation completes
            setTimeout(() => {
                bannerContent.classList.remove('fade-in');
            }, 800);
        }
    }, animate ? 300 : 0);
}

// Track user interaction
function updateLastInteraction() {
    lastInteractionTime = Date.now();
}

// Session timeout checker
function startSessionTimeoutChecker() {
    // Add event listeners to track user interaction
    document.addEventListener('click', updateLastInteraction);
    document.addEventListener('keypress', updateLastInteraction);
    document.addEventListener('mousemove', updateLastInteraction);
    document.addEventListener('touchstart', updateLastInteraction);
    
    // Check session timeout every minute
    setInterval(() => {
        const currentTime = Date.now();
        const inactiveTime = currentTime - lastInteractionTime;
        
        // If user has been inactive for session timeout period, reset the banner
        if (inactiveTime >= sessionTimeout) {
            showNotification("Session timeout due to inactivity. Resetting banner to default.", true);
            resetBanner(true);
            lastInteractionTime = currentTime; // Reset timer
        }
    }, 60000); // Check every minute
}

// Call initialize on page load
window.addEventListener('DOMContentLoaded', initializePage);

// Add accessibility enhancements for screen readers
document.addEventListener('DOMContentLoaded', function() {
    // Focus trap for modal dialogs (if added later)
    const handleFocusTrap = function(e) {
        if (e.key === 'Tab' && document.querySelector('.modal.active')) {
            const modal = document.querySelector('.modal.active');
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };
    
    document.addEventListener('keydown', handleFocusTrap);
});