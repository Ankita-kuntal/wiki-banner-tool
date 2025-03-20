// Get DOM elements
const banner = document.getElementById('main-banner');
const bannerTitle = document.getElementById('banner-title');
const bannerParagraph = document.querySelector('.banner-text p');
const hobbyImage = document.getElementById('hobby-img');
const titleInput = document.getElementById('title-input');
const hobbySelect = document.getElementById('hobby-select');
const applyButton = document.getElementById('apply-button');
const themeOptions = document.querySelectorAll('.theme-option');

// Hobby content
const hobbies = {
    all: {
        text: "When life feels boring, I turn to my three favorite creative activities. Coding helps me create digital things, dancing lets me express myself through music, and sketching captures special moments. Each hobby gives me a way to express feelings that words can't.",
        image: "./download (6).jpeg"
    },
    coding: {
        text: "Coding is where logic meets creativity. I love building websites, apps, and solving problems through programming. Each line of code is a step toward creating something meaningful.",
        image: "./Coding.jpeg"
    },
    dancing: {
        text: "Dancing allows me to express myself through movement and music. Whether it's freestyle or choreographed, dance helps me release stress and connect with my emotions.",
        image: "./00f496a7-5c19-4eea-a5ac-0d9da3f2cfb7.jpeg"
    },
    sketching: {
        text: "Sketching lets me capture moments and ideas visually. With just a pencil and paper, I can create worlds, preserve memories, and share my perspective with others.",
        image: "./dark academia.jpeg"
    }
};

// Theme colors (gradients)
const themeColors = {
    purple: "linear-gradient(135deg, #6b46c1 0%, #805ad5 50%, #9f7aea 100%)",
    green: "linear-gradient(135deg, #2f855a 0%, #38a169 50%, #48bb78 100%)",
    orange: "linear-gradient(135deg, #c05621 0%, #dd6b20 50%, #ed8936 100%)",
    blue: "linear-gradient(135deg, #2b6cb0 0%, #4299e1 50%, #63b3ed 100%)"
};

// Store selected theme
let selectedTheme = "purple";

// Add event listeners for theme options
themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all options
        themeOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        this.classList.add('selected');
        
        // Store the selected theme
        selectedTheme = this.dataset.color;
    });
});

// Apply changes when button is clicked
applyButton.addEventListener('click', function() {
    // Update title if provided
    if (titleInput.value.trim() !== '') {
        bannerTitle.textContent = titleInput.value;
    }
    
    // Update content based on selected hobby
    const selectedHobby = hobbySelect.value;
    bannerParagraph.textContent = hobbies[selectedHobby].text;
    
    // Update image
    hobbyImage.src = hobbies[selectedHobby].image;
    hobbyImage.alt = selectedHobby + " hobby image";
    
    // Update banner color theme
    banner.style.backgroundImage = themeColors[selectedTheme];
});