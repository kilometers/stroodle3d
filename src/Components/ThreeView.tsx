import { useEffect, useRef, useState } from 'react';
import { useMeshStore } from '../stores/threeStore';
import * as THREE from 'three';
import { useCvStore } from '../stores/cvStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import WireframeMesh from './ExtrudeMesh';

export default function Three() {
    const { geometry, setGeometry, showWireframe,
        scale, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelSegments, bevelOffset
    } = useMeshStore();
    const { contours } = useCvStore();
    const [initialized, setInitialized] = useState(false);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera (90, 1, 0.1, 1000));

    useEffect(() => {
        if(!initialized) {
            camera.position.set(-40, 30, 100);
            setInitialized(true);
        }

        let outerLoop: THREE.Vector2[] = [];
        let holes: THREE.Vector2[][] = [];

        let greatestArea = 0;

        if(contours === null) {
            return;
        }
        // Convert loops to THREE.js Vector2 arrays
        // Also search for which loop is the outer loop (aka has the largest bounding box)
        for (let c = 0; c < contours.size(); c++) {
            let minX = contours.get(c).data32S[0];
            let maxX = contours.get(c).data32S[0];
            let minY = contours.get(c).data32S[1];
            let maxY = contours.get(c).data32S[1];

            let newContour: THREE.Vector2[] = [];
            for(let i = 0; i < contours.get(c).size().height; i++) {
                let x = contours.get(c).data32S[i * 2];
                let y = contours.get(c).data32S[i * 2 + 1];
                newContour.push(new THREE.Vector2(x * scale, y * scale));
                if(x < minX) {
                    minX = x;
                }
                if(x > maxX) {
                    maxX = x;
                }
                if(y < minY) {
                    minY = y;
                }
                if(y > maxY) {
                    maxY = y;
                }
            }

            if((maxX - minX) * (maxY - minY) > greatestArea) {
                greatestArea = (maxX - minX) * (maxY - minY);
                if(outerLoop.length > 0) {
                    holes.push(outerLoop);
                }
                outerLoop = newContour;
            } else {
                holes.push(newContour);
            }
        };

        if(outerLoop.length === 0) {
            return;
        }
        
        try {
            const shape = new THREE.Shape(outerLoop);
            for(let i = 0; i < holes.length; i++) {
                shape.holes.push(new THREE.Shape(holes[i]));
            }

            const extrudeSettings = {
                depth: depth,
                steps: steps,
                bevelEnabled: bevelEnabled,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelSegments: bevelSegments,
                bevelOffset: bevelOffset
            };

            const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            extrudeGeometry.rotateZ(Math.PI);
            const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(extrudeGeometry));
            const center = boundingBox.getCenter(new THREE.Vector3());
            const zOffset = depth / 2 + (bevelEnabled ? bevelThickness : 0);
            extrudeGeometry.translate(-center.x, -center.y, -center.z + zOffset);
            setGeometry(extrudeGeometry);
        }
        catch(e) {
            console.error(e);
        }

    }, [scale, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelSegments, bevelOffset, contours]);

    return (
        <Canvas camera={camera}>
            <ambientLight intensity={0.5}/>
            <pointLight position={[100, 100, -100]}intensity={30000}  />
            <pointLight position={[100, 100, 100]}intensity={50000}  />
            <pointLight position={[-100, -100, -100]}intensity={10000}  />
            {showWireframe ? 
                <WireframeMesh geometry={geometry ? geometry : undefined} />
                :
                <mesh geometry={geometry ? geometry : undefined}>
                    <meshStandardMaterial opacity={0.01}/>
                </mesh>
            }
            {/* <mesh geometry={geometry ? geometry : undefined}>
                <meshPhongMaterial opacity={0.3} transparent={true}/>
            </mesh>
            <WireframeMesh geometry={geometry ? geometry : undefined} /> */}
            <OrbitControls enableDamping={false}/>
            <gridHelper rotation-x={Math.PI / 2} scale={10} />
        </Canvas>
    );
}