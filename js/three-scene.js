/* ==========================================================================
   BASMA AHED — three-scene.js
   Procedural 3D construction city rendered with Three.js r128.
   Exposes window.OmranScene = { init, setProgress(0..1), setMouse(x,y), ready }
   ========================================================================== */

(function () {
  'use strict';

  const OmranScene = {
    ready: false,
    _progress: 0,
    _mouse: { x: 0, y: 0 },
  };
  window.OmranScene = OmranScene;

  let renderer, scene, camera, clock;
  let cranes = [];
  let trucks = [];
  let workers = [];
  let growingTowers = [];
  let excavatorArm;
  let dustPoints, birdGroup, cloudGroup;
  let sunLight;
  let width, height;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;

  /* ---------------------------------------------------------------------
     Palette (mirrors CSS custom properties)
     --------------------------------------------------------------------- */
  const COLORS = {
    black: 0x08090a,
    concrete: 0x8b8d8a,
    concreteDark: 0x3d3f3d,
    white: 0xf4f4f1,
    orange: 0xf7931e,
    glass: 0x9fd7e8,
    glassDark: 0x36414a,
  };

  // World position of the company sign, mounted on the front face of the
  // tower at (10, -30). Tower is BoxGeometry(w=11) centered at z=-30, so its
  // front face sits at z=-24.5 — the sign group must sit at a z greater than
  // that (clear of the opaque box) or its backing/plate render inside the
  // tower body and disappear, leaving only the lamp fixtures visible.
  // The hero camera orbits around this point.
  const SIGN_POS = { x: 10, y: 27, z: -24.2 };

  function smoothstep(x, minVal, maxVal) {
    const t = Math.min(Math.max((x - minVal) / (maxVal - minVal), 0), 1);
    return t * t * (3 - 2 * t);
  }

  /* ---------------------------------------------------------------------
     Camera path — one waypoint per "district" (position + lookAt).
     District 0 = hero (sky, high above city), progressing down/in.
     --------------------------------------------------------------------- */
  const PATH = [
    { pos: [15, 58, 120], look: [0, 28, -30] },    // 0 arrival — close enough to read buildings & cranes clearly
    { pos: [70, 60, 150], look: [10, 20, 0] },     // 1 about — descending
    { pos: [-50, 44, 100], look: [-20, 26, 40] },  // 2 leadership — approaching HQ tower
    { pos: [-90, 34, 70], look: [-10, 24, -20] },  // 3 projects — among towers
    { pos: [40, 22, -10], look: [0, 20, -60] },    // 4 services — crane district
    { pos: [-30, 46, -90], look: [10, 10, -160] }, // 5 stats — wide overview
    { pos: [0, 18, -170], look: [0, 24, -260] },   // 6 contact — arriving at HQ tower
  ];

  function catmullPoints(arr) {
    return new THREE.CatmullRomCurve3(arr.map(p => new THREE.Vector3(p[0], p[1], p[2])));
  }
  const posCurve = catmullPoints(PATH.map(p => p.pos));
  const lookCurve = catmullPoints(PATH.map(p => p.look));

  /* ---------------------------------------------------------------------
     Procedural textures (no external image assets)
     --------------------------------------------------------------------- */
  function makeSoftCircleTexture(color) {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function makeCloudTexture() {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    for (let i = 0; i < 7; i++) {
      const x = size / 2 + (Math.random() - 0.5) * size * 0.5;
      const y = size / 2 + (Math.random() - 0.5) * size * 0.25;
      const r = size * (0.18 + Math.random() * 0.16);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  /* ---------------------------------------------------------------------
     Builders
     --------------------------------------------------------------------- */
  function buildGround() {
    const group = new THREE.Group();

    const groundGeo = new THREE.PlaneGeometry(1400, 1400, 1, 1);
    const groundMat = new THREE.MeshStandardMaterial({ color: COLORS.black, roughness: 1, metalness: 0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    group.add(ground);

    // Road grid — thin emissive-ish lines using a plane with canvas texture
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = roadCanvas.height = 1024;
    const rctx = roadCanvas.getContext('2d');
    rctx.fillStyle = '#111312';
    rctx.fillRect(0, 0, 1024, 1024);
    rctx.strokeStyle = 'rgba(244,244,241,0.14)';
    rctx.lineWidth = 3;
    for (let i = 0; i <= 1024; i += 128) {
      rctx.beginPath(); rctx.moveTo(i, 0); rctx.lineTo(i, 1024); rctx.stroke();
      rctx.beginPath(); rctx.moveTo(0, i); rctx.lineTo(1024, i); rctx.stroke();
    }
    rctx.strokeStyle = 'rgba(247,147,30,0.35)';
    rctx.lineWidth = 1.5;
    rctx.setLineDash([14, 18]);
    for (let i = 64; i <= 1024; i += 128) {
      rctx.beginPath(); rctx.moveTo(i, 0); rctx.lineTo(i, 1024); rctx.stroke();
    }
    const roadTex = new THREE.CanvasTexture(roadCanvas);
    roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(6, 6);
    const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.9, metalness: 0.05 });
    const roadPlane = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), roadMat);
    roadPlane.rotation.x = -Math.PI / 2;
    roadPlane.position.y = -0.48;
    roadPlane.receiveShadow = true;
    group.add(roadPlane);

    return group;
  }

  function makeSignTexture() {
    const w = 1400, h = 525;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#111213';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(247,147,30,0.9)';
    ctx.lineWidth = 14;
    ctx.strokeRect(19, 19, w - 38, h - 38);
    ctx.fillStyle = '#f7931e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 191px Arial, sans-serif';
    ctx.fillText('BASMA AHED', w / 2, h / 2 - 25);
    ctx.fillStyle = 'rgba(244,244,241,0.85)';
    ctx.font = '400 57px Arial, sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('GENERAL CONTRACTING', w / 2, h / 2 + 126);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  function buildCompanySign(x, y, z) {
    const group = new THREE.Group();

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(10.6, 4.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0c0d0e, roughness: 0.6, metalness: 0.2 })
    );
    group.add(backing);

    const signMat = new THREE.MeshBasicMaterial({ map: makeSignTexture() });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(10.2, 3.8), signMat);
    sign.position.z = 0.11;
    group.add(sign);

    // Spotlight fixtures mounted below the sign, angled up to light it.
    // Higher-segment geometry + a dark edge outline keep the arms/heads
    // reading as crisp, distinct shapes rather than a low-poly blob.
    const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.65 });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55 });

    [-3.5, 0, 3.5].forEach((fx) => {
      const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.74, 14);
      const arm = new THREE.Mesh(armGeo, fixtureMat);
      arm.position.set(fx, -2.48, 0.56);
      arm.rotation.x = -0.75;
      group.add(arm);
      const armEdges = new THREE.LineSegments(new THREE.EdgesGeometry(armGeo, 20), edgeMat);
      armEdges.position.copy(arm.position);
      armEdges.rotation.copy(arm.rotation);
      group.add(armEdges);

      const headGeo = new THREE.ConeGeometry(0.2, 0.43, 18);
      const head = new THREE.Mesh(headGeo, fixtureMat);
      head.position.set(fx, -2.81, 0.83);
      head.rotation.x = Math.PI / 2.3;
      group.add(head);
      const headEdges = new THREE.LineSegments(new THREE.EdgesGeometry(headGeo, 20), edgeMat);
      headEdges.position.copy(head.position);
      headEdges.rotation.copy(head.rotation);
      group.add(headEdges);

      // Mounting collar where the arm meets the wall, for a cleaner joint
      const collarGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 14);
      const collar = new THREE.Mesh(collarGeo, fixtureMat);
      collar.position.set(fx, -2.15, 0.32);
      collar.rotation.x = Math.PI / 2;
      group.add(collar);

      const spot = new THREE.SpotLight(0xffddb0, 2.6, 18, Math.PI / 6, 0.45, 1.3);
      spot.position.set(fx, -2.75, 0.94);
      spot.target.position.set(fx * 0.35, 0.34, 0.38);
      group.add(spot, spot.target);
    });

    group.position.set(x, y, z);
    return group;
  }

  // Cached facade textures (built once, cloned per-tower so each can set its
  // own repeat without affecting the others).
  let _brickTex = null;
  function getBrickTexture() {
    if (_brickTex) return _brickTex;
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#a8a196'; // mortar
    ctx.fillRect(0, 0, size, size);
    const brickW = 64, brickH = 30, mortar = 4;
    let row = 0;
    for (let y = 0; y < size; y += brickH + mortar) {
      const offset = row % 2 === 0 ? 0 : -brickW / 2;
      for (let x = offset - brickW; x < size + brickW; x += brickW + mortar) {
        const shade = 0.85 + Math.random() * 0.3;
        const r = Math.min(255, 150 * shade), g = Math.min(255, 70 * shade), b = Math.min(255, 48 * shade);
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.fillRect(x, y, brickW, brickH);
      }
      row++;
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    _brickTex = tex;
    return tex;
  }

  let _finishedTex = null;
  function getFinishedFacadeTexture() {
    if (_finishedTex) return _finishedTex;
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#e9e4da'; // ceramic tile base
    ctx.fillRect(0, 0, size, size);

    // Big panes: wide spacing between mullions so each pane reads as one
    // large reflective sheet rather than a busy small window grid.
    const floorH = 128;
    const paneW = 128;
    for (let y = 0; y < size; y += floorH) {
      // Ceramic trim strip with faint tile grout lines
      ctx.fillStyle = '#e9e4da';
      ctx.fillRect(0, y, size, 8);
      ctx.strokeStyle = 'rgba(150,140,120,0.4)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < size; gx += 64) {
        ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + 8); ctx.stroke();
      }
      // Glass curtain-wall band below the trim — one big reflective sheet
      const grad = ctx.createLinearGradient(0, y + 8, 0, y + floorH);
      grad.addColorStop(0, '#4a7690');
      grad.addColorStop(0.35, '#6fa4bd');
      grad.addColorStop(0.55, '#3a6178');
      grad.addColorStop(1, '#1f3a49');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y + 8, size, floorH - 8);
      // Wide mullions — one every full pane width, not every window
      ctx.strokeStyle = 'rgba(18,20,20,0.6)';
      ctx.lineWidth = 3;
      for (let gx = 0; gx <= size; gx += paneW) {
        ctx.beginPath(); ctx.moveTo(gx, y + 8); ctx.lineTo(gx, y + floorH); ctx.stroke();
      }
      // Broad diagonal reflection sweep across each pane (mirror-like sheen)
      for (let gx = 0; gx < size; gx += paneW) {
        const sheen = ctx.createLinearGradient(gx, y + 8, gx + paneW * 0.6, y + floorH);
        sheen.addColorStop(0, 'rgba(255,255,255,0.32)');
        sheen.addColorStop(0.3, 'rgba(255,255,255,0.05)');
        sheen.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(gx, y + 8, paneW, floorH - 8);
      }
      // Sharp bright highlight line near the top of each pane
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, y + 24); ctx.lineTo(size, y + 24); ctx.stroke();
      // Brand accent trim on every band
      ctx.fillStyle = 'rgba(247,147,30,0.85)';
      ctx.fillRect(0, y + floorH - 4, size, 4);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    _finishedTex = tex;
    return tex;
  }

  function buildTower(x, z, h, w, type) {
    const group = new THREE.Group();
    let bodyMat;

    if (type === 'brick') {
      const tex = getBrickTexture().clone();
      tex.needsUpdate = true;
      tex.repeat.set(Math.max(1, Math.round(w / 4)), Math.max(1, Math.round(h / 4)));
      bodyMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0.03 });
    } else {
      bodyMat = new THREE.MeshStandardMaterial({ color: COLORS.concreteDark, roughness: 0.85, metalness: 0.1 });
    }

    const bodyGeo = new THREE.BoxGeometry(w, h, w);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(x, h / 2, z);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Window seams (edges) for definition
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bodyGeo),
      new THREE.LineBasicMaterial({ color: 0x1a1c1c, transparent: true, opacity: 0.4 })
    );
    edges.position.copy(body.position);
    group.add(edges);

    return group;
  }

  // The branded HQ tower — built with real massing (podium, glazed entrance,
  // corner pilasters, stepped crown) instead of a single flat-textured box,
  // so it reads as an actual building — with a clear, recognizable silhouette
  // and shadow lines — even from a distance, not just up close.
  function buildHQTower(x, z, h, w) {
    const group = new THREE.Group();

    // Podium — a wider stone/ceramic base with a glazed, canopied entrance
    const podiumH = Math.min(9, h * 0.16);
    const podiumW = w * 1.22;
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0xd8d4c8, roughness: 0.55, metalness: 0.05 });
    const podiumGeo = new THREE.BoxGeometry(podiumW, podiumH, podiumW);
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.set(x, podiumH / 2, z);
    podium.castShadow = true;
    podium.receiveShadow = true;
    group.add(podium);

    const podiumEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(podiumGeo),
      new THREE.LineBasicMaterial({ color: 0x2a2822, transparent: true, opacity: 0.5 })
    );
    podiumEdges.position.copy(podium.position);
    group.add(podiumEdges);

    const entranceMat = new THREE.MeshPhysicalMaterial({
      color: 0x18242c, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.85,
    });
    const entrance = new THREE.Mesh(new THREE.BoxGeometry(podiumW * 0.6, podiumH * 0.62, 0.14), entranceMat);
    entrance.position.set(x, podiumH * 0.42, z + podiumW / 2 + 0.08);
    group.add(entrance);

    const canopyMat = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.4, metalness: 0.3 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(podiumW * 0.7, 0.18, 1.7), canopyMat);
    canopy.position.set(x, podiumH * 0.8, z + podiumW / 2 + 0.85);
    canopy.castShadow = true;
    group.add(canopy);

    // Main shaft — glass + ceramic curtain wall, above the podium
    const shaftH = h - podiumH;
    const tex = getFinishedFacadeTexture().clone();
    tex.needsUpdate = true;
    tex.repeat.set(Math.max(1, Math.round(w / 8)), Math.max(1, Math.round(shaftH / 18)));
    const shaftMat = new THREE.MeshPhysicalMaterial({
      map: tex, roughness: 0.1, metalness: 0.45, clearcoat: 0.9, clearcoatRoughness: 0.08,
      reflectivity: 1,
    });
    const shaftGeo = new THREE.BoxGeometry(w, shaftH, w);
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(x, podiumH + shaftH / 2, z);
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);

    const shaftEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(shaftGeo),
      new THREE.LineBasicMaterial({ color: 0x1a1c1c, transparent: true, opacity: 0.4 })
    );
    shaftEdges.position.copy(shaft.position);
    group.add(shaftEdges);

    // Corner pilasters — real extruded geometry, not a flat texture, so the
    // tower keeps clean vertical lines and depth even seen from far away
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x2c2e2f, roughness: 0.45, metalness: 0.5 });
    const pierSize = 0.34;
    const upMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.4, metalness: 0.6 });
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(pierSize, shaftH, pierSize), pierMat);
      pier.position.set(x + sx * (w / 2), podiumH + shaftH / 2, z + sz * (w / 2));
      pier.castShadow = true;
      group.add(pier);

      // Ground-level facade uplight at the base of each pilaster
      const fixX = x + sx * (w / 2);
      const fixZ = z + sz * (w / 2);
      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.22, 10), upMat);
      fixture.position.set(fixX, podiumH + 0.11, fixZ);
      group.add(fixture);

      const facadeLight = new THREE.SpotLight(0xffdcae, 1.6, 34, Math.PI / 5.5, 0.5, 1.2);
      facadeLight.position.set(fixX, podiumH + 0.2, fixZ);
      facadeLight.target.position.set(x + sx * (w / 2) * 0.5, h * 0.8, z + sz * (w / 2) * 0.5);
      group.add(facadeLight, facadeLight.target);
    });

    // Crown — stepped-back cap, brand-orange trim line, and a beacon on a mast
    const crownH = Math.max(3, h * 0.05);
    const crownW = w * 0.68;
    const crownMat = new THREE.MeshStandardMaterial({ color: 0x24262a, roughness: 0.5, metalness: 0.4 });
    const crown = new THREE.Mesh(new THREE.BoxGeometry(crownW, crownH, crownW), crownMat);
    crown.position.set(x, h + crownH / 2, z);
    crown.castShadow = true;
    group.add(crown);

    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(crownW + 0.06, 0.16, crownW + 0.06),
      new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.4, metalness: 0.3 })
    );
    trim.position.set(x, h + 0.08, z);
    group.add(trim);

    const beaconMast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 8), pierMat);
    beaconMast.position.set(x, h + crownH + 1, z);
    group.add(beaconMast);

    const beacon = new THREE.PointLight(COLORS.orange, 0.7, 40, 2);
    beacon.position.set(x, h + crownH + 2, z);
    group.add(beacon);

    // Plaza, driveway and trees around the base — grounds it in the city
    // instead of floating on bare road.
    group.add(buildHQGrounds(x, z, podiumW));

    return group;
  }

  function buildTree(x, z, scale) {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: 0.9 });
    const trunkH = 3 * scale;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.24 * scale, trunkH, 7), trunkMat);
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    group.add(trunk);

    const foliageA = new THREE.MeshStandardMaterial({ color: 0x2f5233, roughness: 0.85 });
    const foliageB = new THREE.MeshStandardMaterial({ color: 0x3f7245, roughness: 0.85 });
    const blobs = [
      [0, trunkH + 1.3 * scale, 0, 1.5 * scale, foliageA],
      [0.85 * scale, trunkH + 0.85 * scale, 0.35 * scale, 1.05 * scale, foliageB],
      [-0.8 * scale, trunkH + 0.95 * scale, -0.5 * scale, 1.1 * scale, foliageA],
      [0.2 * scale, trunkH + 1.9 * scale, -0.3 * scale, 0.95 * scale, foliageB],
    ];
    blobs.forEach(([bx, by, bz, br, mat]) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(br, 8, 6), mat);
      b.position.set(bx, by, bz);
      b.castShadow = true;
      group.add(b);
    });

    group.position.set(x, 0, z);
    return group;
  }

  function buildHQGrounds(x, z, podiumW) {
    const group = new THREE.Group();

    // Paved plaza surrounding the podium
    const paveSize = podiumW + 30;
    const pc = document.createElement('canvas');
    pc.width = pc.height = 512;
    const pctx = pc.getContext('2d');
    pctx.fillStyle = '#38362f';
    pctx.fillRect(0, 0, 512, 512);
    pctx.strokeStyle = 'rgba(20,19,16,0.55)';
    pctx.lineWidth = 3;
    for (let i = 0; i <= 512; i += 64) {
      pctx.beginPath(); pctx.moveTo(i, 0); pctx.lineTo(i, 512); pctx.stroke();
      pctx.beginPath(); pctx.moveTo(0, i); pctx.lineTo(512, i); pctx.stroke();
    }
    const paveTex = new THREE.CanvasTexture(pc);
    paveTex.wrapS = paveTex.wrapT = THREE.RepeatWrapping;
    paveTex.repeat.set(paveSize / 8, paveSize / 8);
    const paveMat = new THREE.MeshStandardMaterial({ map: paveTex, roughness: 0.9 });
    const pave = new THREE.Mesh(new THREE.PlaneGeometry(paveSize, paveSize), paveMat);
    pave.rotation.x = -Math.PI / 2;
    pave.position.set(x, -0.47, z);
    pave.receiveShadow = true;
    group.add(pave);

    // Driveway leading from the entrance out toward the street
    const rc = document.createElement('canvas');
    rc.width = 128; rc.height = 512;
    const rctx = rc.getContext('2d');
    rctx.fillStyle = '#232323';
    rctx.fillRect(0, 0, 128, 512);
    rctx.strokeStyle = 'rgba(244,244,241,0.5)';
    rctx.lineWidth = 6;
    rctx.setLineDash([26, 20]);
    rctx.beginPath(); rctx.moveTo(64, 0); rctx.lineTo(64, 512); rctx.stroke();
    const roadTex = new THREE.CanvasTexture(rc);
    roadTex.wrapS = THREE.RepeatWrapping;
    roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(1, 6);
    const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.85 });
    const roadLen = 44;
    const road = new THREE.Mesh(new THREE.PlaneGeometry(9, roadLen), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, -0.46, z + podiumW / 2 + roadLen / 2 + 2);
    road.receiveShadow = true;
    group.add(road);

    // Trees flanking the sides and rear of the plaza (kept clear of the
    // entrance/sign-facing front so nothing blocks the view of either)
    const half = podiumW / 2;
    const treeSpots = [
      [-half - 6, -6], [-half - 6, 6], [-half - 9, -16], [-half - 9, 16],
      [half + 6, -6], [half + 6, 6], [half + 9, -16], [half + 9, 16],
      [-8, -half - 7], [8, -half - 7], [-half - 5, -half - 6], [half + 5, -half - 6],
    ];
    treeSpots.forEach(([dx, dz]) => {
      const scale = 0.85 + Math.random() * 0.5;
      group.add(buildTree(x + dx, z + dz, scale));
    });

    return group;
  }

  function makeBarBetween(a, b, mat, radius) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length() || 0.001;
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 5), mat);
    mesh.position.copy(a).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function buildScaffold(h, w) {
    // Local-space scaffold cage wrapping a footprint of size w×w up to height h.
    const group = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.55, metalness: 0.4 });
    const barMat = new THREE.MeshStandardMaterial({ color: 0x9a9a96, roughness: 0.7, metalness: 0.3 });
    const half = w / 2 + 1.6;
    const corners = [
      new THREE.Vector3(-half, 0, -half), new THREE.Vector3(half, 0, -half),
      new THREE.Vector3(half, 0, half), new THREE.Vector3(-half, 0, half),
    ];
    corners.forEach((c) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, h, 6), poleMat);
      pole.position.set(c.x, h / 2, c.z);
      pole.castShadow = true;
      group.add(pole);
    });
    for (let y = 5; y < h; y += 6.5) {
      corners.forEach((c, i) => {
        const next = corners[(i + 1) % 4];
        const a = new THREE.Vector3(c.x, y, c.z);
        const b = new THREE.Vector3(next.x, y, next.z);
        group.add(makeBarBetween(a, b, barMat, 0.07));
        // diagonal brace
        const bTop = new THREE.Vector3(next.x, y + 4, next.z);
        group.add(makeBarBetween(a, bTop, barMat, 0.05));
      });
      // planked platform at this level, on one face, for a worker to stand on
      const plank = new THREE.Mesh(new THREE.BoxGeometry(w + 1.6, 0.15, 1.1), poleMat);
      plank.position.set(0, y, half);
      group.add(plank);
    }
    return group;
  }

  function buildConstructionTower(x, z, fullHeight, w) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: COLORS.concreteDark, roughness: 0.9, metalness: 0.05 });
    const bodyGeo = new THREE.BoxGeometry(w, fullHeight, w);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = fullHeight / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bodyGeo),
      new THREE.LineBasicMaterial({ color: 0x1a1c1c, transparent: true, opacity: 0.5 })
    );
    edges.position.copy(body.position);
    group.add(edges);

    group.add(buildScaffold(fullHeight + 3, w));

    // Blinking safety beacon at the crown
    const beaconMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 1 })
    );
    beaconMesh.position.y = fullHeight + 2;
    group.add(beaconMesh);
    const beaconLight = new THREE.PointLight(0xff3b30, 0.8, 26, 2);
    beaconLight.position.copy(beaconMesh.position);
    group.add(beaconLight);

    group.position.set(x, 0, z);

    growingTowers.push({ body, edges, beaconMesh, beaconLight, fullHeight, phase: Math.random() * 10 });
    return group;
  }

  function buildWorker(x, y, z) {
    const group = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: 0xd8a878, roughness: 0.85 });
    const hiVis = new THREE.MeshStandardMaterial({ color: 0xf7931e, roughness: 0.65, metalness: 0.05 });
    const overalls = new THREE.MeshStandardMaterial({ color: 0x2c3a46, roughness: 0.75 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xffd23f, roughness: 0.4, metalness: 0.2 });
    const bodyMat = Math.random() > 0.5 ? hiVis : overalls;

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.42), bodyMat);
    torso.position.y = 1.3;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), skin);
    head.position.y = 1.95;
    group.add(head);

    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.22, 8), hatMat);
    hat.position.y = 2.16;
    group.add(hat);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 0.85 });
    const legGeo = new THREE.BoxGeometry(0.28, 0.9, 0.32);
    const legL = new THREE.Mesh(legGeo, legMat); legL.position.set(-0.18, 0.45, 0); group.add(legL);
    const legR = new THREE.Mesh(legGeo, legMat); legR.position.set(0.18, 0.45, 0); group.add(legR);

    const armGeo = new THREE.BoxGeometry(0.22, 0.8, 0.22);
    const armPivotL = new THREE.Group(); armPivotL.position.set(-0.5, 1.72, 0);
    const armL = new THREE.Mesh(armGeo, bodyMat); armL.position.y = -0.38; armPivotL.add(armL);
    group.add(armPivotL);

    const armPivotR = new THREE.Group(); armPivotR.position.set(0.5, 1.72, 0);
    const armR = new THREE.Mesh(armGeo, bodyMat); armR.position.y = -0.38; armPivotR.add(armR);
    group.add(armPivotR);

    group.position.set(x, y, z);
    group.userData = { armPivotL, armPivotR, phase: Math.random() * 10, baseY: y };
    workers.push(group);
    return group;
  }

  function buildCity() {
    const group = new THREE.Group();
    group.add(buildGround());

    const layout = [
      // x, z, height, width, facade type: 'finished' (glass+ceramic, the
      // branded HQ tower) | 'brick' | 'concrete'
      [-60, -30, 46, 12, 'brick'], [-40, -10, 30, 10, 'concrete'], [-20, -50, 60, 14, 'brick'],
      [10, -30, 38, 11, 'finished'], [30, -60, 70, 16, 'brick'], [55, -20, 26, 9, 'concrete'],
      [-80, 20, 20, 9, 'concrete'], [-30, 40, 34, 10, 'brick'], [0, 30, 44, 12, 'concrete'],
      [40, 40, 24, 9, 'brick'], [70, 10, 54, 13, 'brick'], [-55, -80, 66, 15, 'concrete'],
      [15, -90, 48, 12, 'brick'], [-10, -120, 80, 17, 'brick'], [60, -110, 40, 11, 'concrete'],
      [-90, -60, 30, 10, 'brick'], [90, -50, 36, 10, 'concrete'], [0, -160, 92, 18, 'brick'],
      [-40, -170, 50, 12, 'concrete'], [40, -190, 60, 13, 'brick'],
    ];
    // A handful of towers are shown mid-construction: scaffolded and slowly rising.
    const risingIndices = new Set([2, 8, 13]);
    layout.forEach(([x, z, h, w, type], i) => {
      if (risingIndices.has(i)) {
        group.add(buildConstructionTower(x, z, h, w));
      } else if (type === 'finished') {
        group.add(buildHQTower(x, z, h, w));
      } else {
        group.add(buildTower(x, z, h, w, type));
      }
    });

    return group;
  }

  function buildCrane(x, z, rotY, armLen) {
    const group = new THREE.Group();
    const steel = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.5, metalness: 0.6 });
    const steelDark = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.6, metalness: 0.5 });

    const towerH = 46 + Math.random() * 20;
    const mast = new THREE.Mesh(new THREE.BoxGeometry(1.6, towerH, 1.6), steelDark);
    mast.position.y = towerH / 2;
    mast.castShadow = true;
    group.add(mast);

    // Cross-bracing (simple lattice look via thin diagonals)
    const braceMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.7 });
    for (let y = 4; y < towerH; y += 6) {
      const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 5), braceMat);
      brace.rotation.z = Math.PI / 4;
      brace.position.set(0.8, y, 0.8);
      group.add(brace);
    }

    // Slewing unit + jib (rotates)
    const jibGroup = new THREE.Group();
    jibGroup.position.y = towerH;
    const jib = new THREE.Mesh(new THREE.BoxGeometry(armLen, 1.1, 1.1), steel);
    jib.position.x = armLen / 2 - 3;
    jib.castShadow = true;
    jibGroup.add(jib);

    const counterJib = new THREE.Mesh(new THREE.BoxGeometry(armLen * 0.32, 1.1, 1.1), steelDark);
    counterJib.position.x = -(armLen * 0.32) / 2 - 2;
    jibGroup.add(counterJib);

    const counterWeight = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 3.2), steelDark);
    counterWeight.position.set(-(armLen * 0.32) - 2.2, -1.6, 0);
    jibGroup.add(counterWeight);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), steelDark);
    cabin.position.set(1.2, -1.4, 0);
    jibGroup.add(cabin);

    // Hook cable + hook + load crate (animated hoist up/down, trolley in/out)
    const hookGroup = new THREE.Group();
    hookGroup.position.set(6, 0, 0); // trolley (in/out along jib), animated
    const cableMat = new THREE.LineBasicMaterial({ color: 0x999999 });
    const cableGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -14, 0),
    ]);
    const cable = new THREE.Line(cableGeo, cableMat);
    hookGroup.add(cable);
    const hook = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), steel);
    hook.position.y = -14;
    hookGroup.add(hook);
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.3, 1.6),
      new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.6, metalness: 0.3 })
    );
    crate.position.y = -1;
    crate.castShadow = true;
    hook.add(crate);
    jibGroup.add(hookGroup);

    // Blinking aircraft-warning beacon at the mast top
    const beaconMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 1 })
    );
    beaconMesh.position.y = towerH + 1.6;
    group.add(beaconMesh);

    group.add(jibGroup);
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    cranes.push({
      group, jibGroup, hookGroup, hook, cable, beaconMesh,
      armLen, speed: 0.05 + Math.random() * 0.05, phase: Math.random() * 10,
    });
    return group;
  }

  // Shared logo texture for truck decals (loaded once, reused on every truck)
  let truckLogoTexture = null;
  function getTruckLogoTexture() {
    if (!truckLogoTexture) {
      truckLogoTexture = new THREE.TextureLoader().load('assets/basma-ahed-logo.png');
      if (THREE.sRGBEncoding) truckLogoTexture.encoding = THREE.sRGBEncoding;
      truckLogoTexture.anisotropy = 4;
    }
    return truckLogoTexture;
  }

  function buildTruck() {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.5, metalness: 0.4 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e4, roughness: 0.4, metalness: 0.2 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.9 });

    const bed = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 2.2), bodyMat);
    bed.position.set(-0.4, 1.3, 0);
    bed.castShadow = true;
    group.add(bed);

    // Company logo decal on both sides of the bed
    const logoTex = getTruckLogoTexture();
    const logoW = 1.1, logoH = logoW * (1024 / 985);
    const logoGeo = new THREE.PlaneGeometry(logoW, logoH);
    const logoMatFront = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false, toneMapped: false });
    const logoFront = new THREE.Mesh(logoGeo, logoMatFront);
    logoFront.position.set(-0.4, 1.3, 1.105);
    group.add(logoFront);

    const logoMatBack = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false, toneMapped: false });
    const logoBack = new THREE.Mesh(logoGeo, logoMatBack);
    logoBack.position.set(-0.4, 1.3, -1.105);
    logoBack.rotation.y = Math.PI;
    group.add(logoBack);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 2.1), cabinMat);
    cabin.position.set(2.1, 1.3, 0);
    cabin.castShadow = true;
    group.add(cabin);

    [[-1.6, 1.1], [-1.6, -1.1], [1.6, 1.1], [1.6, -1.1], [2.6, 1.1], [2.6, -1.1]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 12), wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.55, wz);
      group.add(wheel);
    });

    return group;
  }

  function buildExcavator(x, z) {
    const group = new THREE.Group();
    const yellow = new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.5, metalness: 0.4 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 3), dark);
    base.position.y = 0.6;
    group.add(base);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), yellow);
    cab.position.y = 1.6;
    group.add(cab);

    const armPivot = new THREE.Group();
    armPivot.position.set(0.6, 2.1, 0);
    const boom = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.5), yellow);
    boom.position.set(1.5, 0.6, 0);
    boom.rotation.z = 0.5;
    armPivot.add(boom);

    const stick = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.4), yellow);
    stick.position.set(3.6, -0.6, 0);
    stick.rotation.z = -0.9;
    armPivot.add(stick);

    const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), dark);
    bucket.position.set(4.6, -1.8, 0);
    armPivot.add(bucket);

    group.add(armPivot);
    group.position.set(x, 0, z);
    excavatorArm = armPivot;
    return group;
  }

  function buildDust() {
    const count = isMobile ? 400 : 1000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 500;
      positions[i * 3 + 1] = Math.random() * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 700 - 100;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.6, map: makeSoftCircleTexture('rgba(244,244,241,0.9)'),
      transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    dustPoints = new THREE.Points(geo, mat);
    return dustPoints;
  }

  function buildBirds() {
    birdGroup = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0x1a1a1a });
    for (let i = 0; i < 8; i++) {
      const shape = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.6, 0, 0), new THREE.Vector3(0, 0.25, 0), new THREE.Vector3(0.6, 0, 0),
      ]);
      const bird = new THREE.Line(shape, mat);
      bird.position.set((Math.random() - 0.5) * 200, 60 + Math.random() * 40, -Math.random() * 300);
      bird.userData.speed = 0.4 + Math.random() * 0.4;
      bird.userData.flap = Math.random() * 10;
      birdGroup.add(bird);
    }
    return birdGroup;
  }

  function buildClouds() {
    cloudGroup = new THREE.Group();
    const tex = makeCloudTexture();
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.5, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      const scale = 60 + Math.random() * 90;
      sprite.scale.set(scale, scale * 0.5, 1);
      sprite.position.set((Math.random() - 0.5) * 600, 90 + Math.random() * 60, -Math.random() * 600 + 100);
      sprite.userData.speed = 0.03 + Math.random() * 0.05;
      cloudGroup.add(sprite);
    }
    return cloudGroup;
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  function init() {
    const canvas = document.getElementById('scene-canvas');
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.black);
    scene.fog = new THREE.FogExp2(0x0b0c0d, 0.0024);

    camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 2000);
    camera.position.set(...PATH[0].pos);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

    // Lighting — soft HDR-ish setup
    const hemi = new THREE.HemisphereLight(0xbfd6e8, 0x2a2622, 0.65);
    scene.add(hemi);

    sunLight = new THREE.DirectionalLight(0xfff2df, 1.4);
    sunLight.position.set(120, 160, 80);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
    sunLight.shadow.camera.left = -220;
    sunLight.shadow.camera.right = 220;
    sunLight.shadow.camera.top = 220;
    sunLight.shadow.camera.bottom = -220;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.bias = -0.0015;
    scene.add(sunLight);

    const fill = new THREE.DirectionalLight(0x6f8ea8, 0.35);
    fill.position.set(-100, 60, -120);
    scene.add(fill);

    // Sun lens-flare-ish glow sprite
    const flareMat = new THREE.SpriteMaterial({
      map: makeSoftCircleTexture('rgba(255,235,190,1)'),
      transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const flare = new THREE.Sprite(flareMat);
    flare.scale.set(140, 140, 1);
    flare.position.set(220, 220, -260);
    scene.add(flare);

    // Build world
    scene.add(buildCity());

    const cranePlacements = [
      [-55, -20, 0.4, 34], [15, -40, -0.6, 30], [-15, 20, 1.1, 26],
      [55, 30, -1.3, 32], [0, -140, 0.8, 38], [-70, -80, -0.4, 28],
      [80, 15, -0.8, 30], [-80, -140, 0.6, 34], [35, 55, -0.3, 26],
      [-60, 55, 1.2, 28], [75, -155, -1.0, 32], [-35, -190, 0.5, 30],
      [12, -8, 0.5, 22], [-22, -5, -0.7, 20],
    ];
    cranePlacements.forEach(([x, z, r, len]) => scene.add(buildCrane(x, z, r, len)));

    // Spread hoist/trolley phases evenly around the cycle so, at any moment, some
    // cranes are lifting a load up while others are lowering — not all in sync.
    cranes.forEach((c, i) => {
      c.phase = (i / cranes.length) * 10;
    });

    scene.add(buildExcavator(24, 12));

    // Company sign, mounted on the tower at (10, -30), lit by its own spotlights
    scene.add(buildCompanySign(SIGN_POS.x, SIGN_POS.y, SIGN_POS.z));

    // Ground crew near crane bases and the excavator
    scene.add(buildWorker(-57, 0, -17));
    scene.add(buildWorker(-52.5, 0, -23));
    scene.add(buildWorker(17, 0, -37));
    scene.add(buildWorker(20.5, 0, 14.5));
    scene.add(buildWorker(27, 0, 9));
    scene.add(buildWorker(83, 0, 19));
    scene.add(buildWorker(-77, 0, -136));
    scene.add(buildWorker(38, 0, 51));

    // Crew working the scaffolds of the rising towers (tower footprints from buildCity's layout)
    scene.add(buildWorker(-20 + 8.6, 30, -50));   // tower @ (-20,-50), platform y≈30
    scene.add(buildWorker(-20 - 8.6, 42, -50));   // same tower, higher platform
    scene.add(buildWorker(0 + 7.6, 24, 30));      // tower @ (0,30)
    scene.add(buildWorker(-10 + 10.1, 36, -120)); // tower @ (-10,-120)
    scene.add(buildWorker(-10 - 10.1, 60, -120)); // same tower, higher platform

    const truckPaths = [
      { start: -300, end: 300, z: 8, y: 0 },
      { start: 300, end: -300, z: -55, y: 0 },
    ];
    truckPaths.forEach(p => {
      const t = buildTruck();
      t.position.set(p.start, p.y, p.z);
      scene.add(t);
      trucks.push({ mesh: t, ...p, dir: p.start < p.end ? 1 : -1, speed: 8 + Math.random() * 4 });
    });

    scene.add(buildDust());
    scene.add(buildBirds());
    scene.add(buildClouds());

    clock = new THREE.Clock();
    window.addEventListener('resize', onResize);
    OmranScene.ready = true;
    animate();
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  /* ---------------------------------------------------------------------
     Public API
     --------------------------------------------------------------------- */
  OmranScene.init = init;
  OmranScene.setProgress = function (p) { OmranScene._progress = Math.min(Math.max(p, 0), 1); };
  OmranScene.setMouse = function (x, y) { OmranScene._mouse.x = x; OmranScene._mouse.y = y; };

  /* ---------------------------------------------------------------------
     Animation loop
     --------------------------------------------------------------------- */
  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    // Camera along spline, driven by scroll progress
    const p = OmranScene._progress;
    const camPos = posCurve.getPoint(p);
    const lookPos = lookCurve.getPoint(p);

    // Hero orbit: before the user scrolls, circle around the district while
    // staying centered on the company sign, then hand off smoothly into the
    // normal scroll-driven path as soon as scrolling begins.
    const ORBIT_RADIUS = 22;
    const ORBIT_HEIGHT = 9;
    const ORBIT_SPEED = 0.11;
    const ORBIT_FADE = 0.07; // fraction of total scroll over which the orbit hands off
    const orbitBlend = 1 - smoothstep(p, 0, ORBIT_FADE);
    const orbitAngle = t * ORBIT_SPEED;
    const orbitX = SIGN_POS.x + Math.cos(orbitAngle) * ORBIT_RADIUS;
    const orbitY = SIGN_POS.y + ORBIT_HEIGHT;
    const orbitZ = SIGN_POS.z + Math.sin(orbitAngle) * ORBIT_RADIUS;

    const finalX = THREE.MathUtils.lerp(camPos.x, orbitX, orbitBlend);
    const finalY = THREE.MathUtils.lerp(camPos.y, orbitY, orbitBlend);
    const finalZ = THREE.MathUtils.lerp(camPos.z, orbitZ, orbitBlend);
    camera.position.set(finalX, finalY, finalZ);

    const lookX = THREE.MathUtils.lerp(lookPos.x, SIGN_POS.x, orbitBlend);
    const lookY = THREE.MathUtils.lerp(lookPos.y, SIGN_POS.y, orbitBlend);
    const lookZ = THREE.MathUtils.lerp(lookPos.z, SIGN_POS.z, orbitBlend);

    const mx = OmranScene._mouse.x * 6 * (1 - orbitBlend * 0.7);
    const my = OmranScene._mouse.y * 4 * (1 - orbitBlend * 0.7);
    camera.lookAt(lookX + mx, lookY + my, lookZ);

    // Cranes: slow slew rotation, trolley sliding in/out, hook hoisting a load up & down
    cranes.forEach((c, i) => {
      c.jibGroup.rotation.y = Math.sin(t * c.speed + i) * 0.6;

      // Trolley glides back and forth along the jib
      const trolleyRange = Math.max(c.armLen - 12, 10);
      const trolleyWave = 0.5 - 0.5 * Math.cos(t * 0.09 + c.phase);
      c.hookGroup.position.x = 6 + trolleyWave * trolleyRange;

      // Hook + load rise and fall on a slow hoist cycle (pause-like ease at top/bottom)
      const hoistWave = 0.5 - 0.5 * Math.cos(t * 0.16 + c.phase * 1.3);
      const hoistLen = THREE.MathUtils.lerp(3, 14, hoistWave);
      c.hook.position.y = -hoistLen;
      c.cable.scale.y = hoistLen / 14;

      // Aircraft-warning beacon blink
      c.beaconMesh.material.emissiveIntensity = 0.5 + Math.sin(t * 5 + c.phase) * 0.5;
    });

    // Towers under construction: scaffolded shells rising floor by floor on a slow loop
    growingTowers.forEach((u) => {
      const cycle = (t * 0.012 + u.phase * 0.1) % 1;
      const growth = 0.32 + 0.68 * (0.5 - 0.5 * Math.cos(cycle * Math.PI * 2));
      u.body.scale.y = growth;
      u.body.position.y = (u.fullHeight * growth) / 2;
      u.edges.scale.y = growth;
      u.edges.position.y = u.body.position.y;
      u.beaconLight.intensity = 0.4 + Math.sin(t * 5 + u.phase) * 0.4;
      u.beaconMesh.material.emissiveIntensity = 0.5 + Math.sin(t * 5 + u.phase) * 0.5;
    });

    // Workers: hammering / working motion with a light body bob
    workers.forEach((w) => {
      const ud = w.userData;
      const swing = Math.max(0, Math.sin(t * 3.4 + ud.phase));
      ud.armPivotR.rotation.x = -0.25 + swing * 1.15;
      ud.armPivotL.rotation.x = 0.18 * Math.sin(t * 3.4 + ud.phase + 1.6);
      w.position.y = ud.baseY + swing * 0.04;
    });

    // Excavator idle dig motion
    if (excavatorArm) {
      excavatorArm.rotation.z = Math.sin(t * 0.6) * 0.15;
    }

    // Trucks drive back and forth
    trucks.forEach(tr => {
      tr.mesh.position.x += tr.dir * tr.speed * dt;
      if (tr.dir > 0 && tr.mesh.position.x > tr.end) tr.dir = -1;
      if (tr.dir < 0 && tr.mesh.position.x < tr.end) tr.dir = 1;
      tr.mesh.rotation.y = tr.dir > 0 ? 0 : Math.PI;
    });

    // Dust drifting upward, wrap around
    if (dustPoints) {
      const pos = dustPoints.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + dt * 1.4;
        if (y > 95) y = 0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      dustPoints.rotation.y += dt * 0.01;
    }

    // Birds flying through
    if (birdGroup) {
      birdGroup.children.forEach(b => {
        b.position.x += b.userData.speed;
        b.position.y += Math.sin(t * 3 + b.userData.flap) * 0.02;
        if (b.position.x > 220) b.position.x = -220;
      });
    }

    // Clouds drifting
    if (cloudGroup) {
      cloudGroup.children.forEach(c => {
        c.position.x += c.userData.speed;
        if (c.position.x > 400) c.position.x = -400;
      });
    }

    renderer.render(scene, camera);
  }
})();
