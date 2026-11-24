import * as THREE from 'three';

const stage = document.getElementById('cezveStage');
const canvas = document.getElementById('cezve');
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  // a soft "room" for the copper to reflect
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x3a8c96);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), new THREE.MeshBasicMaterial({ color: 0xffe2b0 }));
  glow.position.set(-4, 5, 3); glow.lookAt(0, 0, 0); envScene.add(glow);
  const glow2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  glow2.position.set(5, 3, -2); glow2.lookAt(0, 0, 0); envScene.add(glow2);
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;

  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x0f6b78, 0.9));
  const sun = new THREE.DirectionalLight(0xffe7c4, 2.4);
  sun.position.set(-4, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 25 });
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const world = new THREE.Group();
  scene.add(world);

  // invisible floor that only catches shadows
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.22 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  world.add(floor);

  const copper = new THREE.MeshStandardMaterial({ color: 0xc8703a, metalness: 0.9, roughness: 0.32 });
  const copperDark = new THREE.MeshStandardMaterial({ color: 0x9a4f26, metalness: 0.85, roughness: 0.4 });

  // copper tray with hot sand
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.35, 0.55, 96, 1, true), copperDark);
  tray.position.y = 0.275; tray.castShadow = true; tray.receiveShadow = true;
  world.add(tray);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.06, 12, 96), copper);
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.55; world.add(rim);
  const trayBottom = new THREE.Mesh(new THREE.CircleGeometry(2.35, 64), copperDark);
  trayBottom.rotation.x = -Math.PI / 2; trayBottom.position.y = 0.01; world.add(trayBottom);

  const sandGeo = new THREE.CircleGeometry(2.52, 140, 0, Math.PI * 2);
  {
    const p = sandGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const r = Math.hypot(x, y);
      const n = Math.sin(x * 3.1) * Math.cos(y * 2.7) * 0.035 + Math.sin((x + y) * 7.3) * 0.012;
      p.setZ(i, (r < 2.45 ? n : 0) + (1 - Math.min(1, r / 2.52)) * 0.06);
    }
    sandGeo.computeVertexNormals();
  }
  const grain = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'); const img = g.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 200 + Math.random() * 55;
      img.data[i] = v; img.data[i + 1] = v * 0.93; img.data[i + 2] = v * 0.82; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const sand = new THREE.Mesh(sandGeo, new THREE.MeshStandardMaterial({ color: 0xd9a35a, map: grain, roughness: 1, metalness: 0 }));
  sand.rotation.x = -Math.PI / 2; sand.position.y = 0.46; sand.receiveShadow = true;
  world.add(sand);

  // the cezve: a lathe profile, foam inside, a long handle
  const profile = [
    [0.0, 0.0], [0.58, 0.0], [0.66, 0.05], [0.7, 0.22], [0.68, 0.5], [0.58, 0.82],
    [0.5, 1.0], [0.5, 1.08], [0.57, 1.18], [0.62, 1.22],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const cezve = new THREE.Group();
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), new THREE.MeshStandardMaterial({ color: 0xcd7640, metalness: 0.92, roughness: 0.28, side: THREE.DoubleSide }));
  body.castShadow = true; body.receiveShadow = true;
  cezve.add(body);
  const foam = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), new THREE.MeshStandardMaterial({ color: 0xb98454, roughness: 0.9 }));
  foam.rotation.x = -Math.PI / 2; foam.position.y = 0.96;
  cezve.add(foam);
  const lipSpout = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12, 0, Math.PI), copper);
  lipSpout.position.set(-0.6, 1.2, 0); lipSpout.rotation.set(0, Math.PI / 2, Math.PI / 2);
  cezve.add(lipSpout);
  const handle = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.5, 12), copper);
  bar.rotation.z = Math.PI / 2; bar.position.x = 0.75; bar.castShadow = true;
  handle.add(bar);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0x3a2416, roughness: 0.6 }));
  grip.rotation.z = Math.PI / 2; grip.position.x = 1.65; grip.castShadow = true;
  handle.add(grip);
  handle.position.set(0.62, 1.0, 0);
  handle.rotation.z = 0.38;
  cezve.add(handle);
  cezve.scale.setScalar(0.95);
  world.add(cezve);

  // a small cup on a saucer next to the tray
  const cup = new THREE.Group();
  const porcelain = new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 0.25 });
  const cupProfile = [[0, 0], [0.24, 0], [0.27, 0.04], [0.33, 0.28], [0.36, 0.48], [0.34, 0.5]].map(([x, y]) => new THREE.Vector2(x, y));
  const cupBody = new THREE.Mesh(new THREE.LatheGeometry(cupProfile, 48), new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 0.25, side: THREE.DoubleSide }));
  cupBody.position.y = 0.06; cupBody.castShadow = true; cup.add(cupBody);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.34, 0.07, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0x0f6b78, roughness: 0.3, side: THREE.DoubleSide }));
  band.position.y = 0.43; cup.add(band);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.33, 32), new THREE.MeshStandardMaterial({ color: 0x6b3f22, roughness: 0.7 }));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.49; cup.add(coffee);
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.48, 0.06, 48), porcelain);
  saucer.position.y = 0.03; saucer.castShadow = true; saucer.receiveShadow = true; cup.add(saucer);
  const lokum = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.2), new THREE.MeshStandardMaterial({ color: 0xf7b6c6, roughness: 0.8 }));
  lokum.position.set(0.42, 0.14, 0.12); lokum.rotation.y = 0.5; lokum.castShadow = true; cup.add(lokum);
  cup.position.set(2.75, 0, 1.6);
  world.add(cup);

  // steam: soft particles rising from the cezve
  const N = 90;
  const sGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), alpha = new Float32Array(N), size = new Float32Array(N);
  const life = new Float32Array(N), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) { life[i] = Math.random(); seed[i] = Math.random() * 10; size[i] = 1; }
  sGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  sGeo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
  sGeo.setAttribute('size', new THREE.BufferAttribute(size, 1));
  const sMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { scale: { value: 300 } },
    vertexShader: `attribute float alpha; attribute float size; varying float vA; uniform float scale;
      void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA; gl_FragColor = vec4(1.0, 0.98, 0.95, a * 0.5); }`,
  });
  const steam = new THREE.Points(sGeo, sMat);
  world.add(steam);

  /* sizing */
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const k = camera.aspect < 0.9 ? 1.4 : camera.aspect < 1.2 ? 1.05 : 0.86;
    camera.position.set(4.8 * k, 5.4 * k, 8.6 * k);
    camera.lookAt(0.5, 0.7, 0.3);
    camera.updateProjectionMatrix();
    sMat.uniforms.scale.value = h * 0.55;
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  let px = 0, py = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 2 - 1;
    py = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  stage.addEventListener('pointerleave', () => { px = 0; py = 0; });

  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);
  const clock = new THREE.Clock();
  let t = 0;
  const mouth = new THREE.Vector3();

  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (visible) {
      t += reduce ? 0 : dt;
      // the barista moves the cezve slowly through the sand
      const a = t * 0.45;
      cezve.position.set(Math.cos(a) * 0.95 - 0.2, 0.2 + Math.sin(a * 2) * 0.03, Math.sin(a) * 0.55);
      cezve.rotation.y = -0.6 + Math.sin(a) * 0.25;
      // foam slowly rises to the rim and settles again
      const rise = 0.5 + 0.5 * Math.sin(t * 0.6);
      foam.position.y = 0.9 + rise * 0.2;
      foam.scale.setScalar(0.92 + rise * 0.08);

      world.rotation.y += ((-0.15 + px * 0.35) - world.rotation.y) * 0.05;
      world.rotation.x += ((py * 0.06) - world.rotation.x) * 0.05;

      cezve.updateMatrixWorld();
      mouth.set(0, 1.25, 0); cezve.localToWorld(mouth); world.worldToLocal(mouth);
      for (let i = 0; i < N; i++) {
        life[i] += dt * (0.22 + (seed[i] % 1) * 0.12);
        if (life[i] > 1) { life[i] = 0; seed[i] = Math.random() * 10; }
        const L = life[i];
        const sway = Math.sin(t * 1.3 + seed[i]) * 0.25 * L;
        pos[i * 3] = mouth.x + sway + Math.sin(seed[i] * 3) * 0.12;
        pos[i * 3 + 1] = mouth.y + L * 2.4;
        pos[i * 3 + 2] = mouth.z + Math.cos(seed[i] * 5) * 0.12 + L * 0.2;
        alpha[i] = Math.sin(Math.PI * L) * (0.22 + rise * 0.3);
        size[i] = 0.9 + L * 2.6;
      }
      sGeo.attributes.position.needsUpdate = true;
      sGeo.attributes.alpha.needsUpdate = true;
      sGeo.attributes.size.needsUpdate = true;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  };
  tick();
  stage.classList.add('ready');
}
