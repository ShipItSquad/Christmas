
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Sparkles, Float, Environment, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';

function Snow({ count = 1000 }) {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50; // x
            pos[i * 3 + 1] = Math.random() * 20;     // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
        }
        return pos;
    }, [count]);

    const speeds = useMemo(() => {
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            spd[i] = 0.02 + Math.random() * 0.05;
        }
        return spd;
    }, [count]);

    const ref = useRef<THREE.Points>(null!);

    useFrame(() => {
        if (!ref.current || !ref.current.geometry) return;
        const positionAttribute = ref.current.geometry.getAttribute('position');
        if (!positionAttribute) return;

        // We can cast the array to a typed array since we know it's a Float32Array
        const array = positionAttribute.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Use non-null assertion or check bounds if stricter safety needed, 
            // but here we know count matches array size.
            let y = array[i * 3 + 1];

            // Update Y
            y -= speeds[i];
            if (y < 0) {
                y = 20;
            }

            array[i * 3 + 1] = y;
        }
        positionAttribute.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.15} color="white" transparent opacity={0.8} />
        </points>
    );
}

function Tree({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.4, 1, 8]} />
                <meshStandardMaterial color="#3e2723" roughness={0.8} />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <coneGeometry args={[1.2, 2, 8]} />
                <meshStandardMaterial color="#1b5e20" roughness={0.5} />
            </mesh>
            <mesh position={[0, 2.5, 0]} castShadow>
                <coneGeometry args={[0.9, 1.8, 8]} />
                <meshStandardMaterial color="#2e7d32" roughness={0.5} />
            </mesh>
            <mesh position={[0, 3.4, 0]} castShadow>
                <coneGeometry args={[0.6, 1.5, 8]} />
                <meshStandardMaterial color="#4caf50" roughness={0.5} />
            </mesh>
        </group>
    );
}

function House({ position, rotation = [0, 0, 0], color = "#e57373" }: { position: [number, number, number], rotation?: [number, number, number], color?: string }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Base */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[2, 1.5, 4]} />
                <meshStandardMaterial color="#b71c1c" />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.6, 1.01]}>
                <planeGeometry args={[0.6, 1.2]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
            {/* Window */}
            <mesh position={[0.5, 1.5, 1.01]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-0.5, 1.5, 1.01]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
            </mesh>
            {/* Chimney smoke */}
            {/* Cloud from drei usually takes arguments, adjusting just in case of version mismatch */}
            <Cloud position={[0.8, 3.5, 0]} opacity={0.3} speed={0.2} color="#eeeeee" />
        </group>
    );
}

function SimplePresent({ position, color }: { position: [number, number, number], color: string }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.51, 0.1, 0.51]} />
                <meshStandardMaterial color="gold" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.1, 0.51, 0.51]} />
                <meshStandardMaterial color="gold" />
            </mesh>
        </group>
    )
}

function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#e0f7fa" roughness={1} metalness={0} />
        </mesh>
    );
}

function SceneLights() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 20, 10]} intensity={0.5} castShadow />
            <spotLight position={[-10, 20, -10]} angle={0.5} intensity={0.8} castShadow penumbra={1} color="#ffd54f" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </>
    )
}


function MouseLight() {
    const light = useRef<THREE.PointLight>(null!)
    const sphere = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        // Project mouse to a plane above the ground
        const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
        vector.unproject(state.camera);
        const dir = vector.sub(state.camera.position).normalize();

        // Intersect with a virtual plane at Y = 2
        // Plane equation: y = 2
        // Ray: P = Origin + t * Direction
        // 2 = O.y + t * D.y  =>  t = (2 - O.y) / D.y

        const targetY = 2;
        // We only want to place it if we are looking somewhat towards the plane
        // but OrbitControls might let us look up. 
        // If D.y is close to 0, t explodes.

        let t = (targetY - state.camera.position.y) / dir.y;

        let pos: THREE.Vector3;

        // If we can't project to the plane (e.g. looking parallel or away), or t is too far,
        // just place it at a fixed distance in front
        if (Math.abs(dir.y) < 0.01 || t < 0 || t > 50) {
            pos = state.camera.position.clone().add(dir.multiplyScalar(10));
        } else {
            pos = state.camera.position.clone().add(dir.multiplyScalar(t));
        }

        if (light.current) light.current.position.copy(pos);
        if (sphere.current) sphere.current.position.copy(pos);
    })

    return (
        <>
            <pointLight ref={light} intensity={5} distance={10} decay={2} color="#ffeb3b" castShadow />
            <mesh ref={sphere}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#ffeb3b" />
            </mesh>
        </>
    )
}

export function ChristmasScene() {
    return (
        <div className="fixed inset-0 z-0 w-full h-full bg-[#050a14]">
            <Canvas shadows camera={{ position: [8, 5, 8], fov: 60 }}>
                <fog attach="fog" args={['#050a14', 10, 40]} />
                <SceneLights />
                <MouseLight />

                <group position={[0, -1, 0]}>
                    <Ground />

                    {/* Center Piece */}
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <Tree position={[0, 0, 0]} scale={1.5} />
                        <Sparkles count={50} scale={4} size={4} speed={0.4} opacity={0.7} color="yellow" position={[0, 2, 0]} />
                    </Float>

                    {/* Presents around tree */}
                    <SimplePresent position={[1, 0, 0.5]} color="red" />
                    <SimplePresent position={[-1, 0, 1]} color="blue" />
                    <SimplePresent position={[0.5, 0, -1]} color="purple" />

                    {/* Houses */}
                    <House position={[-4, 0, 4]} rotation={[0, Math.PI / 4, 0]} color="#ef5350" />
                    <House position={[4, 0, 3]} rotation={[0, -Math.PI / 6, 0]} color="#42a5f5" />
                    <House position={[-3, 0, -3]} rotation={[0, Math.PI / 1.5, 0]} color="#ffa726" />

                    {/* Background Trees */}
                    <Tree position={[-6, 0, 1]} scale={0.8} />
                    <Tree position={[6, 0, -2]} scale={0.9} />
                    <Tree position={[-2, 0, -6]} scale={1.2} />
                    <Tree position={[3, 0, -5]} scale={0.7} />
                    <Tree position={[7, 0, 5]} scale={1.1} />
                </group>

                <Snow />
                <OrbitControls autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 - 0.1} minDistance={5} maxDistance={20} />
            </Canvas>
        </div>
    );
}
