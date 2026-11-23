import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('street');
const stageEl = document.getElementById('streetStage');
const label = document.getElementById('streetLabel');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

async function start() {
  if (!webglOK()) { stageEl.classList.add('no-webgl'); return; }
  try { await document.fonts.load('800 80px Archivo'); } catch (e) { /* system font is fine */ }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xdde4ff, 0xffe0c2, 1.5));
  const sun = new THREE.DirectionalLight(0xfff1de, 2.6);
  sun.position.set(-6, 11, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  const world = new THREE.Group();
  scene.add(world);

  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0, ...extra });
  const rbox = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));
  const put = (parent, geo, m, x = 0, y = 0, z = 0, shadow = true) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = shadow;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };

  const tex = (draw, w = 512, h = 128) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };
  const signTex = (text, bg, fg) => tex((g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg;
    g.font = '800 74px Archivo, "Arial Black", sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + 4);
  });
  const stripeTex = (a, b) => tex((g, w, h) => {
    const n = 8;
    for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect((w / n) * i, 0, w / n, h); }
  }, 256, 64);

  // Base: a rounded block of city with a road and a pavement
  put(world, rbox(13.4, 0.7, 7.8, 0.3), mat(0xF2F3F9), 0, -0.35, 0, false);
  put(world, rbox(13.4, 0.06, 2.1, 0.03), mat(0x3A3F5E, { roughness: 0.95 }), 0, 0.03, 2.65, false);
  for (let x = -6.1; x <= 6.2; x += 1.25) put(world, new THREE.BoxGeometry(0.55, 0.02, 0.07), mat(0xffffff), x, 0.075, 2.65, false);
  put(world, rbox(13.4, 0.12, 1.5, 0.04), mat(0xDADFEC), 0, 0.06, 0.92, false);

  const glass = mat(0x2B3152, { roughness: 0.25, metalness: 0.2 });
  const lit = new THREE.MeshStandardMaterial({ color: 0xFFE5A3, emissive: 0xFFC163, emissiveIntensity: 0.85, roughness: 0.5 });
  const doorMat = mat(0x232842, { roughness: 0.4 });

  const shops = [
    { name: 'Café', info: 'menu, table booking, delivery', w: 2.0, h: 1.9, d: 2.3, color: 0xFF8B66, sign: 'CAFÉ', sbg: '#21264A', sfg: '#FFFFFF', awning: ['#FF8B66', '#FFF4EC'] },
    { name: 'Clinic', info: 'services, prices, online booking', w: 1.8, h: 2.7, d: 2.4, color: 0xC9F0E1, sign: '+ CLINIC', sbg: '#17A673', sfg: '#FFFFFF' },
    { name: 'Hotel', info: 'rooms, dates, direct booking', w: 2.1, h: 3.7, d: 2.6, color: 0x9EB1FF, sign: 'HOTEL', sbg: '#21264A', sfg: '#FFD66B', litShare: 0.55 },
    { name: 'Bakery', info: 'catalogue, pre-orders, pickup times', w: 1.7, h: 1.6, d: 2.1, color: 0xFFD76E, sign: 'BAKERY', sbg: '#FFFFFF', sfg: '#E0507E', awning: ['#FF9DBF', '#FFFFFF'] },
    { name: 'Gym', info: 'class schedule, trainers, memberships', w: 1.9, h: 2.2, d: 2.4, color: 0x2D3254, sign: 'GYM', sbg: '#C8F25A', sfg: '#1B1F38' },
    { name: 'Shop', info: 'products, cart, delivery', w: 1.75, h: 1.9, d: 2.2, color: 0xFFAACB, sign: 'SHOP', sbg: '#21264A', sfg: '#FFFFFF', awning: ['#3D4BF2', '#FFFFFF'] },
  ];

  const gap = 0.16;
  const total = shops.reduce((s, b) => s + b.w, 0) + gap * (shops.length - 1);
  let cursor = -total / 2;
  const frontZ = 0.2;
  const buildings = [];
  let rand = 3;
  const rnd = () => { rand = (rand * 16807) % 2147483647; return (rand - 1) / 2147483646; };

  shops.forEach((b) => {
    const g = new THREE.Group();
    g.position.x = cursor + b.w / 2;
    cursor += b.w + gap;
    g.userData = { name: b.name, info: b.info, h: b.h, lift: 0 };

    put(g, rbox(b.w, b.h, b.d, 0.07), mat(b.color), 0, b.h / 2, frontZ - b.d / 2);
    // roof parapet and a small unit on top
    put(g, rbox(b.w + 0.06, 0.1, b.d + 0.06, 0.04), mat(new THREE.Color(b.color).multiplyScalar(0.88)), 0, b.h + 0.03, frontZ - b.d / 2);
    put(g, rbox(0.42, 0.24, 0.36, 0.05), mat(0xE7EAF3), (rnd() - 0.5) * (b.w - 0.6), b.h + 0.18, frontZ - b.d / 2 - 0.2);

    // upper floors: windows
    const cols = Math.max(2, Math.floor((b.w - 0.25) / 0.46));
    const rows = Math.max(1, Math.floor((b.h - 1.35) / 0.56));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -((cols - 1) * 0.46) / 2 + c * 0.46;
        const y = 1.45 + r * 0.56 + 0.18;
        put(g, new THREE.BoxGeometry(0.28, 0.34, 0.05), rnd() < (b.litShare || 0.3) ? lit : glass, x, y, frontZ + 0.01, false);
      }
    }
    // ground floor: shop window and door
    put(g, new THREE.BoxGeometry(b.w * 0.5, 0.55, 0.05), lit, -b.w * 0.16, 0.48, frontZ + 0.01, false);
    put(g, new THREE.BoxGeometry(0.36, 0.72, 0.05), doorMat, b.w * 0.3, 0.5, frontZ + 0.01, false);
    // sign board
    const sign = put(g, new THREE.BoxGeometry(b.w * 0.82, 0.26, 0.06), [
      mat(b.sbg), mat(b.sbg), mat(b.sbg), mat(b.sbg),
      new THREE.MeshStandardMaterial({ map: signTex(b.sign, b.sbg, b.sfg), roughness: 0.6 }), mat(b.sbg),
    ], 0, 1.08, frontZ + 0.05);
    sign.castShadow = true;
    // striped awning
    if (b.awning) {
      const aw = put(g, new THREE.BoxGeometry(b.w * 0.86, 0.05, 0.45), new THREE.MeshStandardMaterial({ map: stripeTex(b.awning[0], b.awning[1]), roughness: 0.7 }), 0, 0.86, frontZ + 0.24);
      aw.rotation.x = 0.32;
    }
    world.add(g);
    buildings.push(g);
  });

  // trees and street lamps on the pavement
  const trunk = mat(0x8C6B4F);
  const leaves = [mat(0x5CC487, { flatShading: true }), mat(0x47AE72, { flatShading: true })];
  const tree = (x, z, s = 1) => {
    const t = new THREE.Group();
    put(t, new THREE.CylinderGeometry(0.05, 0.06, 0.5, 8), trunk, 0, 0.35, 0);
    put(t, new THREE.IcosahedronGeometry(0.34 * s, 0), leaves[Math.round(rnd())], 0, 0.78, 0);
    t.position.set(x, 0, z);
    world.add(t);
  };
  const lampHead = new THREE.MeshStandardMaterial({ color: 0xFFE7B0, emissive: 0xFFCF7A, emissiveIntensity: 1.1 });
  const lamp = (x, z) => {
    put(world, new THREE.CylinderGeometry(0.03, 0.035, 1.15, 8), mat(0x2B3152), x, 0.68, z);
    put(world, new THREE.SphereGeometry(0.08, 16, 12), lampHead, x, 1.28, z);
  };
  [-5.6, -2.5, 0.9, 4.2].forEach((x, i) => tree(x, 1.25, i % 2 ? 1.1 : 0.95));
  [-4.1, -0.8, 2.6, 5.8].forEach((x) => lamp(x, 1.5));

  // two little cars, one per lane
  const car = (color, z, dir) => {
    const c = new THREE.Group();
    put(c, rbox(0.92, 0.28, 0.46, 0.1), mat(color, { roughness: 0.4 }), 0, 0.27, 0);
    put(c, rbox(0.5, 0.24, 0.42, 0.09), mat(0xF4F6FF, { roughness: 0.2 }), -0.05 * dir, 0.5, 0);
    const wheel = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 14);
    [[-0.28, 0.22], [0.28, 0.22], [-0.28, -0.22], [0.28, -0.22]].forEach(([x, wz]) => {
      const w = put(c, wheel, mat(0x1B1F38), x, 0.12, wz, false);
      w.rotation.x = Math.PI / 2;
    });
    c.position.set(dir > 0 ? -4 : 3, 0.03, z);
    c.rotation.y = dir > 0 ? 0 : Math.PI;
    c.userData = { dir, speed: 1.1 + rnd() * 0.4 };
    world.add(c);
    return c;
  };
  const cars = [car(0xFF5C6C, 2.32, 1), car(0x3D4BF2, 3.0, -1)];

  /* ---------- sizing ---------- */
  const resize = () => {
    const w = stageEl.clientWidth, h = stageEl.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const far = camera.aspect < 0.8 ? 1.95 : camera.aspect < 1 ? 1.6 : camera.aspect < 1.3 ? 1.08 : 0.9;
    camera.fov = camera.aspect < 1 ? 30 : 26;
    camera.position.set(8.4 * far, 8.6 * far, 15 * far);
    camera.lookAt(camera.aspect < 1 ? 0 : 0.7, 0.9, 0.3);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stageEl);
  resize();

  /* ---------- pointer: tilt the street, lift the building under the cursor ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(9, 9);
  let px = 0, py = 0, hovered = null;
  const pick = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(buildings, true)[0];
    let g = hit ? hit.object : null;
    while (g && !buildings.includes(g)) g = g.parent;
    hovered = g;
    canvas.style.cursor = g ? 'pointer' : '';
  };
  stageEl.addEventListener('pointermove', (e) => {
    const r = stageEl.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 2 - 1;
    py = ((e.clientY - r.top) / r.height) * 2 - 1;
    pick(e.clientX, e.clientY);
  });
  stageEl.addEventListener('pointerleave', () => { hovered = null; px = 0; py = 0; });
  stageEl.addEventListener('pointerdown', (e) => pick(e.clientX, e.clientY));

  const tmp = new THREE.Vector3();
  const showLabel = () => {
    if (!hovered) { label.classList.remove('show'); return; }
    tmp.set(0, hovered.userData.h + 0.55, 0);
    hovered.localToWorld(tmp);
    tmp.project(camera);
    const x = (tmp.x * 0.5 + 0.5) * stageEl.clientWidth;
    const y = (-tmp.y * 0.5 + 0.5) * stageEl.clientHeight;
    label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    if (label.dataset.name !== hovered.userData.name) {
      label.dataset.name = hovered.userData.name;
      label.innerHTML = `<strong>${hovered.userData.name}</strong><span>${hovered.userData.info}</span>`;
    }
    label.classList.add('show');
  };

  /* ---------- loop ---------- */
  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(stageEl);
  const clock = new THREE.Clock();
  let t = 0;
  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (visible) {
      t += dt;
      const sway = reduce ? 0 : Math.sin(t * 0.25) * 0.06;
      world.rotation.y += ((-0.12 + sway + px * 0.22) - world.rotation.y) * 0.06;
      world.rotation.x += ((py * 0.05) - world.rotation.x) * 0.06;
      buildings.forEach((b) => {
        const target = b === hovered ? 0.32 : 0;
        b.userData.lift += (target - b.userData.lift) * 0.14;
        b.position.y = b.userData.lift;
      });
      if (!reduce) {
        cars.forEach((c) => {
          c.position.x += c.userData.dir * c.userData.speed * dt;
          if (c.position.x > 6.3) c.position.x = -6.3;
          if (c.position.x < -6.3) c.position.x = 6.3;
          const edge = Math.min(1, (6.3 - Math.abs(c.position.x)) / 0.5);
          c.scale.setScalar(Math.max(0.001, edge));
        });
      }
      renderer.render(scene, camera);
      showLabel();
    }
    requestAnimationFrame(tick);
  };
  tick();
  stageEl.classList.add('ready');
}

start();
