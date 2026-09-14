"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ─── Central Node ─── */
function CentralNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    if (glowRef.current) {
      const scale = 1.3 + Math.sin(t * 1.5) * 0.08;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#00e5a0"
          transparent
          opacity={0.06}
        />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color="#0d1117"
          emissive="#00e5a0"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Inner solid */}
      <mesh>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial
          color="#00e5a0"
          emissive="#00e5a0"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

/* ─── Project Node ─── */
function ProjectNode({
  position,
  color,
  size = 0.12,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed;
      meshRef.current.rotation.y = t;
      meshRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {/* Glow */}
        <mesh>
          <sphereGeometry args={[size * 2.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.04} />
        </mesh>
        {/* Node */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[size, 0]} />
          <meshStandardMaterial
            color="#0d1117"
            emissive={color}
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
        {/* Core */}
        <mesh>
          <sphereGeometry args={[size * 0.35, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Data Stream (animated connection line) ─── */
function DataStream({
  start,
  end,
  color = "#00e5a0",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const points = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t;
      const z = start[2] + (end[2] - start[2]) * t;
      // Add slight curve
      const mid = Math.sin(t * Math.PI) * 0.15;
      points.push(new THREE.Vector3(x + mid * 0.3, y + mid, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [start, end]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
      }),
    [color]
  );

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 2) * 0.06;
    }
  });

  return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
}

/* ─── Floating Particles ─── */
function FloatingParticles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
        ] as [number, number, number],
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.3,
        p.position[1] + Math.cos(t * p.speed * 0.7 + p.offset) * 0.2,
        p.position[2]
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color="#00e5a0" transparent opacity={0.3} />
    </instancedMesh>
  );
}

/* ─── Main Scene ─── */
function Scene() {
  const projectNodes: {
    pos: [number, number, number];
    color: string;
    size: number;
    speed: number;
  }[] = useMemo(
    () => [
      { pos: [2.2, 1.0, -0.5], color: "#00e5a0", size: 0.15, speed: 0.8 },   // Manifest
      { pos: [-2.0, 0.6, 0.3], color: "#3b82f6", size: 0.15, speed: 0.7 },   // Support Triage
      { pos: [1.5, -1.2, 0.8], color: "#f59e0b", size: 0.12, speed: 1.1 },   // Tree Crown
      { pos: [-1.8, -0.8, -0.6], color: "#ef4444", size: 0.11, speed: 0.9 },  // Linux Driver
      { pos: [0.8, 1.8, -1.0], color: "#8b5cf6", size: 0.10, speed: 1.2 },   // InternPer
      { pos: [-0.6, -1.8, 0.4], color: "#06b6d4", size: 0.10, speed: 1.0 },  // AI Code Editor
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-3, -2, 4]} intensity={0.2} color="#00e5a0" />

      <Stars
        radius={20}
        depth={50}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      <CentralNode />

      {projectNodes.map((node, i) => (
        <ProjectNode
          key={i}
          position={node.pos}
          color={node.color}
          size={node.size}
          speed={node.speed}
        />
      ))}

      {projectNodes.map((node, i) => (
        <DataStream
          key={`stream-${i}`}
          start={[0, 0, 0]}
          end={node.pos}
          color={node.color}
        />
      ))}

      <FloatingParticles count={80} />

      {/* Fog for depth */}
      <fog attach="fog" args={["#06080d", 5, 18]} />
    </>
  );
}

/* ─── Exported Canvas Wrapper ─── */
export default function SceneCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCreated = useCallback(() => {
    // Canvas ready
  }, []);

  return (
    <div ref={canvasRef} className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={handleCreated}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
