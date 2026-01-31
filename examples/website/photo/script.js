document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const photoCards = document.querySelectorAll('.photo-card');
    
    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter photo cards
            filterPhotos(filter);
        });
    });
    
    function filterPhotos(category) {
        photoCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                // Show card with animation
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.6s ease-out';
                }, 50);
            } else {
                // Hide card
                card.classList.add('hidden');
            }
        });
    }
    
    // Add smooth scrolling behavior for better UX
    function smoothScrollToGallery() {
        const gallery = document.querySelector('.gallery');
        if (gallery) {
            gallery.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Add intersection observer for scroll animations
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
    
    // Observe photo cards for scroll animations
    photoCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add lazy loading simulation for better performance
    function simulateLazyLoading() {
        const images = document.querySelectorAll('.photo-placeholder');
        
        images.forEach((img, index) => {
            setTimeout(() => {
                img.style.filter = 'brightness(1)';
                img.style.transition = 'filter 0.3s ease';
            }, index * 100);
        });
    }
    
    // Initialize lazy loading
    setTimeout(simulateLazyLoading, 500);
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeButton = document.querySelector('.nav-btn.active');
            const buttons = Array.from(navButtons);
            const currentIndex = buttons.indexOf(activeButton);
            
            let nextIndex;
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            } else {
                nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }
            
            buttons[nextIndex].click();
            buttons[nextIndex].focus();
        }
    });
    
    // Add touch gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const activeButton = document.querySelector('.nav-btn.active');
            const buttons = Array.from(navButtons);
            const currentIndex = buttons.indexOf(activeButton);
            
            let nextIndex;
            if (diff > 0) {
                // Swipe left - next category
                nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            } else {
                // Swipe right - previous category
                nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            }
            
            buttons[nextIndex].click();
        }
    }
    
    // Add loading animation
    function showLoadingComplete() {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }
    
    // Initialize page
    document.body.style.opacity = '0';
    setTimeout(showLoadingComplete, 100);
});

// Add some utility functions for potential future enhancements
const PhotoGallery = {
    // Function to add new photos dynamically
    addPhoto: function(category, title, description) {
        const gallery = document.querySelector('.gallery');
        const newCard = document.createElement('div');
        newCard.className = 'photo-card';
        newCard.setAttribute('data-category', category);
        
        newCard.innerHTML = `
            <div class="photo-placeholder new-photo">
                <div class="photo-overlay">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        gallery.appendChild(newCard);
        
        // Add animation
        newCard.style.opacity = '0';
        newCard.style.transform = 'translateY(30px)';
        setTimeout(() => {
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';
            newCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, 100);
    },
    
    // Function to change theme colors dynamically
    changeTheme: function(newColors) {
        document.documentElement.style.setProperty('--primary-color', newColors.primary);
        document.documentElement.style.setProperty('--secondary-color', newColors.secondary);
        document.documentElement.style.setProperty('--accent-color', newColors.accent);
    }
};

// Make it available globally
window.PhotoGallery = PhotoGallery;
