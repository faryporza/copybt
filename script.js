function createSnowflakes() {
    const snowflakes = ['❅', '❆', '❄', '⛄', '🎄', '✧', '⭐', '🎀', '🦌', '🎁', '🧸', '💝', '🍪', '✿', '💮'];
    const body = document.querySelector('body');
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        snowflake.style.animationDelay = `${Math.random() * 2}s`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
        snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        body.appendChild(snowflake);
    }
}

let bgMusic = null;
let isPlaying = false;

function initMusicPlayer() {
    bgMusic = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playMusicBtn');
    const popup = document.getElementById('newsPopup');

    // Enable playing on iOS
    bgMusic.setAttribute('playsinline', '');
    bgMusic.setAttribute('webkit-playsinline', '');
    
    playBtn.addEventListener('click', () => {
        // Close popup first
        popup.style.display = 'none';

        if (isPlaying) {
            bgMusic.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i> เปิดเพลง';
            playBtn.classList.remove('playing');
        } else {
            // iOS requires user interaction
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i> หยุดเพลง';
                    playBtn.classList.add('playing');
                }).catch(error => {
                    console.log("Playback failed:", error);
                });
            }
        }
        isPlaying = !isPlaying;
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

function copyText(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;
    
    // Try the modern approach first
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showCopySuccess(elementId))
            .catch(() => fallbackCopyMethod(element, elementId));
    } else {
        // Fallback for older browsers or non-HTTPS
        fallbackCopyMethod(element, elementId);
    }
}

function fallbackCopyMethod(element, elementId) {
    try {
        // Create a temporary textarea
        const textArea = document.createElement('textarea');
        textArea.value = element.value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // Execute copy command
        document.execCommand('copy');
        textArea.remove();
        
        showCopySuccess(elementId);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Copy failed. Please try selecting and copying manually.');
    }
}

function showCopySuccess(elementId) {
    const button = elementId === 'password' ? 
        document.querySelector('.input-group:last-child button') : 
        document.getElementById(elementId).nextElementSibling;
    
    const originalText = button.innerText;
    button.innerText = '✨ Copied!';
    
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.innerText = originalText;
    }, 1500);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Popup functionality
window.onload = function() {
    createSnowflakes();
    initMusicPlayer();
    const popup = document.getElementById('newsPopup');
    const closeBtn = document.querySelector('.close-btn');

    // Show popup immediately
    popup.style.display = 'block';

    // Close popup when clicking the close button
    closeBtn.onclick = function() {
        popup.style.display = 'none';
    }

    // Close popup when clicking outside
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    }

    // Add click listeners for ripple effect
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}