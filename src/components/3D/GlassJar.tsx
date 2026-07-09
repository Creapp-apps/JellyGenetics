'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import styles from './GlassJar.module.css'

interface GlassJarProps {
    terpeneColor?: string
    seedScale?: number
    autoRotate?: boolean
    cameraZ?: number
    className?: string
}

export default function GlassJar({
    terpeneColor = '#00FF88',
    seedScale = 1,
    autoRotate = true,
    cameraZ = 6.5,
    className = '',
}: GlassJarProps) {
    return (
        <div className={`${styles.container} ${className}`}>
            <Canvas
                camera={{ position: [0, 0.2, cameraZ], fov: 35 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.6} />
                <directionalLight position={[-3, 3, -3]} intensity={0.3} color={terpeneColor} />
                <pointLight position={[0, -2, 0]} intensity={0.5} color={terpeneColor} distance={8} />

                <JarScene
                    terpeneColor={terpeneColor}
                    seedScale={seedScale}
                    autoRotate={autoRotate}
                />

                <Environment preset="night" />
            </Canvas>
        </div>
    )
}

function JarScene({
    terpeneColor,
    seedScale,
    autoRotate,
}: {
    terpeneColor: string
    seedScale: number
    autoRotate: boolean
}) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (groupRef.current && autoRotate) {
            groupRef.current.rotation.y += delta * 0.3
        }
    })

    return (
        <group ref={groupRef}>
            {/* The Glass Jar */}
            <JarGeometry terpeneColor={terpeneColor} />

            {/* Seed model inside with dedicated lighting */}
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
                {/* Internal point light — illuminates the seed from center */}
                <pointLight
                    position={[0, 0, 0]}
                    intensity={3}
                    color={terpeneColor}
                    distance={3}
                    decay={2}
                />
                {/* Spotlight from above — dramatic top-down highlight */}
                <spotLight
                    position={[0, 2, 1]}
                    intensity={4}
                    angle={0.5}
                    penumbra={0.8}
                    color="#ffffff"
                    distance={6}
                    target-position={[0, 0, 0]}
                />
                <SeedModel scale={seedScale} terpeneColor={terpeneColor} />
            </Float>

            {/* Neon Ring — Top */}
            <NeonRing position={[0, 1.1, 0]} color={terpeneColor} radius={0.75} />

            {/* Neon Ring — Bottom */}
            <NeonRing position={[0, -1.1, 0]} color={terpeneColor} radius={0.75} />
        </group>
    )
}

/* ===== Glass Jar Body (Procedural Cylinder) ===== */
function JarGeometry({ terpeneColor }: { terpeneColor: string }) {
    const jarColor = useMemo(() => new THREE.Color(terpeneColor).multiplyScalar(0.15), [terpeneColor])

    return (
        <group>
            {/* Main body — glass cylinder */}
            <mesh>
                <cylinderGeometry args={[0.7, 0.7, 2.0, 32, 1, true]} />
                <MeshTransmissionMaterial
                    backside
                    samples={6}
                    thickness={0.3}
                    chromaticAberration={0.05}
                    anisotropy={0.2}
                    distortion={0.1}
                    distortionScale={0.2}
                    temporalDistortion={0.1}
                    roughness={0.05}
                    color={jarColor}
                    transmission={0.95}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Bottom cap */}
            <mesh position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.7, 32]} />
                <meshStandardMaterial
                    color={terpeneColor}
                    metalness={0.8}
                    roughness={0.3}
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Lid */}
            <mesh position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.55, 0.72, 0.35, 32]} />
                <meshStandardMaterial
                    color="#1a1a2e"
                    metalness={0.9}
                    roughness={0.3}
                    transparent
                    opacity={0.85}
                />
            </mesh>

            {/* Lid handle */}
            <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.25, 0.03, 8, 32]} />
                <meshStandardMaterial
                    color={terpeneColor}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={terpeneColor}
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    )
}

/* ===== Seed GLB Model ===== */
function SeedModel({ scale = 1, terpeneColor = '#00FF88' }: { scale: number; terpeneColor?: string }) {
    const { scene } = useGLTF('/seed.glb')

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)
        const emissiveColor = new THREE.Color(terpeneColor).multiplyScalar(0.3)
        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
                // Enhance materials for visibility
                if (child.material) {
                    const mat = child.material as THREE.MeshStandardMaterial
                    if (mat.isMeshStandardMaterial) {
                        mat.emissive = emissiveColor
                        mat.emissiveIntensity = 0.4
                        mat.envMapIntensity = 2.0
                        mat.roughness = Math.max(0.2, (mat.roughness || 0.5) - 0.2)
                        mat.metalness = Math.min(0.8, (mat.metalness || 0) + 0.2)
                        mat.needsUpdate = true
                    }
                }
            }
        })
        return clone
    }, [scene, terpeneColor])

    return (
        <primitive
            object={clonedScene}
            scale={scale * 7.5}
            position={[0, 0, 0]}
        />
    )
}

/* ===== Neon Ring (Static) ===== */
function NeonRing({
    position,
    color,
    radius = 0.75,
}: {
    position: [number, number, number]
    color: string
    radius: number
}) {
    const ringRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (ringRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.85
            const mat = ringRef.current.material as THREE.MeshStandardMaterial
            mat.emissiveIntensity = pulse
        }
    })

    return (
        <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 8, 64]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                toneMapped={false}
            />
        </mesh>
    )
}


// Preload the seed model
useGLTF.preload('/seed.glb')
