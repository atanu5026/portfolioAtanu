import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, Environment, Float, Box, Text } from '@react-three/drei';
import { useIdentity } from '../context/IdentityContext';
import * as THREE from 'three';

const MatrixScreen = ({ color }) => {
  const [matrixText, setMatrixText] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      let lines = "";
      for (let i = 0; i < 8; i++) {
        let line = "";
        for (let j = 0; j < 12; j++) {
          line += Math.random() > 0.5 ? "1 " : "0 ";
        }
        lines += line + "\n";
      }
      setMatrixText(lines);
    }, 200); // Only update 5 times a second to prevent React lag

    return () => clearInterval(interval);
  }, []);

  return (
    <Text 
      color={color} 
      fontSize={0.12} 
      maxWidth={2.8}
      lineHeight={1.5}
      position={[0, 0, 0.12]}
      anchorX="center"
      anchorY="middle"
    >
      {matrixText}
    </Text>
  );
};

const DeveloperCore = ({ color }) => {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Terminal Screen Body */}
      <Box args={[3, 2, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Screen Display Area (Glass/Glow) */}
      <Box args={[2.8, 1.8, 0.05]} position={[0, 0, 0.08]}>
        <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={0.2} />
      </Box>
      
      {/* Matrix Text Effect */}
      <MatrixScreen color={color} />

      {/* Terminal Base/Stand */}
      <Box args={[1, 0.2, 0.5]} position={[0, -1.1, -0.2]}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </Box>
      <Box args={[1.5, 0.1, 1]} position={[0, -1.25, 0.2]}>
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </Box>
    </group>
  );
};

const EngineerCore = ({ color }) => {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Power Matrix Cage */}
      <Icosahedron args={[2, 1]}>
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} wireframe={true} />
      </Icosahedron>
      {/* Glowing Energy Core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </Sphere>
      {/* Outer Energy field */}
      <Icosahedron args={[2.2, 2]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} wireframe={true} transparent opacity={0.3} />
      </Icosahedron>
    </group>
  );
};

const InteractiveShape = ({ isEngineer, color }) => {
  const groupRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Continuous smooth revolution on the Y axis
      groupRef.current.rotation.y += delta * 0.5;
      
      // Smoothly tilt the entire group based on cursor
      const targetRotationX = mousePosition.current.y * 0.3;
      const targetRotationZ = -mousePosition.current.x * 0.3;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {isEngineer ? <EngineerCore color={color} /> : <DeveloperCore color={color} />}
      </group>
    </Float>
  );
};

const InteractiveHero3D = () => {
  const { identity } = useIdentity();
  const isEngineer = identity === 'engineering';
  
  // Use exact tailwind hex codes for exact matching
  const color = isEngineer ? '#f97316' : '#3b82f6';

  return (
    <div className="absolute right-0 -bottom-10 md:bottom-auto md:top-0 w-full md:w-1/2 h-[35vh] md:h-full z-0 pointer-events-none opacity-90">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={3} />
        <directionalLight position={[-10, -10, -10]} intensity={1} color={color} />
        <InteractiveShape color={color} isEngineer={isEngineer} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default InteractiveHero3D;
