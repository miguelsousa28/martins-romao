const canvas = document.querySelector("[data-hero-3d]");

if (canvas) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    const THREE = await import("https://unpkg.com/three@0.164.1/build/three.module.js");
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const group = new THREE.Group();
    const pointer = new THREE.Vector2(0, 0);
    const colors = [0x20b0e0, 0xf03050, 0xffb040];

    camera.position.set(0, 0, 8.5);
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const light = new THREE.DirectionalLight(0xffffff, 2.2);
    light.position.set(3, 4, 7);
    scene.add(light);

    colors.forEach((color, index) => {
      const y = 1.9 - index * 1.3;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.35, y, -0.4),
        new THREE.Vector3(-0.12, y + 0.42, 0.35),
        new THREE.Vector3(1.18, y - 0.35, -0.15),
        new THREE.Vector3(2.62, y + 0.18, 0.28),
      ]);

      const tube = new THREE.TubeGeometry(curve, 90, 0.045 + index * 0.009, 12, false);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.64,
        metalness: 0.16,
        opacity: 0.95,
        roughness: 0.32,
        transparent: true,
      });
      const ribbon = new THREE.Mesh(tube, material);
      ribbon.rotation.z = -0.1 + index * 0.11;
      group.add(ribbon);

      for (let i = 0; i < 10; i += 1) {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.025 + (i % 3) * 0.012, 12, 12),
          material.clone()
        );
        const t = i / 10;
        const point = curve.getPoint(t);
        sphere.position.set(point.x + Math.sin(i) * 0.08, point.y + Math.cos(i) * 0.08, point.z + 0.1);
        group.add(sphere);
      }
    });

    colors.forEach((color, index) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.48,
        opacity: 0.34,
        roughness: 0.4,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const shard = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.2, 1, 1), material);
      shard.position.set(0.15 + index * 0.72, 1.05 - index * 0.56, -0.18 + index * 0.08);
      shard.rotation.set(0.1 + index * 0.2, -0.24 + index * 0.14, 0.42 - index * 0.26);
      group.add(shard);
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const isNarrow = width < 720;
      group.position.set(isNarrow ? 0.24 : 1.18, isNarrow ? 0.78 : 0.35, 0);
      group.scale.setScalar(isNarrow ? 0.82 : 1);
    };

    const samplePixels = () => {
      const gl = renderer.getContext();
      const size = 64;
      const positions = [
        [0.44, 0.48],
        [0.56, 0.5],
        [0.68, 0.56],
        [0.76, 0.44],
      ];
      let signal = 0;

      positions.forEach(([xRatio, yRatio]) => {
        const pixels = new Uint8Array(4 * size * size);
        const x = Math.max(0, Math.min(gl.drawingBufferWidth - size, Math.round(gl.drawingBufferWidth * xRatio)));
        const y = Math.max(0, Math.min(gl.drawingBufferHeight - size, Math.round(gl.drawingBufferHeight * yRatio)));
        gl.readPixels(x, y, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] > 0 && (pixels[i] > 0 || pixels[i + 1] > 0 || pixels[i + 2] > 0)) {
            signal += 1;
          }
        }
      });

      canvas.dataset.pixelSignal = String(signal);
      canvas.dataset.rendered = signal > 0 ? "true" : "false";
    };

    const render = (time = 0) => {
      const t = time * 0.001;

      group.rotation.y = -0.34 + pointer.x * 0.12 + Math.sin(t * 0.55) * 0.04;
      group.rotation.x = 0.12 + pointer.y * 0.08 + Math.cos(t * 0.4) * 0.025;
      group.rotation.z = Math.sin(t * 0.34) * 0.025;

      renderer.render(scene, camera);
    };

    const animate = (time) => {
      render(time);

      if (!prefersReducedMotion) {
        requestAnimationFrame(animate);
      }
    };

    resize();
    render(0);
    samplePixels();
    requestAnimationFrame(animate);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX / window.innerWidth - 0.5;
        pointer.y = event.clientY / window.innerHeight - 0.5;
      },
      { passive: true }
    );
  } catch (error) {
    canvas.dataset.rendered = "fallback";
    canvas.dataset.error = "three-unavailable";
  }
}
