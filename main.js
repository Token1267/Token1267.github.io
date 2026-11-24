(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Project videos play only while they are on screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (v.preload === 'none') v.preload = 'auto';
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('video.autoplay').forEach((v) => io.observe(v));
})();
