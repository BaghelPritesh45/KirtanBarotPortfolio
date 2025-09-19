const navlinks = document.querySelector(".sm-navlinks");
const menuBtn = document.querySelector("#menu-btn"); // icon button

function onToggleMenu(e) {
  // toggle icon
  e.name = e.name === "menu-outline" ? "close-outline" : "menu-outline";

  // toggle menu
  navlinks.classList.toggle("right-[0%]");

  if (navlinks.classList.contains("right-[0%]")) {
    // add listeners when menu is open
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", closeMenuOnScroll);

    // ✅ nav link click close
    document.querySelectorAll(".sm-navlinks a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  } else {
    removeListeners();
  }
}

function closeMenu() {
  navlinks.classList.remove("right-[0%]");
  menuBtn.name = "menu-outline"; // reset icon
  removeListeners();
}

function handleOutsideClick(event) {
  if (!navlinks.contains(event.target) && !menuBtn.contains(event.target)) {
    closeMenu();
  }
}

function closeMenuOnScroll() {
  closeMenu();
}

function removeListeners() {
  document.removeEventListener("click", handleOutsideClick);
  window.removeEventListener("scroll", closeMenuOnScroll);

  // remove link listeners
  document.querySelectorAll(".sm-navlinks a").forEach((link) => {
    link.removeEventListener("click", closeMenu);
  });
}
//FORM SUBMIT CODE WITH EMAILJS

// Initialize EmailJS
(function() {
  emailjs.init("71xZzaWtT-bkFuReY"); // Replace with your EmailJS public key
})();

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");
const spinner = document.getElementById("spinner");

// Add active style class on click
submitBtn.addEventListener("click", () => {
  submitBtn.classList.add("btn-active");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Show spinner + disable button
  btnText.textContent = "Sending...";
  spinner.classList.remove("hidden");
  submitBtn.disabled = true;
  submitBtn.classList.remove("btn-active"); // Remove any previous active state

  // Get form data
  const formData = {
    from_name: document.getElementById("name").value.trim(),
    from_email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
    to_name: "Kirtan Barot" // Your name
  };

  // Basic validation
  if (!formData.from_name || !formData.from_email || !formData.message) {
    // Show error state
    btnText.innerHTML = '<div class="flex justify-center items-center"><ion-icon name="alert-circle" class="text-red-500 mr-2 text-lg sm:text-xl"></ion-icon>Please fill all fields</div>';
    spinner.classList.add("hidden");
    submitBtn.disabled = false;
    return;
  }

  try {
    // Send email using EmailJS
    const response = await emailjs.send(
      "service_i5393fi", // Replace with your EmailJS service ID
      "template_235nneq", // Replace with your EmailJS template ID
      formData
    );

    if (response.status === 200) {
      // Show success state with tick icon
      btnText.innerHTML = '<div class="flex justify-center items-center"><ion-icon name="checkmark-circle" class="text-green-500 mr-2 text-lg sm:text-xl"></ion-icon>Sent!</div>';
      submitBtn.classList.add("btn-active");
      submitBtn.disabled = true;
      spinner.classList.add("hidden");

      form.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        btnText.textContent = "Send Message";
        submitBtn.disabled = false;
        submitBtn.classList.remove("btn-active");
      }, 3000);
    } else {
      // Show error state
      btnText.innerHTML = '<div class="flex justify-center items-center"><ion-icon name="close-circle" class="text-red-500 mr-2 text-lg sm:text-xl"></ion-icon>Try Again</div>';
      spinner.classList.add("hidden");
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-active");
    }
  } catch (error) {
    console.error("EmailJS Error:", error);
    // Show error state
    btnText.innerHTML = '<div class="flex justify-center items-center"><ion-icon name="close-circle" class="text-red-500 mr-2 text-lg sm:text-xl"></ion-icon>Try Again</div>';
    spinner.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.classList.remove("btn-active");
  }
});

// WORK SLIDER
// Universal Card Slider Class
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("work-track");
  if (!track) return;

  const viewport = track.parentElement; // overflow-hidden container
  const items = Array.from(track.children);
  const prevBtn = document.getElementById("work-prev");
  const nextBtn = document.getElementById("work-next");
  const prevBtnM = document.getElementById("work-prev-m");
  const nextBtnM = document.getElementById("work-next-m");

  let currentIndex = 0; // index of the first visible card in the current view

  function slidesPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2;  // md
    return 1; // sm
  }

  function slideTo(index) {
    const spv = slidesPerView();
    const slideWidth = viewport.clientWidth / spv; // each item width in current layout
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function goNext() {
    const spv = slidesPerView();
    const maxStart = Math.max(0, items.length - spv);
    currentIndex = currentIndex + 1;
    if (currentIndex > maxStart) currentIndex = 0; // loop to first
    slideTo(currentIndex);
  }

  function goPrev() {
    const spv = slidesPerView();
    const maxStart = Math.max(0, items.length - spv);
    currentIndex = currentIndex - 1;
    if (currentIndex < 0) currentIndex = maxStart; // loop to last valid start
    slideTo(currentIndex);
  }

  [nextBtn, nextBtnM].forEach((btn) => btn && btn.addEventListener("click", goNext));
  [prevBtn, prevBtnM].forEach((btn) => btn && btn.addEventListener("click", goPrev));

  // Touch/Swipe functionality
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isHorizontalSwipe = false;
  const minSwipeDistance = 50; // Minimum distance for a swipe

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isHorizontalSwipe = false;
  }

  function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;
    
    const currentX = e.changedTouches[0].screenX;
    const currentY = e.changedTouches[0].screenY;
    
    const deltaX = Math.abs(currentX - touchStartX);
    const deltaY = Math.abs(currentY - touchStartY);
    
    // Determine if this is a horizontal swipe
    if (deltaX > deltaY && deltaX > 10) {
      isHorizontalSwipe = true;
      // Only prevent default for horizontal swipes
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    // Only handle swipe if it was determined to be horizontal
    if (isHorizontalSwipe) {
      handleSwipe();
    }
    
    // Reset values
    touchStartX = 0;
    touchStartY = 0;
    isHorizontalSwipe = false;
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right - go to previous slide
        goPrev();
      } else {
        // Swipe left - go to next slide
        goNext();
      }
    }
  }

  // Add touch event listeners to the viewport
  viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
  viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
  viewport.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Recalculate on resize to keep alignment
  window.addEventListener("resize", () => {
    // Clamp index if needed when changing spv
    const spv = slidesPerView();
    const maxStart = Math.max(0, items.length - spv);
    if (currentIndex > maxStart) currentIndex = maxStart;
    slideTo(currentIndex);
  });

  // Initial position
  slideTo(0);
});