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
