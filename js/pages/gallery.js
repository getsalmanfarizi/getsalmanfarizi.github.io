gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll(".panel");

gsap.to(".horizontal-wrapper", {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-section",
    pin: true,
    scrub: 1,
    end: () => "+=" + window.innerWidth * sections.length
  }
});

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".panel").forEach(panel => {

  gsap.to(panel, {
    scrollTrigger: {
      trigger: panel,
      start: "left center",
      end: "right center",
      scrub: true,
      horizontal: true,
    },
    "--ambient-opacity": 0.55
  });

  ScrollTrigger.create({
    trigger: panel,
    start: "left center",
    end: "right center",
    scrub: true,
    horizontal: true,
    onUpdate: self => {
      const progress = self.progress;

      panel.style.setProperty(
        "--ambient-alpha",
        Math.min(0.6, progress + 0.2)
      );

      panel.style.setProperty(
        "--ambient-scale",
        0.9 + progress * 0.25
      );
    }
  });
});