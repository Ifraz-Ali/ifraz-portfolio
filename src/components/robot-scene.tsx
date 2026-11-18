"use client";
/* eslint-disable react-hooks/immutability -- Three.js owns this cloned scene and its GPU resources. Mutating transforms in useFrame is intentional; no React state or props are mutated. */
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  MathUtils,
  PMREMGenerator,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  type Group,
  type Material,
} from "three";

export type RobotSceneProps = {
  active: boolean;
  reduced: boolean;
  wave: number;
  pointer: { current: { x: number; y: number } };
  onReady: () => void;
  onFailure: () => void;
  orientation: { current: { yaw: number; pitch: number } };
  requestRender: { current: (() => void) | null };
  typingReaction: { current: { started: number; finished: number } };
};
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function StudioLighting() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    invalidate();
    return () => {
      scene.environment = null;
      environment.dispose();
      room.dispose();
      generator.dispose();
    };
  }, [gl, scene, invalidate]);
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 5, 5]} intensity={1.8} />
      <directionalLight position={[4, 1, -2]} intensity={1.1} color="#b9c9b5" />
    </>
  );
}
function Robot({
  active,
  reduced,
  wave,
  pointer,
  onReady,
  orientation,
  requestRender,
  typingReaction,
}: RobotSceneProps) {
  const gltf = useLoader(GLTFLoader, "/models/portfolio-guide.glb?v=7");
  const model = useMemo(() => {
    const copy = gltf.scene.clone(true);
    const materials = new Map<Material, Material>();
    const localMaterial = (material: Material) => {
      if (!materials.has(material)) {
        const cloned = material.clone();
        if (cloned instanceof MeshBasicMaterial) cloned.toneMapped = false;
        if (cloned instanceof MeshStandardMaterial)
          cloned.envMapIntensity = cloned.name === "BlackGlass" ? 0.18 : 0.35;
        if (
          cloned instanceof MeshPhysicalMaterial &&
          cloned.name === "BlackGlass"
        ) {
          cloned.specularIntensity = 0.18;
          cloned.clearcoat = 0.15;
          cloned.roughness = 0.28;
        }
        materials.set(material, cloned);
      }
      return materials.get(material)!;
    };
    copy.traverse((node) => {
      if (node instanceof Mesh)
        node.material = Array.isArray(node.material)
          ? node.material.map(localMaterial)
          : localMaterial(node.material);
    });
    return copy;
  }, [gltf.scene]);
  const root = useRef<Group>(null);
  const readyReported = useRef(false);
  const readyFrame = useRef(0);
  const time = useRef(0);
  const waveStart = useRef(-100);
  const lastWave = useRef(-1);
  const parts = useMemo(
    () => ({
      head: model.getObjectByName("Head"),
      arm: model.getObjectByName("RightArm"),
      left: model.getObjectByName("EyeLeft"),
      right: model.getObjectByName("EyeRight"),
    }),
    [model],
  );
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
    return () => { cancelAnimationFrame(readyFrame.current); readyReported.current = false; };
  }, [invalidate]);
  useEffect(() => {
    requestRender.current = invalidate;
    return () => {
      requestRender.current = null;
    };
  }, [invalidate, requestRender]);
  useFrame((_, delta) => {
    if (!root.current) return;
    // Report readiness after the first rendered frame, not merely after GLB parsing.
    if (!readyReported.current) {
      readyReported.current = true;
      readyFrame.current = requestAnimationFrame(onReady);
    }
    if (!active || reduced) {
      root.current.position.y = -0.12;
      root.current.rotation.set(
        orientation.current.pitch,
        orientation.current.yaw,
        0,
      );
      parts.head?.rotation.set(0, 0, 0);
      if (parts.arm) parts.arm.rotation.z = 0.5;
      for (const eye of [parts.left, parts.right]) if (eye) eye.scale.y = 1;
      return;
    }
    time.current += Math.min(delta, 0.05);
    const t = time.current;
    if (wave !== lastWave.current) {
      lastWave.current = wave;
      waveStart.current = t;
    }
    root.current.position.y = -0.12 + Math.sin(t * 1.25) * 0.045;
    root.current.rotation.y = MathUtils.damp(
      root.current.rotation.y,
      orientation.current.yaw + pointer.current.x * 0.08,
      7,
      delta,
    );
    root.current.rotation.x = MathUtils.damp(
      root.current.rotation.x,
      orientation.current.pitch,
      9,
      delta,
    );
    if (parts.head) {
      const sinceTyping =
        performance.now() / 1000 - typingReaction.current.started;
      const tilt =
        typingReaction.current.started > 0 && sinceTyping < 1.2
          ? 0.065 * Math.exp(-sinceTyping * 2.6)
          : 0;
      parts.head.rotation.z = MathUtils.damp(
        parts.head.rotation.z,
        tilt,
        10,
        delta,
      );
      parts.head.rotation.y = MathUtils.damp(
        parts.head.rotation.y,
        pointer.current.x * 0.17,
        7,
        delta,
      );
      parts.head.rotation.x = MathUtils.damp(
        parts.head.rotation.x,
        -pointer.current.y * 0.1,
        7,
        delta,
      );
    }
    const blink = t % 5.8;
    const ordinaryBlink =
      blink > 5.5 ? Math.max(0.08, Math.abs((blink - 5.65) / 0.15)) : 1;
    const sinceFinished =
      performance.now() / 1000 - typingReaction.current.finished;
    const eyeScale =
      typingReaction.current.finished > 0 && sinceFinished < 0.28
        ? Math.max(0.08, Math.abs((sinceFinished - 0.14) / 0.14))
        : ordinaryBlink;
    for (const eye of [parts.left, parts.right])
      if (eye) eye.scale.y = eyeScale;
    const elapsed = t - waveStart.current;
    if (parts.arm) {
      const target = elapsed < 1.8 ? 0.7 + Math.sin(elapsed * 11) * 0.14 : 0.5;
      parts.arm.rotation.z = MathUtils.damp(
        parts.arm.rotation.z,
        target,
        10,
        delta,
      );
    }
  });
  return (
    <group ref={root} rotation={[0, -0.25, 0]} position={[0, -0.12, 0]}>
      <primitive object={model} />
    </group>
  );
}
export default function RobotScene(props: RobotSceneProps) {
  return (
    <SceneBoundary onFailure={props.onFailure}>
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0.15, 6.8], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        frameloop={props.active && !props.reduced ? "always" : "demand"}
        fallback={null}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", props.onFailure, {
            once: true,
          });
        }}
      >
        <StudioLighting />
        <Suspense fallback={null}>
          <Robot {...props} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
