'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

export type PackState = 'IDLE' | 'CHARGING' | 'TENSION_SHAKE' | 'BURST' | 'REVEAL'

interface JellyPouch3DProps {
  autoRotate?: boolean
  rotationSpeed?: number
  glowColor?: string
  scale?: number
  isOpened?: boolean
  packState?: PackState
  onToggleOpen?: () => void
}

/* ══════════════════════ Web Audio Tear Synthesizer ══════════════════════ */
export function playTearSound() {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const sampleRate = ctx.sampleRate
    const duration = 0.45
    const frameCount = Math.floor(sampleRate * duration)
    const buffer = ctx.createBuffer(1, frameCount, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < frameCount; i++) {
      const p = i / frameCount
      const envelope = Math.sin(p * Math.PI) * Math.pow(1 - p, 0.35)
      const crunch = Math.random() > 0.8 ? (Math.random() * 2 - 1) * 1.8 : 0
      data[i] = ((Math.random() * 2 - 1) * 0.6 + crunch) * envelope
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3600, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + duration)
    filter.Q.setValueAtTime(2.0, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.48, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  } catch {
    // Audio policies fallback
  }
}

/* ══════════════════════ Parametric Split Pouch Geometries ══════════════════════ */
function useSplitPouchGeometries(
  width = 2.0,
  height = 2.46,
  depth = 0.22,
  nx = 36,
  ny = 44,
  splitRatio = 0.865 // 86.5% height is the tear notch line
) {
  return useMemo(() => {
    function getPouchZ(u: number, v: number) {
      const mx = 0.08
      const mBot = 0.06
      const mTop = 0.15
      if (u < mx || u > 1 - mx || v < mBot || v > 1 - mTop) {
        return 0.012
      }
      const iu = (u - mx) / (1 - 2 * mx)
      const iv = (v - mBot) / (1 - mBot - mTop)
      const bulge = Math.sin(iu * Math.PI) * Math.sin(iv * Math.PI)
      const botWeight = 1.0 - 0.25 * iv
      return 0.012 + depth * Math.pow(Math.max(0, bulge), 0.65) * botWeight
    }

    const jSplit = Math.round(ny * splitRatio)

    /* ── 1. Front Body & Back Body (from row 0 to jSplit) ── */
    const fbPos: number[] = []
    const fbUvs: number[] = []
    const fbIndices: number[] = []

    const bbPos: number[] = []
    const bbUvs: number[] = []
    const bbIndices: number[] = []

    for (let j = 0; j <= jSplit; j++) {
      const v = j / ny
      const y = (v - 0.5) * height
      for (let i = 0; i <= nx; i++) {
        const u = i / nx
        const x = (u - 0.5) * width
        const z = getPouchZ(u, v)

        // Front
        fbPos.push(x, y, z)
        fbUvs.push(u, v)

        // Back
        bbPos.push(x, y, -z)
        bbUvs.push(1.0 - u, v)
      }
    }

    for (let j = 0; j < jSplit; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i
        const b = j * (nx + 1) + i + 1
        const c = (j + 1) * (nx + 1) + i + 1
        const d = (j + 1) * (nx + 1) + i

        fbIndices.push(a, b, c, a, c, d)
        bbIndices.push(a, c, b, a, d, c) // reversed winding
      }
    }

    const frontBodyGeom = new THREE.BufferGeometry()
    frontBodyGeom.setAttribute('position', new THREE.Float32BufferAttribute(fbPos, 3))
    frontBodyGeom.setAttribute('uv', new THREE.Float32BufferAttribute(fbUvs, 2))
    frontBodyGeom.setIndex(fbIndices)
    frontBodyGeom.computeVertexNormals()

    const backBodyGeom = new THREE.BufferGeometry()
    backBodyGeom.setAttribute('position', new THREE.Float32BufferAttribute(bbPos, 3))
    backBodyGeom.setAttribute('uv', new THREE.Float32BufferAttribute(bbUvs, 2))
    backBodyGeom.setIndex(bbIndices)
    backBodyGeom.computeVertexNormals()

    /* ── 2. Front Strip & Back Strip (from row jSplit to ny) ── */
    const fsPos: number[] = []
    const fsUvs: number[] = []
    const fsIndices: number[] = []

    const bsPos: number[] = []
    const bsUvs: number[] = []
    const bsIndices: number[] = []

    const stripRows = ny - jSplit

    for (let j = jSplit; j <= ny; j++) {
      const v = j / ny
      const y = (v - 0.5) * height
      for (let i = 0; i <= nx; i++) {
        const u = i / nx
        const x = (u - 0.5) * width
        const z = getPouchZ(u, v)

        fsPos.push(x, y, z)
        fsUvs.push(u, v)

        bsPos.push(x, y, -z)
        bsUvs.push(1.0 - u, v)
      }
    }

    for (let j = 0; j < stripRows; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i
        const b = j * (nx + 1) + i + 1
        const c = (j + 1) * (nx + 1) + i + 1
        const d = (j + 1) * (nx + 1) + i

        fsIndices.push(a, b, c, a, c, d)
        bsIndices.push(a, c, b, a, d, c)
      }
    }

    const frontStripGeom = new THREE.BufferGeometry()
    frontStripGeom.setAttribute('position', new THREE.Float32BufferAttribute(fsPos, 3))
    frontStripGeom.setAttribute('uv', new THREE.Float32BufferAttribute(fsUvs, 2))
    frontStripGeom.setIndex(fsIndices)
    frontStripGeom.computeVertexNormals()

    const backStripGeom = new THREE.BufferGeometry()
    backStripGeom.setAttribute('position', new THREE.Float32BufferAttribute(bsPos, 3))
    backStripGeom.setAttribute('uv', new THREE.Float32BufferAttribute(bsUvs, 2))
    backStripGeom.setIndex(bsIndices)
    backStripGeom.computeVertexNormals()

    /* ── 3. Body Rim (Left, Bottom, Right up to jSplit) ── */
    const bodyRimPos: number[] = []
    const bodyRimUvs: number[] = []
    const bodyRimIndices: number[] = []

    const bodyLoop: [number, number][] = []
    // Right edge going down
    for (let j = jSplit; j >= 0; j--) bodyLoop.push([1.0, j / ny])
    // Bottom edge
    for (let i = nx; i >= 0; i--) bodyLoop.push([i / nx, 0.0])
    // Left edge going up
    for (let j = 0; j <= jSplit; j++) bodyLoop.push([0.0, j / ny])

    for (let k = 0; k < bodyLoop.length; k++) {
      const [u, v] = bodyLoop[k]
      const x = (u - 0.5) * width
      const y = (v - 0.5) * height
      const z = getPouchZ(u, v)

      bodyRimPos.push(x, y, z)
      bodyRimPos.push(x, y, -z)
      bodyRimUvs.push(k / bodyLoop.length, 0.0)
      bodyRimUvs.push(k / bodyLoop.length, 1.0)
    }

    for (let k = 0; k < bodyLoop.length - 1; k++) {
      const vIdx = k * 2
      const nextVIdx = (k + 1) * 2
      bodyRimIndices.push(vIdx, nextVIdx, vIdx + 1)
      bodyRimIndices.push(nextVIdx, nextVIdx + 1, vIdx + 1)
    }

    const bodyRimGeom = new THREE.BufferGeometry()
    bodyRimGeom.setAttribute('position', new THREE.Float32BufferAttribute(bodyRimPos, 3))
    bodyRimGeom.setAttribute('uv', new THREE.Float32BufferAttribute(bodyRimUvs, 2))
    bodyRimGeom.setIndex(bodyRimIndices)
    bodyRimGeom.computeVertexNormals()

    /* ── 4. Strip Rim (Left, Top, Right above jSplit) ── */
    const stripRimPos: number[] = []
    const stripRimUvs: number[] = []
    const stripRimIndices: number[] = []

    const stripLoop: [number, number][] = []
    for (let j = jSplit; j <= ny; j++) stripLoop.push([0.0, j / ny])
    for (let i = 0; i <= nx; i++) stripLoop.push([i / nx, 1.0])
    for (let j = ny; j >= jSplit; j--) stripLoop.push([1.0, j / ny])

    for (let k = 0; k < stripLoop.length; k++) {
      const [u, v] = stripLoop[k]
      const x = (u - 0.5) * width
      const y = (v - 0.5) * height
      const z = getPouchZ(u, v)

      stripRimPos.push(x, y, z)
      stripRimPos.push(x, y, -z)
      stripRimUvs.push(k / stripLoop.length, 0.0)
      stripRimUvs.push(k / stripLoop.length, 1.0)
    }

    for (let k = 0; k < stripLoop.length - 1; k++) {
      const vIdx = k * 2
      const nextVIdx = (k + 1) * 2
      stripRimIndices.push(vIdx, nextVIdx, vIdx + 1)
      stripRimIndices.push(nextVIdx, nextVIdx + 1, vIdx + 1)
    }

    const stripRimGeom = new THREE.BufferGeometry()
    stripRimGeom.setAttribute('position', new THREE.Float32BufferAttribute(stripRimPos, 3))
    stripRimGeom.setAttribute('uv', new THREE.Float32BufferAttribute(stripRimUvs, 2))
    stripRimGeom.setIndex(stripRimIndices)
    stripRimGeom.computeVertexNormals()

    /* ── 5. Interior Foil Liner ── */
    const tearY = (splitRatio - 0.5) * height
    const linerGeom = new THREE.PlaneGeometry(width * 0.84, 0.8, 16, 8)
    linerGeom.translate(0, tearY - 0.35, -0.01)

    return {
      frontBodyGeom,
      backBodyGeom,
      frontStripGeom,
      backStripGeom,
      bodyRimGeom,
      stripRimGeom,
      linerGeom,
      jSplit,
      nx,
      ny,
      tearY,
      initialFrontPos: new Float32Array(fbPos),
    }
  }, [width, height, depth, nx, ny, splitRatio])
}


/* ══════════════════════ Floating Luminescent Sparkles / Glitter ══════════════════════ */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function useSparkleTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // 1. Soft radial spherical glow
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 31)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)')
    grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.25)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)

    // 2. Diamond sparkle cross flare
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(32, 10)
    ctx.lineTo(32, 54)
    ctx.moveTo(10, 32)
    ctx.lineTo(54, 32)
    ctx.stroke()

    // Diagonal subtle micro-rays
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
    ctx.lineWidth = 1.0
    ctx.beginPath()
    ctx.moveTo(21, 21)
    ctx.lineTo(43, 43)
    ctx.moveTo(43, 21)
    ctx.lineTo(21, 43)
    ctx.stroke()

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])
}

function FloatingTrichomes({ count = 65 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const sparkleTex = useSparkleTexture()

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#00FF88'), // Jelly Green
      new THREE.Color('#FF007F'), // Jelly Pink
      new THREE.Color('#00F0FF'), // Electric Cyan
      new THREE.Color('#FFD700'), // Gold Star
      new THREE.Color('#FFFFFF'), // Pure Diamond White
    ]

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 4 + 1)
      const r2 = pseudoRandom(i * 4 + 2)
      const r3 = pseudoRandom(i * 4 + 3)
      const r4 = pseudoRandom(i * 4 + 4)

      const radius = 1.3 + r1 * 2.4
      const angle = r2 * Math.PI * 2
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = (r3 - 0.5) * 3.8
      pos[i * 3 + 2] = Math.sin(angle) * radius

      const c = palette[Math.floor(r4 * palette.length)]
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }

    return { positions: pos, colors: cols }
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.04
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        map={sparkleTex || undefined}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* ══════════════════════ Pouch Mesh with Interactions & Tear Mechanics ══════════════════════ */
function PouchMesh({
  autoRotate = true,
  rotationSpeed = 0.65,
  scale = 0.85,
  isOpened = false,
  packState = 'IDLE',
  onToggleOpen,
}: {
  autoRotate?: boolean
  rotationSpeed?: number
  scale?: number
  isOpened?: boolean
  packState?: PackState
  onToggleOpen?: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const stripGroupRef = useRef<THREE.Group>(null)
  const laserBeamRef = useRef<THREE.Mesh>(null)

  const isDraggingRef = useRef(false)
  const lastPointerXRef = useRef(0)
  const velocityYRef = useRef(0)
  const dragDistanceRef = useRef(0)

  // Animated progress refs (starts at 1.0 if pack is already opened to avoid jump on navigation back)
  const openProgressRef = useRef(isOpened || packState === 'REVEAL' || packState === 'BURST' ? 1.0 : 0)

  const {
    frontBodyGeom,
    backBodyGeom,
    frontStripGeom,
    backStripGeom,
    bodyRimGeom,
    stripRimGeom,
    linerGeom,
    jSplit,
    nx,
    initialFrontPos,
  } = useSplitPouchGeometries(2.0, 2.46, 0.22)

  // Load textures
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null)
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/jelly/bolsa-cropped.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      setFrontTexture(tex)
    })
    loader.load('/jelly/bolsa-back.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      setBackTexture(tex)
    })
  }, [])

  // Pointer drag listeners
  const { gl } = useThree()

  useEffect(() => {
    const dom = gl.domElement

    const onDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      lastPointerXRef.current = e.clientX
      velocityYRef.current = 0
      dragDistanceRef.current = 0
    }

    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return
      const deltaX = e.clientX - lastPointerXRef.current
      lastPointerXRef.current = e.clientX
      dragDistanceRef.current += Math.abs(deltaX)
      groupRef.current.rotation.y += deltaX * 0.009
      velocityYRef.current = deltaX * 0.009
    }

    const onUp = () => {
      isDraggingRef.current = false
      // Click detection: if user tapped with barely any drag, trigger toggle open!
      if (dragDistanceRef.current < 5 && onToggleOpen) {
        onToggleOpen()
      }
    }

    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    return () => {
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [gl, onToggleOpen])

  // PBR Materials
  const frontBodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: frontTexture || undefined,
        color: frontTexture ? 0xffffff : 0x8a4ba0,
        metalness: 0.15,
        roughness: 0.24,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
        reflectivity: 0.8,
        sheen: 0.6,
        sheenColor: new THREE.Color('#d946ef'),
        transparent: true,
        side: THREE.FrontSide,
      }),
    [frontTexture]
  )

  const backBodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: backTexture || undefined,
        color: backTexture ? 0xffffff : 0x1f1929,
        metalness: 0.28,
        roughness: 0.32,
        clearcoat: 0.75,
        clearcoatRoughness: 0.18,
        reflectivity: 0.7,
        transparent: true,
        side: THREE.FrontSide,
      }),
    [backTexture]
  )

  const rimMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x221a2c,
        metalness: 0.45,
        roughness: 0.25,
        clearcoat: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  )

  // Tear Strip Materials (can fade out)
  const stripFrontMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: frontTexture || undefined,
        color: 0xffffff,
        metalness: 0.15,
        roughness: 0.24,
        clearcoat: 0.9,
        transparent: true,
        opacity: 1.0,
      }),
    [frontTexture]
  )

  const stripBackMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: backTexture || undefined,
        color: 0xffffff,
        metalness: 0.28,
        roughness: 0.32,
        clearcoat: 0.75,
        transparent: true,
        opacity: 1.0,
      }),
    [backTexture]
  )

  const linerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181320,
        metalness: 0.85,
        roughness: 0.22,
        side: THREE.DoubleSide,
      }),
    []
  )

  const laserMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#00FF88',
        transparent: true,
        opacity: 0,
      }),
    []
  )

  // Laser beam geometry (thin line along tear notch)
  const laserGeom = useMemo(() => new THREE.CylinderGeometry(0.012, 0.012, 2.05, 8), [])

  const frontMeshRef = useRef<THREE.Mesh>(null)
  const stripFrontMeshRef = useRef<THREE.Mesh>(null)
  const stripBackMeshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Auto rotate or drag inertia (only if not shaking in tension)
    if (isDraggingRef.current) {
      // drag active
    } else if (Math.abs(velocityYRef.current) > 0.0005) {
      groupRef.current.rotation.y += velocityYRef.current
      velocityYRef.current *= 0.92
    } else if (autoRotate && packState !== 'TENSION_SHAKE') {
      groupRef.current.rotation.y += delta * rotationSpeed
    }

    // Subtle pointer tilt
    const targetTiltX = -state.pointer.y * 0.18
    const targetTiltZ = -state.pointer.x * 0.12
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetTiltX, 0.05)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetTiltZ, 0.05)

    // 3D Gamified Pack Vibration / Shaking (Clash Royale / FIFA style)
    let shakeX = 0
    let shakeY = 0
    let shakeRotZ = 0
    if (packState === 'CHARGING') {
      const rumble = 0.018
      shakeX = (Math.random() - 0.5) * rumble
      shakeY = (Math.random() - 0.5) * rumble
    } else if (packState === 'TENSION_SHAKE') {
      const violentShake = 0.075
      shakeX = (Math.random() - 0.5) * violentShake
      shakeY = (Math.random() - 0.5) * violentShake
      shakeRotZ = (Math.random() - 0.5) * 0.14
    }

    groupRef.current.position.x = shakeX
    groupRef.current.position.y = shakeY
    groupRef.current.rotation.z += shakeRotZ

    // Transition for Rip & Open state
    const isPackOpen = packState === 'BURST' || packState === 'REVEAL' || isOpened
    const targetOpen = isPackOpen ? 1.0 : 0.0
    const dampRate = packState === 'BURST' ? 6.5 : 2.4
    openProgressRef.current = THREE.MathUtils.damp(openProgressRef.current, targetOpen, dampRate, delta)
    const p = openProgressRef.current

    /* ── A. Animate Mouth Opening (Vertex Displacement) ── */
    if (frontMeshRef.current) {
      const posAttr = frontMeshRef.current.geometry.attributes.position as THREE.BufferAttribute
      const mouthProgress = THREE.MathUtils.smoothstep(p, 0.12, 0.92)

      for (let i = 0; i <= nx; i++) {
        const u = i / nx
        const flex = Math.sin(u * Math.PI)
        const topIdx = (jSplit * (nx + 1) + i) * 3
        const midIdx = ((jSplit - 1) * (nx + 1) + i) * 3

        // Bow top lip forward in +Z and slightly down in -Y
        posAttr.array[topIdx + 2] = initialFrontPos[topIdx + 2] + mouthProgress * 0.30 * flex
        posAttr.array[topIdx + 1] = initialFrontPos[topIdx + 1] - mouthProgress * 0.04 * flex

        posAttr.array[midIdx + 2] = initialFrontPos[midIdx + 2] + mouthProgress * 0.15 * flex
      }
      posAttr.needsUpdate = true
      frontMeshRef.current.geometry.computeVertexNormals()
    }

    /* ── B. Animate Tear Strip (Ballistic Dislodgement & Fade) ── */
    if (stripGroupRef.current) {
      // Graceful slow-motion peeling arc path
      const peelEase = Math.pow(p, 1.15)
      stripGroupRef.current.position.x = peelEase * 2.5
      stripGroupRef.current.position.y = Math.sin(p * Math.PI) * 0.42 - Math.pow(p, 1.4) * 0.85
      stripGroupRef.current.position.z = peelEase * 0.55
      stripGroupRef.current.rotation.z = -Math.pow(p, 0.9) * 0.78
      stripGroupRef.current.rotation.y = p * 0.72

      // Strip opacity dissolves away smoothly only towards the end of the arc
      const stripOpacity = THREE.MathUtils.clamp(1.0 - THREE.MathUtils.smoothstep(p, 0.65, 1.0), 0, 1)
      if (stripFrontMeshRef.current) {
        const mat = stripFrontMeshRef.current.material as THREE.Material
        mat.opacity = stripOpacity
        mat.transparent = true
      }
      if (stripBackMeshRef.current) {
        const mat = stripBackMeshRef.current.material as THREE.Material
        mat.opacity = stripOpacity
        mat.transparent = true
      }
    }

    /* ── C. Animate Laser Beam Slice ── */
    if (laserBeamRef.current) {
      const mat = laserBeamRef.current.material as THREE.Material
      if (p > 0.01 && p < 0.48) {
        mat.opacity = Math.sin((p / 0.48) * Math.PI) * 0.95
        laserBeamRef.current.scale.set(1 + p * 1.8, 1, 1)
      } else {
        mat.opacity = 0
      }
    }
  })

  return (
    <Float speed={2.0} rotationIntensity={0.12} floatIntensity={0.35} floatingRange={[-0.06, 0.06]}>
      <group ref={groupRef} scale={scale}>
        {/* ── 1. Main Pouch Body ── */}
        <mesh ref={frontMeshRef} geometry={frontBodyGeom} material={frontBodyMaterial} />
        <mesh geometry={backBodyGeom} material={backBodyMaterial} />
        <mesh geometry={bodyRimGeom} material={rimMaterial} />

        {/* Interior Dark Foil Lining */}
        <mesh geometry={linerGeom} material={linerMaterial} />

        {/* Laser Cut Beam at the notch */}
        <mesh
          ref={laserBeamRef}
          geometry={laserGeom}
          material={laserMaterial}
          position={[0, 0.885, 0.02]}
          rotation={[0, 0, Math.PI / 2]}
        />

        {/* ── 2. The Tearable Top Strip ── */}
        <group ref={stripGroupRef}>
          <mesh ref={stripFrontMeshRef} geometry={frontStripGeom} material={stripFrontMaterial} />
          <mesh ref={stripBackMeshRef} geometry={backStripGeom} material={stripBackMaterial} />
          <mesh geometry={stripRimGeom} material={stripFrontMaterial} />
        </group>
      </group>
    </Float>
  )
}

/* ══════════════════════ Scene Lighting ══════════════════════ */
function PouchLighting({ glowColor = '#00FF88', packState = 'IDLE' }: { glowColor?: string; packState?: PackState }) {
  const lightRef = useRef<THREE.PointLight>(null)
  const flashLightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = state.pointer.x * 4
      lightRef.current.position.y = state.pointer.y * 3 + 0.5

      if (packState === 'TENSION_SHAKE') {
        lightRef.current.intensity = 2.0 + Math.random() * 3.0
      } else {
        lightRef.current.intensity = 1.5
      }
    }

    if (flashLightRef.current) {
      if (packState === 'BURST') {
        flashLightRef.current.intensity = 9.0
      } else {
        flashLightRef.current.intensity = THREE.MathUtils.lerp(flashLightRef.current.intensity, 0, 0.12)
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 5]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-4, 1, -2]} intensity={2.2} color={glowColor} />
      <directionalLight position={[4, 1, -2]} intensity={2.0} color="#D946EF" />
      <pointLight position={[0, -3, 2]} intensity={0.8} color="#A855F7" distance={6} />
      <pointLight ref={lightRef} position={[0, 0, 3.5]} intensity={1.5} color="#ffffff" distance={5} />
      <pointLight ref={flashLightRef} position={[0, 0.8, 2]} intensity={0} color="#ffffff" distance={10} />
    </>
  )
}

/* ══════════════════════ Main Exported 3D Component ══════════════════════ */
export default function JellyPouch3D({
  autoRotate = true,
  rotationSpeed = 0.65,
  glowColor = '#00FF88',
  scale = 0.85,
  isOpened = false,
  packState = 'IDLE',
  onToggleOpen,
}: JellyPouch3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <PouchLighting glowColor={glowColor} packState={packState} />
        <PouchMesh
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          scale={scale}
          isOpened={isOpened}
          packState={packState}
          onToggleOpen={onToggleOpen}
        />
        <FloatingTrichomes count={50} />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
