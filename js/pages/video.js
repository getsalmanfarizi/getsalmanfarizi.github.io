(() => {
  /* ===============================
     SLIDE CORE
  =============================== */

  const slides = document.querySelectorAll(".fade-image");
  const currentEl = document.getElementById("current-slide");
  const totalEl = document.getElementById("total-slide");

  if (!slides.length || !currentEl || !totalEl) return;

  totalEl.textContent = slides.length;

  function updateSlideCount() {
    slides.forEach((slide, index) => {
      if (slide.classList.contains("active")) {
        currentEl.textContent = index + 1;
      }
    });
  }

  let currentIndex = 0;
  let touchStartY = 0;

  function updateImages(index) {
    const titleEl = document.getElementById("title");
    const descEl = document.getElementById("description");

    slides.forEach((img, i) => {
      img.classList.toggle("active", i === index);

      if (i === index) {
        if (titleEl) titleEl.textContent = img.dataset.title || "";
        if (descEl) descEl.textContent = img.dataset.desc || "";
      }
    });

    updateSlideCount();
  }

  /* ===============================
     DESKTOP SCROLL
  =============================== */

  function handleWheel(e) {
    const threshold = 100;

    if (e.deltaY > threshold) {
      currentIndex = Math.min(currentIndex + 1, slides.length - 1);
    } else if (e.deltaY < -threshold) {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateImages(currentIndex);
  }

  /* ===============================
     MOBILE SWIPE
  =============================== */

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const threshold = 50;

    if (deltaY > threshold) {
      currentIndex = Math.min(currentIndex + 1, slides.length - 1);
    } else if (deltaY < -threshold) {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateImages(currentIndex);
  }

  /* ===============================
     INIT
  =============================== */

  function initMedia() {
    const section = document.querySelector(".section");
    if (!section) return;

    document.body.classList.add("ready");

    currentIndex = 0;
    updateImages(currentIndex);

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMedia);
  } else {
    initMedia();
  }

  /* ===============================
     MOBILE IMAGE SWITCH
  =============================== */

  const MOBILE_WIDTH = 768;

  function handleMobileImages() {
    const isMobile = window.innerWidth <= MOBILE_WIDTH;

    slides.forEach(img => {
      if (!img.dataset.desktop) {
        img.dataset.desktop = img.src;
      }

      if (isMobile && img.dataset.mobile) {
        img.src = img.dataset.mobile;
      } else {
        img.src = img.dataset.desktop;
      }
    });
  }

  window.addEventListener("DOMContentLoaded", handleMobileImages);
  window.addEventListener("resize", handleMobileImages);

  /* ===============================
     VIDEO PLAYER
  =============================== */

  const playButton = document.querySelector(".btn-play-circle");
  const scrollContainer = document.querySelector(".scroll-container");
  const buttonHome = document.querySelector(".btn-back");
  const videoContainer = document.getElementById("video-player-container");

  if (!playButton || !videoContainer) return;

  playButton.addEventListener("click", () => {
    const activeImage = document.querySelector(".fade-image.active");
    if (!activeImage || !activeImage.dataset.video) return;

    const videoSrc = activeImage.dataset.video;

    slides.forEach(img => (img.style.display = "none"));
    playButton.style.display = "none";
    if (scrollContainer) scrollContainer.style.display = "none";
    if (buttonHome) buttonHome.style.display = "none";

    videoContainer.innerHTML = "";
    videoContainer.style.display = "flex";

    if (videoSrc.includes("youtube.com/embed")) {
      const iframe = document.createElement("iframe");

      iframe.src = videoSrc.includes("?")
        ? `${videoSrc}&autoplay=1&mute=1&playsinline=1`
        : `${videoSrc}?autoplay=1&mute=1&playsinline=1`;

      iframe.allow = "autoplay; encrypted-media";
      iframe.style.width = "100%";
      iframe.style.height = "100%";

      videoContainer.appendChild(iframe);
    } else {
      const videoEl = document.createElement("video");

      videoEl.src = videoSrc;
      videoEl.autoplay = true;
      videoEl.controls = true;
      videoEl.playsInline = true;
      videoEl.style.width = "100%";
      videoEl.style.height = "100%";

      videoContainer.appendChild(videoEl);

      const exitVideo = () => {
        videoContainer.style.display = "none";
        videoContainer.innerHTML = "";

        slides.forEach(img => (img.style.display = "block"));
        playButton.style.display = "flex";
        if (scrollContainer) scrollContainer.style.display = "flex";
        if (buttonHome) buttonHome.style.display = "flex";
      };

      videoEl.addEventListener("ended", exitVideo);
      videoEl.addEventListener("pause", exitVideo);
    }
  });
})();
