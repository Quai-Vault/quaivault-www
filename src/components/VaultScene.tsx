import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Subtle grid pattern - represents mathematical precision and structure
function GridPattern() {
  const gridRef = useRef<THREE.Group>(null)

  const lines = useMemo(() => {
    const positions: number[] = []
    const gridSize = 40
    const divisions = 20
    const step = gridSize / divisions

    // Horizontal lines
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      positions.push(-gridSize / 2, i * step, 0)
      positions.push(gridSize / 2, i * step, 0)
    }

    // Vertical lines
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      positions.push(i * step, -gridSize / 2, 0)
      positions.push(i * step, gridSize / 2, 0)
    }

    return new Float32Array(positions)
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(lines, 3))
    return geo
  }, [lines])

  useFrame((state) => {
    if (gridRef.current) {
      // Very subtle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.2) * 0.02
      gridRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <group ref={gridRef} position={[0, 0, -25]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#dc2626" transparent opacity={0.08} />
      </lineSegments>
    </group>
  )
}

// Slowly rotating geometric solid - represents cryptographic strength
function CryptoSolid({
  position,
  rotationSpeed,
  size,
  opacity
}: {
  position: [number, number, number]
  rotationSpeed: number
  size: number
  opacity: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (meshRef.current && edgesRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
      edgesRef.current.rotation.x = meshRef.current.rotation.x
      edgesRef.current.rotation.y = meshRef.current.rotation.y
    }
  })

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(size, 0), [size])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  return (
    <group position={position}>
      {/* Solid fill - very subtle */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color="#dc2626"
          transparent
          opacity={opacity * 0.15}
        />
      </mesh>
      {/* Wireframe edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#dc2626" transparent opacity={opacity} />
      </lineSegments>
    </group>
  )
}

// Floating hash blocks - represents data integrity
function HashBlocks() {
  const groupRef = useRef<THREE.Group>(null)

  const blocks = useMemo(() => {
    const items: { x: number; y: number; z: number; size: number; delay: number }[] = []
    // Create a sparse, asymmetric arrangement
    const positions = [
      { x: -8, y: 4, z: -12 },
      { x: 10, y: -3, z: -15 },
      { x: -5, y: -6, z: -10 },
      { x: 7, y: 6, z: -18 },
      { x: -12, y: -2, z: -14 },
      { x: 3, y: 8, z: -16 },
    ]

    positions.forEach((pos, i) => {
      items.push({
        ...pos,
        size: 0.3 + (i % 3) * 0.15,
        delay: i * 0.5,
      })
    })
    return items
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow drift
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {blocks.map((block, i) => (
        <HashBlock key={i} {...block} />
      ))}
    </group>
  )
}

function HashBlock({ x, y, z, size, delay }: {
  x: number; y: number; z: number; size: number; delay: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (meshRef.current && edgesRef.current) {
      // Gentle floating motion
      const floatY = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.3
      meshRef.current.position.y = y + floatY
      edgesRef.current.position.y = y + floatY

      // Slow rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
      edgesRef.current.rotation.x = meshRef.current.rotation.x
      edgesRef.current.rotation.y = meshRef.current.rotation.y
    }
  })

  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  return (
    <group position={[x, y, z]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial color="#dc2626" transparent opacity={0.08} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#dc2626" transparent opacity={0.25} />
      </lineSegments>
    </group>
  )
}

// Central geometric form - the "vault" concept
function VaultCore() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Slow, steady rotation - stability
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  const dodecahedron = useMemo(() => new THREE.DodecahedronGeometry(2, 0), [])
  const dodecahedronEdges = useMemo(() => new THREE.EdgesGeometry(dodecahedron), [dodecahedron])

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {/* Inner solid - subtle fill */}
      <mesh ref={innerRef} geometry={dodecahedron}>
        <meshBasicMaterial
          color="#dc2626"
          transparent
          opacity={0.06}
        />
      </mesh>
      {/* Outer wireframe - the structure */}
      <lineSegments ref={outerRef} geometry={dodecahedronEdges}>
        <lineBasicMaterial color="#dc2626" transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

// Minimal scene composition
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />

      {/* Background grid - mathematical foundation */}
      <GridPattern />

      {/* Central vault form */}
      <VaultCore />

      {/* Orbiting geometric solids - cryptographic strength */}
      <CryptoSolid position={[-6, 3, -12]} rotationSpeed={0.15} size={0.8} opacity={0.2} />
      <CryptoSolid position={[7, -2, -14]} rotationSpeed={0.12} size={1} opacity={0.18} />
      <CryptoSolid position={[-4, -5, -10]} rotationSpeed={0.18} size={0.6} opacity={0.22} />

      {/* Floating hash blocks - data integrity */}
      <HashBlocks />
    </>
  )
}

export default function VaultScene() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
