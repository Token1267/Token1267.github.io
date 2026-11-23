(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The hotel video plays only while it is on screen
  const video = document.getElementById('hotelVideo');
  if (video && !reduce) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (video.preload === 'none') video.preload = 'auto';
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.3 }).observe(video);
  }
})();
