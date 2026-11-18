import * as THREE from "three";

// Curved visor follows the helmet rather than sitting in front as a flat display.
export function createGuide() {
  const root = new THREE.Group();
  root.name = "IfrazGuide";
  const shell = new THREE.MeshPhysicalMaterial({
    color: "#0f1013",
    metalness: 0.2,
    roughness: 0.57,
    clearcoat: 0.1,
    envMapIntensity: 0.35,
  });
  const joint = new THREE.MeshStandardMaterial({
    color: "#111515",
    metalness: 0.28,
    roughness: 0.4,
    envMapIntensity: 0.6,
  });
  const visor = new THREE.MeshPhysicalMaterial({
    color: "#010503",
    metalness: 0.06,
    roughness: 0.22,
    clearcoat: 0.55,
    clearcoatRoughness: 0.16,
    envMapIntensity: 0.18,
  });
  const lime = new THREE.MeshBasicMaterial({
    color: "#adff24",
    toneMapped: false,
  });
  shell.name = "GraphiteShell";
  joint.name = "DarkJoints";
  visor.name = "BlackGlass";
  const add = (
    parent,
    name,
    geometry,
    material,
    position = [0, 0, 0],
    scale = [1, 1, 1],
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  };
  const sphere = new THREE.SphereGeometry(1, 48, 32);
  // Model trim as curved surface patches: no bars or badges floating off the torso.
  const bodyFront = (x, y) => {
    const unitY = (y + 0.9) / 0.67;
    const taper = 1 + 0.22 * unitY;
    return (
      0.46 *
      taper *
      Math.sqrt(Math.max(0, 1 - unitY * unitY - (x / (0.62 * taper)) ** 2))
    );
  };
  const patch = (outline, heightAt, offset = 0.004) => {
    const positions = [],
      indices = [],
      segments = 64,
      rings = 12;
    for (let j = 0; j <= rings; j++)
      for (let i = 0; i <= segments; i++) {
        const [x, y] = outline((i / segments) * Math.PI * 2, j / rings);
        positions.push(x, y, heightAt(x, y) + offset);
        if (j < rings && i < segments) {
          const k = j * (segments + 1) + i;
          indices.push(
            k,
            k + segments + 1,
            k + 1,
            k + 1,
            k + segments + 1,
            k + segments + 2,
          );
        }
      }
    const result = new THREE.BufferGeometry();
    result.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  };
  const softRectangle =
    (width, height, cx, cy, angle = 0, taper = 0) =>
    (t, r = 1) => {
      const y =
        Math.sign(Math.sin(t)) *
        Math.abs(Math.sin(t)) ** 0.55 *
        height *
        0.5 *
        r;
      const x =
        Math.sign(Math.cos(t)) *
        Math.abs(Math.cos(t)) ** 0.55 *
        width *
        0.5 *
        r *
        (1 + (taper * y) / (height * 0.5));
      return [
        cx + x * Math.cos(angle) - y * Math.sin(angle),
        cy + x * Math.sin(angle) + y * Math.cos(angle),
      ];
    };
  const surface = (x, y) =>
    0.78 * Math.sqrt(Math.max(0.07, 1 - (x / 1.13) ** 2 - (y / 0.92) ** 2)) +
    0.026;
  function outline(t, r = 1) {
    return [
      Math.sign(Math.cos(t)) * Math.abs(Math.cos(t)) ** 0.82 * 0.84 * r,
      Math.sign(Math.sin(t)) * Math.abs(Math.sin(t)) ** 0.82 * 0.57 * r - 0.045,
    ];
  }
  const head = new THREE.Group();
  head.name = "Head";
  head.position.y = 0.47;
  root.add(head);
  add(head, "Helmet", sphere, shell, [0, 0, 0], [1.13, 0.92, 0.78]);
  const vertices = [],
    indices = [],
    segments = 96,
    rings = 24;
  for (let j = 0; j <= rings; j++)
    for (let i = 0; i <= segments; i++) {
      const [x, y] = outline((i / segments) * Math.PI * 2, j / rings);
      vertices.push(x, y, surface(x, y));
      if (j < rings && i < segments) {
        const k = j * (segments + 1) + i;
        indices.push(
          k,
          k + segments + 1,
          k + 1,
          k + 1,
          k + segments + 1,
          k + segments + 2,
        );
      }
    }
  const face = new THREE.BufferGeometry();
  face.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  face.setIndex(indices);
  face.computeVertexNormals();
  add(head, "CurvedGlassVisor", face, visor);
  const rim = [];
  for (let i = 0; i < 96; i++) {
    const [x, y] = outline((i / 96) * Math.PI * 2);
    rim.push(new THREE.Vector3(x, y, surface(x, y) + 0.002));
  }
  add(
    head,
    "InsetVisorSeam",
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(rim, true),
      96,
      0.019,
      8,
      true,
    ),
    joint,
  );
  for (const [name, cx] of [
    ["EyeLeft", -0.34],
    ["EyeRight", 0.34],
  ]) {
    const points = [];
    const base = surface(cx, 0.04) + 0.022;
    for (let i = 0; i <= 24; i++) {
      const t = i / 24,
        x = -0.17 + 0.34 * t,
        y = Math.sin(t * Math.PI) * 0.14;
      points.push(
        new THREE.Vector3(x, y, surface(cx + x, 0.04 + y) + 0.023 - base),
      );
    }
    add(
      head,
      name,
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        32,
        0.035,
        10,
        false,
      ),
      lime,
      [cx, 0.04, base],
    );
  }
  for (const side of [-1, 1]) {
    const ear = new THREE.Group();
    ear.name = "EarAssembly" + side;
    ear.position.set(side * 1.01, -0.035, 0.1);
    ear.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(side * 0.92, 0, 0.39).normalize(),
    );
    head.add(ear);
    const profile = [
      new THREE.Vector2(0, -0.1),
      new THREE.Vector2(0.22, -0.1),
      new THREE.Vector2(0.28, -0.075),
      new THREE.Vector2(0.31, -0.025),
      new THREE.Vector2(0.315, 0.035),
      new THREE.Vector2(0.295, 0.095),
      new THREE.Vector2(0.26, 0.125),
      new THREE.Vector2(0.21, 0.128),
      new THREE.Vector2(0, 0.128),
    ];
    const housing = new THREE.LatheGeometry(
      new THREE.SplineCurve(profile).getPoints(40),
      64,
    );
    housing.rotateX(Math.PI / 2);
    add(ear, "EarCushion" + side, housing, shell);
    const earFace = shell.clone();
    earFace.name = "EarFace";
    earFace.color.set("#24272c");
    earFace.roughness = 0.5;
    const inset = add(
      ear,
      "RecessedEarFace" + side,
      new THREE.CylinderGeometry(0.212, 0.212, 0.008, 64),
      earFace,
      [0, 0, 0.131],
    );
    inset.rotation.x = Math.PI / 2;
    add(
      ear,
      "EarInsetSeam" + side,
      new THREE.TorusGeometry(0.246, 0.005, 8, 64),
      joint,
      [0, 0, 0.131],
    );
    add(
      ear,
      "EarLimeRing" + side,
      new THREE.TorusGeometry(0.225, 0.011, 10, 64),
      lime,
      [0, 0, 0.133],
    );
  }
  add(
    head,
    "AntennaBase",
    sphere,
    joint,
    [0.05, 0.91, -0.05],
    [0.18, 0.055, 0.15],
  );
  add(
    head,
    "AntennaCollar",
    new THREE.TorusGeometry(0.12, 0.015, 8, 32),
    lime,
    [0.05, 0.94, -0.05],
  ).rotation.x = Math.PI / 2;
  const antennaPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.05, 0.94, -0.05),
    new THREE.Vector3(0.02, 1.11, -0.05),
    new THREE.Vector3(-0.06, 1.23, -0.05),
    new THREE.Vector3(-0.13, 1.3, -0.05),
  ]);
  add(
    head,
    "CurvedAntenna",
    new THREE.TubeGeometry(antennaPath, 18, 0.036, 10, false),
    shell,
  );
  add(
    head,
    "AntennaTip",
    sphere,
    new THREE.MeshStandardMaterial({
      color: "#92c61c",
      emissive: "#6e9800",
      emissiveIntensity: 0.2,
      roughness: 0.3,
      metalness: 0.05,
      envMapIntensity: 0.5,
    }),
    [-0.13, 1.34, -0.05],
    [0.125, 0.125, 0.125],
  );
  add(
    root,
    "Neck",
    new THREE.CylinderGeometry(0.18, 0.21, 0.2, 28),
    joint,
    [0, -0.45, 0],
  );
  const bodyGeometry = sphere.clone();
  const positions = bodyGeometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    const taper = 1 + 0.22 * y;
    positions.setXYZ(
      i,
      positions.getX(i) * taper,
      y,
      positions.getZ(i) * taper,
    );
  }
  const body = add(
    root,
    "TaperedBody",
    bodyGeometry,
    shell,
    [0, -0.9, 0],
    [0.62, 0.67, 0.46],
  );
  body.geometry.computeVertexNormals();
  // A flank panel wraps around the torso in angular coordinates. A flat front
  // rectangle would only read as a stripe when the robot turns sideways.
  const sideGreen = new THREE.MeshStandardMaterial({
    color: "#8ebd20",
    emissive: "#456b08",
    emissiveIntensity: 0.18,
    metalness: 0.08,
    roughness: 0.48,
  });
  sideGreen.name = "InsetLimeSidePanel";
  const torsoPoint = (theta, v, offset = 0.002) => {
    const taper = 1 + 0.22 * v,
      radial = Math.sqrt(Math.max(0, 1 - v * v));
    return new THREE.Vector3(
      0.62 * taper * radial * Math.sin(theta) * (1 + offset),
      -0.9 + 0.67 * v,
      0.46 * taper * radial * Math.cos(theta) * (1 + offset),
    );
  };
  const flankShape = new THREE.Shape();
  flankShape.moveTo(0.87, -0.13);
  flankShape.quadraticCurveTo(0.78, -0.14, 0.85, -0.22);
  flankShape.lineTo(1.17, -0.54);
  flankShape.quadraticCurveTo(1.26, -0.65, 1.35, -0.65);
  flankShape.lineTo(1.56, -0.65);
  flankShape.quadraticCurveTo(1.71, -0.64, 1.68, -0.53);
  flankShape.lineTo(1.61, -0.2);
  flankShape.quadraticCurveTo(1.6, -0.11, 1.48, -0.11);
  flankShape.lineTo(0.87, -0.13);
  const flankOutline = flankShape.getSpacedPoints(80);
  const flankGeometry = (side) => {
    const positions = [],
      indices = [],
      segments = flankOutline.length - 1,
      rings = 16;
    const center = new THREE.Vector2(1.31, -0.36);
    for (let j = 0; j <= rings; j++)
      for (let i = 0; i <= segments; i++) {
        const uv = center.clone().lerp(flankOutline[i], j / rings);
        positions.push(...torsoPoint(side * uv.x, uv.y).toArray());
        if (j < rings && i < segments) {
          const k = j * (segments + 1) + i;
          indices.push(
            k,
            k + 1,
            k + segments + 1,
            k + 1,
            k + segments + 2,
            k + segments + 1,
          );
        }
      }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    // Mirroring a panel reverses winding. Keep its front facing away from the body.
    const p = geometry.getAttribute("position"),
      n = geometry.getAttribute("normal");
    let outward = 0;
    for (let i = 0; i < p.count; i++)
      outward += p.getX(i) * n.getX(i) + p.getZ(i) * n.getZ(i);
    if (outward < 0) {
      for (let i = 0; i < indices.length; i += 3) {
        const b = indices[i + 1];
        indices[i + 1] = indices[i + 2];
        indices[i + 2] = b;
      }
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
    }
    return geometry;
  };
  const chestMaterial = shell.clone();
  chestMaterial.name = "GraphiteChest";
  chestMaterial.color.set("#25282d");
  const chestOutline = softRectangle(0.46, 0.46, 0, -0.81, 0, 0.14);
  add(root, "ChestInset", patch(chestOutline, bodyFront, 0.003), chestMaterial);
  const chestSeam = [];
  for (let i = 0; i < 80; i++) {
    const [x, y] = chestOutline((i / 80) * Math.PI * 2);
    chestSeam.push(new THREE.Vector3(x, y, bodyFront(x, y) + 0.003));
  }
  add(
    root,
    "ChestPanelSeam",
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(chestSeam, true),
      80,
      0.004,
      6,
      true,
    ),
    joint,
  );
  for (let i = 0; i < 3; i++) {
    add(
      root,
      "ChestLight" + i,
      patch(
        softRectangle(0.155 - i * 0.015, 0.028, 0, -0.72 - i * 0.085),
        bodyFront,
        0.007,
      ),
      lime,
    );
  }
  for (const side of [-1, 1]) {
    add(root, "BodySidePanel" + side, flankGeometry(side), lime);
    const seam = flankOutline
      .slice(0, -1)
      .map((uv) => torsoPoint(side * uv.x, uv.y, 0.003));
    add(
      root,
      "BodySidePanelSeam" + side,
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(seam, true),
        80,
        0.0025,
        6,
        true,
      ),
      joint,
    );
    const arm = new THREE.Group();
    arm.name = side === 1 ? "RightArm" : "LeftArm";
    arm.position.set(side * 0.54, -0.62, 0.01);
    arm.rotation.z = side === 1 ? 0.5 : 0.28;
    root.add(arm);
    add(
      arm,
      "Shoulder" + side,
      sphere,
      joint,
      [0, 0, 0],
      [0.145, 0.145, 0.145],
    );
    const forearm = add(
      arm,
      "RoundedForearm" + side,
      sphere,
      shell,
      [side * 0.22, 0, 0.025],
      [0.27, 0.17, 0.19],
    );
    forearm.rotation.z = side * 0.08;
    // One local hand coordinate system keeps all digits aligned with the palm.
    // +X points toward the fingertips, Y spans the knuckle row, +Z faces forward.
    // Mirror the entire hand, rather than independently reversing finger angles.
    const hand = new THREE.Group();
    hand.name = side === 1 ? "RightHand" : "LeftHand";
    hand.position.set(side * 0.42, 0.025, 0.04);
    hand.scale.x = side;
    arm.add(hand);
    add(hand, "Palm" + side, sphere, joint, [0.025, 0, 0], [0.15, 0.16, 0.105]);
    const fingerSettings = {
      radius: 0.038, // Thickness; diameter = 0.076.
      spacing: 0.1, // Knuckle centers; leaves visible gaps.
      lengths: [0.15, 0.175, 0.14], // Index, middle, outer digit; middle is longest.
      rootOutward: 0.1, // Roots stay inside the palm, not detached.
      depth: 0.025, // All fingers share the palm's front/back plane.
      splay: 0.012, // Slight outward fan, not unrelated rotations.
      thumbRadius: 0.043,
    };
    // Orient a rounded digit from its root to its tip. This avoids the previous
    // row of tilted capsules intersecting one another or disappearing into the palm.
    const digit = (name, from, to, radius) => {
      const start = new THREE.Vector3(...from);
      const end = new THREE.Vector3(...to);
      const direction = end.clone().sub(start);
      const center = start.clone().add(end).multiplyScalar(0.5);
      const mesh = add(
        hand,
        name,
        new THREE.CapsuleGeometry(radius, direction.length(), 6, 16),
        shell,
        center.toArray(),
      );
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      );
      return mesh;
    };
    fingerSettings.lengths.forEach((length, i) => {
      const row = 1 - i;
      digit(
        "Finger" + side + "_" + i,
        [
          fingerSettings.rootOutward,
          row * fingerSettings.spacing,
          fingerSettings.depth,
        ],
        [
          fingerSettings.rootOutward + length,
          row * (fingerSettings.spacing + fingerSettings.splay),
          fingerSettings.depth + 0.008,
        ],
        fingerSettings.radius,
      );
    });
    // The thumb grows from the UPPER edge of the palm and points upward/outward.
    // Its separation from the three-finger row makes the silhouette read as a hand.
    digit(
      "Thumb" + side,
      [-0.02, 0.085, 0.04],
      [0.065, 0.17, 0.06],
      fingerSettings.thumbRadius,
    );
    const armLight = add(
      arm,
      "ArmAccent" + side,
      new THREE.CapsuleGeometry(0.018, 0.1, 4, 12),
      lime,
      [side * 0.23, -0.05, 0.196],
    );
    armLight.rotation.z = Math.PI / 2;
  }
  // Rear panel gives the model a finished back when visitors turn it around.
  add(head, "RearPanel", sphere, joint, [0, -0.06, -0.73], [0.48, 0.31, 0.025]);
  for (let i = 0; i < 3; i++) {
    const vent = add(
      head,
      "RearVent" + i,
      new THREE.CapsuleGeometry(0.018, 0.3, 4, 12),
      shell,
      [0, 0.04 - i * 0.09, -0.765],
    );
    vent.rotation.z = Math.PI / 2;
  }
  add(
    root,
    "RearStatus",
    sphere,
    lime,
    [0, -0.72, -0.47],
    [0.035, 0.035, 0.012],
  );
  root.updateMatrixWorld(true);
  return root;
}
