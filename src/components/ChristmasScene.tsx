import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, Sparkles, Float, Environment, Text3D, RoundedBox, MeshDistortMaterial } from '@react-three/drei';
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
            let y = array[i * 3 + 1];
            if (y === undefined) continue;

            let speed = speeds[i];
            if (speed === undefined) speed = 0.05;
            // Update Y
            y -= speed;
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
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.15} color="white" transparent opacity={0.8} />
        </points>
    );
}

function Tree({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk - Rounded Cylinder via Capsule or just Cylinder */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.25, 1, 16]} />
                <meshStandardMaterial color="#5d4037" roughness={0.8} />
            </mesh>
            {/* Leaves - Puffy Spheres */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#4caf50" roughness={0.6} />
            </mesh>
            <mesh position={[0, 2.2, 0]} castShadow>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color="#66bb6a" roughness={0.6} />
            </mesh>
            <mesh position={[0, 3.0, 0]} castShadow>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial color="#81c784" roughness={0.6} />
            </mesh>
        </group>
    );
}

function House({ position, rotation = [0, 0, 0], color = "#e57373" }: { position: [number, number, number], rotation?: [number, number, number], color?: string }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Base - Rounded Box */}
            <group position={[0, 1, 0]}>
                <RoundedBox args={[2, 2, 2]} radius={0.2} smoothness={4} castShadow receiveShadow>
                    <meshStandardMaterial color={color} />
                </RoundedBox>
            </group>

            {/* Roof - Puffy Mushroom Style */}
            <mesh position={[0, 2.1, 0]} scale={[1.4, 0.8, 1.4]} castShadow>
                <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#b71c1c" />
            </mesh>

            {/* Door - Rounded Plate */}
            <mesh position={[0, 0.6, 1.05]}>
                <boxGeometry args={[0.6, 1.2, 0.1]} /> {/* Using simple box but could be rounded plane if needed, small scale detail */}
                <meshStandardMaterial color="#3e2723" />
            </mesh>

            {/* Windows - Circles */}
            <mesh position={[0.5, 1.5, 1.05]} rotation={[0, 0, 0]}>
                <circleGeometry args={[0.25, 32]} />
                <meshStandardMaterial color="#fff176" emissive="#fff176" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-0.5, 1.5, 1.05]} rotation={[0, 0, 0]}>
                <circleGeometry args={[0.25, 32]} />
                <meshStandardMaterial color="#fff176" emissive="#fff176" emissiveIntensity={0.5} />
            </mesh>

            {/* Chimney smoke */}
            <Cloud position={[0.8, 3, 0]} opacity={0.3} speed={0.2} color="#eeeeee" bounds={[1, 1, 1]} segments={10} volume={2} />
        </group>
    );
}

function SimplePresent({ position, color, ribbonColor = "#ffd700" }: { position: [number, number, number], color: string, ribbonColor?: string }) {
    return (
        <group position={position}>
            <group position={[0, 0.25, 0]}>
                <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.1} smoothness={4} castShadow>
                    <meshStandardMaterial color={color} />
                </RoundedBox>
            </group>
            {/* Ribbons */}
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.52, 0.1, 0.52]} />
                <meshStandardMaterial color={ribbonColor} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
                <boxGeometry args={[0.1, 0.52, 0.52]} />
                <meshStandardMaterial color={ribbonColor} />
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

function Ghost() {
    const group = useRef<THREE.Group>(null!);
    const [target] = useState(() => new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        1 + Math.random() * 2,
        (Math.random() - 0.5) * 15
    ));

    useFrame((state, delta) => {
        if (!group.current) return;

        // Project mouse to a plane in world space (approximate)
        const mouseWorld = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
        mouseWorld.unproject(state.camera);
        // Approximate intersection with Y plane of ghost height (approx ~1-3)
        // Similar logic to MouseLight but we need the world coord
        const dirToMouse = mouseWorld.clone().sub(state.camera.position).normalize();
        const t = (group.current.position.y - state.camera.position.y) / dirToMouse.y;
        let mousePos = state.camera.position.clone().add(dirToMouse.multiplyScalar(t));

        // Use a default mouse pos far away if projection fails or t is invalid
        if (Math.abs(dirToMouse.y) < 0.01 || t < 0 || t > 50) {
            mousePos = new THREE.Vector3(1000, 1000, 1000);
        }

        const currentPos = group.current.position;
        const distToMouse = currentPos.distanceTo(mousePos);

        // Flee radius
        const fleeRadius = 4;

        let moveDir = new THREE.Vector3();

        if (distToMouse < fleeRadius) {
            // Run away from mouse!
            moveDir.subVectors(currentPos, mousePos).normalize();
            // Override target so we don't snap back immediately
            target.copy(currentPos).add(moveDir.multiplyScalar(5));
        } else {
            // Wander logic
            moveDir.subVectors(target, currentPos);

            if (moveDir.length() < 0.5) {
                // Pick new random target
                target.set(
                    (Math.random() - 0.5) * 15,
                    1 + Math.random() * 2,
                    (Math.random() - 0.5) * 15
                );
            }
            moveDir.normalize();
        }

        // Apply movement
        const speed = distToMouse < fleeRadius ? 6 : 2; // Run faster if scared
        group.current.position.add(moveDir.multiplyScalar(delta * speed));

        // Constrain to bounds (soft)
        if (group.current.position.x > 20) group.current.position.x = 20;
        if (group.current.position.x < -20) group.current.position.x = -20;
        if (group.current.position.z > 20) group.current.position.z = 20;
        if (group.current.position.z < -20) group.current.position.z = -20;


        // Look at where we are going
        const lookTarget = group.current.position.clone().add(moveDir);
        group.current.lookAt(lookTarget);

        // Floatiness (sine wave on Y)
        group.current.position.y += Math.sin(state.clock.elapsedTime * 2 + currentPos.x) * 0.005;
    });

    return (
        <group ref={group}>
            {/* Body */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
                {/* 
                MeshDistortMaterial adds vertex displacement noise.
                We make it react to light by giving it some roughness and transmission 
                looks cool with lights behind/near it.
             */}
                <MeshDistortMaterial
                    color="#ffffff"
                    roughness={0.2}
                    metalness={0.1}
                    distort={0.4} // Strength of distortion
                    speed={2} // Speed of distortion
                    radius={1}
                />
            </mesh>

            {/* Eyes - Keeping them simple black spheres */}
            <mesh position={[0.12, 0.2, 0.25]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[-0.12, 0.2, 0.25]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
    )
}

function Ghosts({ count = 5 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Ghost key={i} />
            ))}
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
                <Ghosts count={8} />

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
                    <SimplePresent position={[0.5, 0, -1]} color="white" ribbonColor="#2196f3" />

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
