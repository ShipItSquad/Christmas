
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function GlassCube() {
    return (
        <mesh rotation={[0.4, 0.2, 0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshPhysicalMaterial
                roughness={0}
                transmission={1}
                thickness={2}
                ior={1.5}
                color="white"
                transparent={true}
                opacity={1}
            />
        </mesh>
    );
}

export function GlassScene() {
    return (
        <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <GlassCube />
                <OrbitControls enableZoom={true} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
