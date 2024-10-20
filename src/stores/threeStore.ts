import { create } from 'zustand';
import * as THREE from 'three';

type MeshStore = {
    scale: number;
    setScale: (scale: number) => void;
    mesh: THREE.Mesh | null;
    setMesh: (mesh: THREE.Mesh) => void;
    steps: number;
    setSteps: (steps: number) => void;
    depth: number;
    setDepth: (depth: number) => void
    bevelEnabled: boolean;
    setBevelEnabled: (bevelEnabled: boolean) => void;
    bevelThickness: number;
    setBevelThickness: (bevelThickness: number) => void;
    bevelSize: number;
    setBevelSize: (bevelSize: number) => void;
    bevelSegments: number;
    setBevelSegments: (bevelSegments: number) => void;
    bevelOffset: number;
    setBevelOffset: (bevelOffset: number) => void;
    geometry: THREE.ExtrudeGeometry | null;
    setGeometry: (geometry: THREE.ExtrudeGeometry) => void;
    showWireframe: boolean;
    setShowWireframe: (showWireframe: boolean) => void;
}

export const useMeshStore = create<MeshStore>((set) => ({
    scale: 0.5,
    setScale: (scale: number) => set({ scale }),
    mesh: null,
    setMesh: (mesh: THREE.Mesh) => set({ mesh }),
    steps: 1,
    setSteps: (steps: number) => set({ steps }),
    depth: 1.5,
    setDepth: (depth: number) => set({ depth }),
    bevelEnabled: false,
    setBevelEnabled: (bevelEnabled: boolean) => set({ bevelEnabled }),
    bevelThickness: 0.2,
    setBevelThickness: (bevelThickness: number) => set({ bevelThickness }),
    bevelSize: 0.5,
    setBevelSize: (bevelSize: number) => set({ bevelSize }),
    bevelSegments: 1,
    setBevelSegments: (bevelSegments: number) => set({ bevelSegments }),
    bevelOffset: 0,
    setBevelOffset: (bevelOffset: number) => set({ bevelOffset }),
    geometry: null,
    setGeometry: (geometry: THREE.ExtrudeGeometry) => set({ geometry }),
    showWireframe: false,
    setShowWireframe: (showWireframe: boolean) => set({ showWireframe })
}));