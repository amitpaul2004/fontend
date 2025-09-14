function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("show");
}

// Navbar shadow on scroll
window.addEventListener("scroll", function() {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===== SLIDESHOW =====
let slideIndex = 0;
const slidesWrapper = document.querySelector(".slides-wrapper");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlides() {
  slideIndex++;
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  }
  const offset = -slideIndex * 100; // move left
  slidesWrapper.style.transform = `translateX(${offset}%)`;

  dots.forEach(dot => dot.classList.remove("active-dot"));
  dots[slideIndex].classList.add("active-dot");

  setTimeout(showSlides, 4000);
}

showSlides();

// ===== STAR ACHIEVERS SLIDER =====
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.achievers-slider');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  
  if (!slider) return;

  let currentIndex = 0;

  function updateSliderPosition() {
    const card = slider.querySelector('.achiever-card');
    const cardWidth = card.offsetWidth;
    const gap = parseInt(window.getComputedStyle(slider).gap);
    const totalMove = cardWidth + gap;
    const maxIndex = slider.children.length - Math.floor(slider.parentElement.offsetWidth / totalMove);

    if (currentIndex < 0) {
      currentIndex = 0;
    }
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    
    slider.style.transform = `translateX(-${currentIndex * totalMove}px)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateSliderPosition();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex--;
    updateSliderPosition();
  });

  // Optional: Recalculate on window resize
  window.addEventListener('resize', () => {
    currentIndex = 0; // Reset slider on resize
    updateSliderPosition();
  });

  // Initial position update
  updateSliderPosition();
});

//chatbot window


document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTION ---
    const chatbotWidget = document.querySelector('.chatbot-widget');
    const chatWindow = document.querySelector('.chat-window');
    const closeChatBtn = document.querySelector('.close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const sendSound = document.getElementById('send-sound');

    // Check if all essential elements exist
    if (!chatbotWidget || !chatWindow || !closeChatBtn || !chatBody || !chatInput || !sendBtn || !sendSound) {
        console.error("Chatbot element(s) not found. Please check your HTML.");
        return;
    }

    // --- AUDIO UNLOCK & VISIBILITY ---
    let isAudioUnlocked = false;

    // This function unlocks the audio context after the first user click
    function unlockAudio() {
        if (isAudioUnlocked) return;
        
        sendSound.muted = false; // Unmute the audio element
        const promise = sendSound.play();
        
        if (promise !== undefined) {
            promise.then(_ => {
                sendSound.pause();
                sendSound.currentTime = 0;
            }).catch(error => {
                console.warn("Audio could not be unlocked automatically.", error);
            });
        }
        isAudioUnlocked = true;
    }

    chatbotWidget.addEventListener('click', (e) => {
        e.preventDefault();
        unlockAudio(); // Unlock audio on the first interaction
        chatWindow.classList.toggle('show');
    });

    closeChatBtn.addEventListener('click', () => chatWindow.classList.remove('show'));

    // --- CHAT FUNCTIONALITY ---
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    function addMessage(text, type) {
        const timestamp = formatTime(new Date());
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        const p = document.createElement('p');
        p.textContent = text;
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('timestamp');
        timeSpan.textContent = timestamp;

        messageContent.appendChild(p);
        messageContent.appendChild(timeSpan);

        if (type === 'received') {
            const avatar = document.createElement('div');
            avatar.classList.add('bot-avatar');
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
            messageDiv.appendChild(avatar);
        }

        messageDiv.appendChild(messageContent);
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            addMessage(messageText, 'sent');
            chatInput.value = '';

            // --- ROBUST PLAY COMMAND ---
            if (isAudioUnlocked) {
                sendSound.currentTime = 0;
                const playPromise = sendSound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Could not play the sound:", error);
                    });
                }
            }

            setTimeout(() => {
                addMessage("Thanks for your message! An agent will be with you shortly.", 'received');
            }, 1000);
        }
    }

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    });
});