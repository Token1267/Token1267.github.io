(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // small seeded random so the patterns look natural but stay the same on every visit
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  /* ---------- Building: every window is somebody's business ---------- */
  const businesses = [
    'Coffee shop', 'Dental clinic', 'Barbershop', 'Bakery', 'Law office', 'Yoga studio',
    'Car service', 'Flower shop', 'Language school', 'Architecture studio', 'Online store', 'Real estate agency',
    'Beauty salon', 'Kitchen maker', 'Gym', 'Photo studio', 'Travel agency', 'Pet grooming',
    'Accountant', 'Tailor', 'Music school', 'Interior designer', 'Pharmacy', 'Hotel',
    'Coworking', 'Kids club', 'Wedding planner', 'Printing house', 'Physiotherapy', 'Tea house',
    'Bike repair', 'Jewellery workshop', 'Startup', 'Cleaning service', 'Driving school', 'Ceramics studio',
    'Restaurant', 'Optician', 'Bookshop', 'Moving company', 'Psychologist', 'Furniture shop',
  ];
  const facade = document.getElementById('facade');
  const lobby = document.getElementById('lobby');
  const hero = document.querySelector('.hero');
  const COLS = 6, ROWS = 7;
  const windows = [];

  for (let i = 0; i < COLS * ROWS; i++) {
    const w = document.createElement('span');
    w.className = 'w';
    const tone = rnd();
    w.dataset.tone = tone < 0.3 ? 'pale' : tone > 0.8 ? 'warm' : '';
    w.dataset.home = rnd() < 0.3 ? '1' : '';
    w.dataset.floor = ROWS - Math.floor(i / COLS) + 1;
    w.dataset.biz = businesses[i % businesses.length];
    facade.appendChild(w);
    windows.push(w);
  }

  const lightOn = (w) => {
    w.classList.add('on');
    if (w.dataset.tone) w.classList.add(w.dataset.tone);
  };
  const lightOff = (w) => w.classList.remove('on', 'pale', 'warm');
  const timers = new WeakMap();

  let lastBiz = null;
  const announce = (w) => {
    if (w === lastBiz) return;
    lastBiz = w;
    lobby.textContent = `Floor ${w.dataset.floor}: ${w.dataset.biz}`;
  };

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

  // Pointer lights nearby windows and names the closest business; touch does the same where you tap
  const near = (x, y) => {
    let closest = null, best = Infinity;
    for (const w of windows) {
      const r = w.getBoundingClientRect();
      if (!r.width) continue;
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const d = dx * dx + dy * dy;
      if (d < (r.width * 1.7) ** 2) visit(w);
      if (d < best && Math.abs(dx) < r.width && Math.abs(dy) < r.height) { best = d; closest = w; }
    }
    if (closest) announce(closest);
  };
  hero.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') near(e.clientX, e.clientY); });
  facade.addEventListener('pointerdown', (e) => near(e.clientX, e.clientY));
  facade.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (!w) return;
    w.dataset.home = w.dataset.home ? '' : '1';
    w.dataset.home ? lightOn(w) : lightOff(w);
    announce(w);
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
    const winW = (t.tw - 24 - (t.tc - 1) * 8) / t.tc;
    const rows = Math.floor((t.th - 14) / (winW * 4 / 3 + 8));
    for (let i = 0; i < rows * t.tc; i++) {
      const w = document.createElement('span');
      w.className = 'sw';
      const tone = rnd();
      if (rnd() < 0.55) {
        w.classList.add('on');
        if (tone < 0.3) w.classList.add('pale'); else if (tone > 0.8) w.classList.add('warm');
      }
      el.appendChild(w);
      sky.push(w);
    }
    skyline.appendChild(el);
  });
  if (!reduce) {
    setInterval(() => {
      if (document.hidden) return;
      const w = sky[Math.floor(Math.random() * sky.length)];
      if (w.classList.contains('on')) w.classList.remove('on', 'pale', 'warm');
      else w.classList.add('on');
    }, 1400);
  }

  /* ---------- Hotel video plays only while it is on screen ---------- */
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
