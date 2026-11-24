import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.getElementById('toothStage');
const canvas = document.getElementById('tooth');
const tag = document.getElementById('implantTag');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

if (!webglOK()) {
  stage.classList.add('no-webgl');
} else {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 8;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 20 });
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2fd4a8, 0.5));

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.75;
  floor.receiveShadow = true;
  scene.add(floor);

  const enamel = new THREE.MeshPhysicalMaterial({ color: 0xfbf9f4, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15, sheen: 0.4, sheenColor: new THREE.Color(0xe9fff8) });
  const rootMat = new THREE.MeshPhysicalMaterial({ color: 0xf4efe6, roughness: 0.4, clearcoat: 0.6, transparent: true });
  const titanium = new THREE.MeshStandardMaterial({ color: 0xdfe6ec, metalness: 0.65, roughness: 0.28 });

  const tooth = new THREE.Group();
  scene.add(tooth);

  // crown: a soft box with four cusps on top
  const crown = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.05, 1.5, 6, 0.42), enamel);
  body.castShadow = true;
  crown.add(body);
  [[-0.42, -0.36], [0.42, -0.36], [-0.42, 0.36], [0.42, 0.36]].forEach(([x, z], i) => {
    const cusp = new THREE.Mesh(new THREE.SphereGeometry(0.43 + (i % 2) * 0.03, 32, 24), enamel);
    cusp.scale.set(1, 0.72, 1);
    cusp.position.set(x, 0.42, z);
    cusp.castShadow = true;
    crown.add(cusp);
  });
  crown.position.y = 0.35;
  tooth.add(crown);

  // two roots
  const roots = new THREE.Group();
  [-1, 1].forEach((s) => {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.1, 1.5, 32), rootMat);
    r.position.set(s * 0.5, -0.9, 0);
    r.rotation.z = s * 0.3;
    r.castShadow = true;
    roots.add(r);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), rootMat);
    tip.position.set(s * 0.72, -1.6, 0);
    roots.add(tip);
  });
  const neck = new THREE.Mesh(new RoundedBoxGeometry(1.45, 0.45, 1.25, 4, 0.2), rootMat);
  neck.position.y = -0.22;
  roots.add(neck);
  tooth.add(roots);

  // implant: abutment + threaded screw
  const implant = new THREE.Group();
  const abut = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.5, 6), titanium);
  abut.position.y = -0.05;
  implant.add(abut);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.18, 1.7, 32), titanium);
  core.position.y = -1.05;
  implant.add(core);
  const helix = new THREE.Curve();
  helix.getPoint = (t, target = new THREE.Vector3()) => {
    const a = t * Math.PI * 2 * 7;
    const r = 0.36 - t * 0.14;
    return target.set(Math.cos(a) * r, -0.25 - t * 1.6, Math.sin(a) * r);
  };
  const thread = new THREE.Mesh(new THREE.TubeGeometry(helix, 400, 0.045, 8, false), titanium);
  implant.add(thread);
  implant.traverse((o) => { o.castShadow = true; });
  implant.scale.setScalar(0.001);
  tooth.add(implant);

  /* sizing */
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const k = camera.aspect < 0.9 ? 1.25 : 1;
    camera.position.set(2.8 * k, 2.6 * k, 11 * k);
    camera.lookAt(0, -0.1, 0);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  /* open = crown lifts, roots fade, implant appears */
  let open = 0, target = 0, touched = false;
  const setOpen = (v) => { target = v ? 1 : 0; stage.classList.toggle('open', !!v); };
  stage.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { touched = true; setOpen(true); } });
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') setOpen(false); });
  stage.addEventListener('click', () => { touched = true; setOpen(target === 0); });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); touched = true; setOpen(target === 0); } });
  if (!reduce) {
    // until someone interacts, show both states in turn
    setInterval(() => { if (!touched) setOpen(target === 0); }, 3200);
  }

  let px = 0, py = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 2 - 1;
    py = ((e.clientY - r.top) / r.height) * 2 - 1;
  });

  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);
  const clock = new THREE.Clock();
  let t = 0;
  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (visible) {
      t += reduce ? 0 : dt;
      open += (target - open) * (reduce ? 1 : 0.08);
      const e = open * open * (3 - 2 * open);
      crown.position.y = 0.35 + e * 0.95;
      crown.rotation.z = e * 0.08;
      rootMat.opacity = 1 - e;
      roots.visible = rootMat.opacity > 0.02;
      implant.scale.setScalar(Math.max(0.001, e));
      tooth.rotation.y += ((t * 0.35 + px * 0.5) - tooth.rotation.y) * 0.05;
      tooth.rotation.x += ((py * 0.12) - tooth.rotation.x) * 0.05;
      tooth.position.y = Math.sin(t * 1.2) * 0.06;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  };
  tick();
  stage.classList.add('ready');
}
