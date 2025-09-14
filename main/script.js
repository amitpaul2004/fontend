// This function is called by the `onclick` in the HTML, so it stays here.
function toggleMenu() {
    document.getElementById("nav-links").classList.toggle("show");
}

// This event listener waits for the entire HTML page to be loaded and ready.
document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SHADOW ON SCROLL =====
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // ===== HERO SLIDESHOW =====
    const slidesWrapper = document.querySelector(".slides-wrapper");
    if (slidesWrapper) {
        let slideIndex = 0;
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".dot");

        function showSlides() {
            if (slides.length === 0) return;
            slideIndex++;
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            const offset = -slideIndex * 100;
            slidesWrapper.style.transform = `translateX(${offset}%)`;

            dots.forEach(dot => dot.classList.remove("active-dot"));
            if(dots[slideIndex]) {
                dots[slideIndex].classList.add("active-dot");
            }

            setTimeout(showSlides, 4000);
        }
        showSlides();
    }

    // ===== STAR ACHIEVERS SLIDER =====
    const slider = document.querySelector('.achievers-slider');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    if (slider && prevBtn && nextBtn) {
        let currentIndex = 0;

        function updateSliderPosition() {
            const card = slider.querySelector('.achiever-card');
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const gap = parseInt(window.getComputedStyle(slider).gap);
            const totalMove = cardWidth + gap;
            const cardsInView = Math.floor(slider.parentElement.offsetWidth / totalMove);
            const maxIndex = slider.children.length - cardsInView;

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

        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateSliderPosition();
        });
        
        updateSliderPosition();
    }

    // ===== CHATBOT =====
    const chatbotWidget = document.querySelector('.chatbot-widget');
    const chatWindow = document.querySelector('.chat-window');
    const closeChatBtn = document.querySelector('.close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const sendSound = document.getElementById('send-sound');

    if (chatbotWidget && chatWindow && closeChatBtn && chatBody && chatInput && sendBtn && sendSound) {
        let isAudioUnlocked = false;

        function unlockAudio() {
            if (isAudioUnlocked) return;
            sendSound.muted = false;
            const promise = sendSound.play();
            if (promise !== undefined) {
                promise.then(_ => {
                    sendSound.pause();
                    sendSound.currentTime = 0;
                }).catch(error => console.warn("Audio could not be unlocked automatically.", error));
            }
            isAudioUnlocked = true;
        }

        chatbotWidget.addEventListener('click', (e) => {
            e.preventDefault();
            unlockAudio();
            chatWindow.classList.toggle('show');
        });

        closeChatBtn.addEventListener('click', () => chatWindow.classList.remove('show'));

        function formatTime(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutes} ${ampm}`;
        }

        function addMessage(text, type, isTyping = false) {
            const timestamp = formatTime(new Date());
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', type);
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            const p = document.createElement('p');
            p.textContent = text;
            if (isTyping) {
                p.classList.add('typing-indicator');
            }
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
            return messageDiv;
        }

        function handleSendMessage() {
            const messageText = chatInput.value.trim();
            if (!messageText) return;

            addMessage(messageText, 'sent');
            chatInput.value = '';

            if (isAudioUnlocked) {
                sendSound.currentTime = 0;
                const playPromise = sendSound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.error("Could not play the sound:", error));
                }
            }

            const typingIndicator = addMessage("...", 'received', true);

            fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                typingIndicator.querySelector('p').textContent = data.reply;
                typingIndicator.querySelector('p').classList.remove('typing-indicator');
            })
            .catch(error => {
                console.error('Error connecting to chatbot server:', error);
                typingIndicator.querySelector('p').textContent = "Sorry, I'm having trouble connecting. Please try again later.";
                typingIndicator.querySelector('p').classList.remove('typing-indicator');
            });
        }

        sendBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSendMessage();
            }
        });
    }
});