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
    geometry: THREE.BufferGeometry | null;
    setGeometry: (geometry: THREE.BufferGeometry) => void;
    // setExtrudeGeometry: (geometry: THREE.ExtrudeGeometry) => void;
    // setLatheGeometry: (geometry: THREE.BufferGeometry) => void;
    showWireframe: boolean;
    setShowWireframe: (showWireframe: boolean) => void;
    extrusionMode: "extrude" | "lathe";
    setExtrusionMode: (extrusionMode: "extrude" | "lathe") => void;
    // Lathe settings
    latheSegments: number;
    setLatheSegments: (latheSegments: number) => void;
    latheRotation: number;
    setLatheRotation: (latheRotation: number) => void;
    latheXOffset: number;
    setLatheXOffset: (latheXOffset: number) => void;
}

export const useMeshStore = create<MeshStore>((set) => ({
    scale: 0.5,
    setScale: (scale: number) => set({ scale }),
    mesh: null,
    setMesh: (mesh: THREE.Mesh) => set({ mesh }),
    steps: 1,
    setSteps: (steps: number) => set({ steps }),
    depth: 5,
    setDepth: (depth: number) => set({ depth }),
    bevelEnabled: false,
    setBevelEnabled: (bevelEnabled: boolean) => set({ bevelEnabled }),
    bevelThickness: 0.7,
    setBevelThickness: (bevelThickness: number) => set({ bevelThickness }),
    bevelSize: 0.8,
    setBevelSize: (bevelSize: number) => set({ bevelSize }),
    bevelSegments: 1,
    setBevelSegments: (bevelSegments: number) => set({ bevelSegments }),
    bevelOffset: 0,
    setBevelOffset: (bevelOffset: number) => set({ bevelOffset }),
    geometry: null,
    setGeometry: (geometry: THREE.BufferGeometry) => set({ geometry }),
    // setExtrudeGeometry: (geometry: THREE.ExtrudeGeometry) => set({ geometry: { extrude: geometry, lathe: undefined } }),
    // setLatheGeometry: (geometry: THREE.BufferGeometry) => set({ geometry: { extrude: undefined, lathe: geometry } }),
    showWireframe: false,
    setShowWireframe: (showWireframe: boolean) => set({ showWireframe }),
    extrusionMode: "extrude",
    setExtrusionMode: (extrusionMode: "extrude" | "lathe") => set({ extrusionMode }),
    // Lathe settings
    latheSegments: 15,
    setLatheSegments: (latheSegments: number) => set({ latheSegments }),
    latheRotation: 360,
    setLatheRotation: (latheRotation: number) => set({ latheRotation }),
    latheXOffset: 0,
    setLatheXOffset: (latheXOffset: number) => set({ latheXOffset }),
}));