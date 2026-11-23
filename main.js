(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Building: windows that light up ---------- */
  const facade = document.getElementById('facade');
  const hero = document.querySelector('.hero');
  const COLS = 6, ROWS = 7;
  const windows = [];
  // small seeded random so the "lived-in" pattern looks natural but stable
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  for (let i = 0; i < COLS * ROWS; i++) {
    const w = document.createElement('span');
    w.className = 'w';
    const tone = rnd();
    w.dataset.tone = tone < 0.3 ? 'pale' : tone > 0.8 ? 'warm' : '';
    w.dataset.home = rnd() < 0.3 ? '1' : '';
    facade.appendChild(w);
    windows.push(w);
  }

  const lightOn = (w) => {
    w.classList.add('on');
    if (w.dataset.tone) w.classList.add(w.dataset.tone);
  };
  const lightOff = (w) => w.classList.remove('on', 'pale', 'warm');
  const timers = new WeakMap();

  const visit = (w) => {
    lightOn(w);
    if (w.dataset.home) return;
    clearTimeout(timers.get(w));
    timers.set(w, setTimeout(() => lightOff(w), 1600 + Math.random() * 1800));
  };

  // Rooftop sign, letter by letter, like a neon sign warming up
  const letters = [...document.querySelectorAll('#sign span')];
  const home = windows.filter((w) => w.dataset.home);

  if (reduce) {
    letters.forEach((l) => l.classList.add('on'));
    home.forEach(lightOn);
  } else {
    letters.forEach((l, i) => setTimeout(() => l.classList.add('on'), 350 + i * 130));
    const b = letters[4];
    setTimeout(() => b.classList.remove('on'), 1350);
    setTimeout(() => b.classList.add('on'), 1480);
    setTimeout(() => b.classList.remove('on'), 1560);
    setTimeout(() => b.classList.add('on'), 1700);
    home.forEach((w) => setTimeout(() => lightOn(w), 500 + Math.random() * 1900));
  }

  // Pointer lights nearby windows; touch lights where you tap
  const near = (x, y) => {
    for (const w of windows) {
      const r = w.getBoundingClientRect();
      if (!r.width) continue;
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      if (dx * dx + dy * dy < (r.width * 1.7) ** 2) visit(w);
    }
  };
  hero.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') near(e.clientX, e.clientY); });
  facade.addEventListener('pointerdown', (e) => near(e.clientX, e.clientY));
  facade.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (!w) return;
    w.dataset.home = w.dataset.home ? '' : '1';
    w.dataset.home ? lightOn(w) : lightOff(w);
  });

  /* ---------- Contact: a small skyline at night ---------- */
  const skyline = document.getElementById('skyline');
  const towers = [
    { tw: 120, th: 250, tc: 3 },
    { tw: 176, th: 410, tc: 4 },
    { tw: 110, th: 300, tc: 3 },
    { tw: 150, th: 350, tc: 4 },
  ];
  const sky = [];
  towers.forEach((t) => {
    const el = document.createElement('div');
    el.className = 'tower';
    el.style.setProperty('--tw', t.tw);
    el.style.setProperty('--th', t.th);
    el.style.setProperty('--tc', t.tc);
    const rows = Math.floor((t.th - 14) / ((t.tw - 24 - (t.tc - 1) * 8) / t.tc * 4 / 3 + 8));
    for (let i = 0; i < rows * t.tc; i++) {
      const w = document.createElement('span');
      w.className = 'sw';
      const tone = rnd();
      if (rnd() < 0.55) w.classList.add('on', tone < 0.3 ? 'pale' : tone > 0.8 ? 'warm' : 'x');
      el.appendChild(w);
      sky.push(w);
    }
    skyline.appendChild(el);
  });
  if (!reduce) {
    setInterval(() => {
      if (document.hidden) return;
      const w = sky[Math.floor(Math.random() * sky.length)];
      if (w.classList.contains('on')) w.classList.remove('on', 'pale', 'warm', 'x');
      else w.classList.add('on');
    }, 1400);
  }

  /* ---------- Stage: one window opens into the hotel video ---------- */
  const stage = document.getElementById('work');
  const frame = document.getElementById('windowFrame');
  const caption = document.getElementById('stageCaption');
  const lamp = document.getElementById('lamp');
  const video = document.getElementById('hotelVideo');

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  let inView = false;
  let opened = 0;

  const playIfOpen = () => {
    if (inView && (reduce || opened > 0.25)) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  };

  if (reduce) {
    video.controls = true;
    frame.style.setProperty('--ix', '0%');
    frame.style.setProperty('--iy', '0%');
  } else {
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = stage.getBoundingClientRect();
      const span = stage.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / (span || 1));
      opened = smooth(0.06, 0.7, p);
      frame.style.setProperty('--ix', (46 * (1 - opened)).toFixed(2) + '%');
      frame.style.setProperty('--iy', (40 * (1 - opened)).toFixed(2) + '%');
      frame.style.setProperty('--r', (4 + 8 * opened).toFixed(1) + 'px');
      lamp.style.setProperty('--lampo', (1 - smooth(0.18, 0.5, p)).toFixed(3));
      caption.style.setProperty('--cap', smooth(0.5, 0.78, p).toFixed(3));
      playIfOpen();
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    playIfOpen();
  }, { threshold: 0.15 }).observe(stage);
})();
