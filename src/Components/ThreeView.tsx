import { useEffect, useState } from 'react';
import { useMeshStore } from '../stores/meshStore';
import * as THREE from 'three';
import { useCvStore } from '../stores/cvStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import WireframeMesh from './WireframeMesh';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export default function Three() {
    const { geometry, setGeometry, showWireframe, extrusionMode,
        scale, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelSegments, bevelOffset,
        latheSegments, latheRotation, latheXOffset
    } = useMeshStore();
    const { contours } = useCvStore();
    const [initialized, setInitialized] = useState(false);
    const [camera] = useState<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera (90, 1, 0.1, 1000));

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

                let contourSize = contours.get(c).size().height; // Total pairs of (x, y)
                let prevX = contours.get(c).data32S[((i - 1 + contourSize) % contourSize) * 2];
                let prevY = contours.get(c).data32S[((i - 1 + contourSize) % contourSize) * 2 + 1];
                let nextX = contours.get(c).data32S[((i + 1) % contourSize) * 2];
                let nextY = contours.get(c).data32S[((i + 1) % contourSize) * 2 + 1];

                let xAvg = (prevX + nextX) / 2;
                let yAvg = (prevY + nextY) / 2;

                let xDiff = x - xAvg;
                let yDiff = y - yAvg;

                let k = 0.01;
                let xFactor = 0.5 / (1 + k * Math.abs(xDiff));
                let yFactor = 0.5 / (1 + k * Math.abs(yDiff));

                let xSmooth = x - xDiff * xFactor + (extrusionMode === "lathe" ? latheXOffset : 0);
                let ySmooth = y - yDiff * yFactor + (extrusionMode === "lathe" ? latheXOffset : 0);

                newContour.push(new THREE.Vector2(xSmooth * scale, ySmooth * scale));
                
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
            if(extrusionMode === "lathe") {
                const steps = latheSegments + 1;
                const angleStep = (2 * Math.PI) / (steps - 1) * (latheRotation / 360);

                // calculate external geometry
                const { vertices: externalVertices, faces: externalFaces } = loopToLatheVertices(outerLoop, steps, angleStep, latheRotation);
                const externalGeometry = generateGeometry(externalVertices, externalFaces);

                // calculate the hole geometries
                let holeGeometry = [];
                for (let i = 0; i < holes.length; i++) {
                    const { vertices: holeVertices, faces: holeFaces } = loopToLatheVertices(holes[i], steps, angleStep, latheRotation, true);
                    holeGeometry.push(generateGeometry(holeVertices, holeFaces));
                }

                // calculate endcap geometry
                let endcapGeometry = [];
                if(latheRotation < 360) {
                    const shape = new THREE.Shape(outerLoop);
                    for(let i = 0; i < holes.length; i++) {
                        shape.holes.push(new THREE.Shape(holes[i]));
                    }

                    const geometry = new THREE.ShapeGeometry(shape);
                    const rotatedGeometry = new THREE.ShapeGeometry(shape);
                    rotatedGeometry.rotateY(-(steps - 1) * angleStep);
                    const index = geometry.getIndex();
                    if (index) {
                        for (let i = 0; i < index.count; i += 3) {
                            // Reverse indices
                            const a = index.getX(i);
                            const b = index.getX(i + 1);
                            const c = index.getX(i + 2);
                            
                            index.setX(i, c);
                            index.setX(i + 1, b);
                            index.setX(i + 2, a);
                        }
                    } else {
                        // Handle non-indexed geometry if necessary
                    }
                    geometry.deleteAttribute('uv');
                    rotatedGeometry.deleteAttribute('uv');
                    // geometry.computeVertexNormals();
                    endcapGeometry.push(BufferGeometryUtils.mergeGeometries([geometry, rotatedGeometry]));
                }

                const mergedGeometry = BufferGeometryUtils.mergeGeometries([externalGeometry, ...holeGeometry, ...endcapGeometry]);

                mergedGeometry.rotateZ(Math.PI);
                mergedGeometry.rotateY(Math.PI);
                const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(mergedGeometry));
                const center = boundingBox.getCenter(new THREE.Vector3());
                const zOffset = depth / 2 + (bevelEnabled ? bevelThickness : 0);
                mergedGeometry.translate(-center.x, -center.y, -center.z + zOffset);
                setGeometry(mergedGeometry);
            }
            else {
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
                extrudeGeometry.rotateY(Math.PI);
                const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(extrudeGeometry));
                const center = boundingBox.getCenter(new THREE.Vector3());
                const zOffset = depth / 2 + (bevelEnabled ? bevelThickness : 0);
                extrudeGeometry.translate(-center.x, -center.y, -center.z + zOffset);
                setGeometry(extrudeGeometry);
            }
        }
        catch(e) {
            console.error(e);
        }

    }, [scale, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelSegments, bevelOffset, contours, latheRotation, latheSegments, latheXOffset]);

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
                    <meshStandardMaterial/>
                </mesh>
            }
            <OrbitControls enableDamping={false}/>
            <gridHelper rotation-x={Math.PI / 2} scale={10} />
        </Canvas>
    );
}

const loopToLatheVertices = (
    loop: THREE.Vector2[],
    steps: number,
    angleStep: number,
    rotation: number, 
    invert?: boolean) => {
    
    let vertices = [];
    let faces = [];

    invert = invert === undefined ? true : invert;

    for (let i = 0; i < steps; i++) {
        const angle = i * angleStep;
        for (const point of loop) {
            // Calculate rotated position
            const x = (point.x) * Math.cos(angle);
            const z = (point.x) * Math.sin(angle);
            vertices.push(new THREE.Vector3(x, point.y, z));
        }
        let loopLength = loop.length;
        for (let j = 0; j < loopLength; j++) {
            
            if(rotation === 360 || i !== steps - 1) {
                let a = j + loopLength * i;
                let b = j + loopLength * ((i + 1) % steps);
                let c = (j + 1) % loopLength + loopLength * i;
                let d = (j + 1) % loopLength + loopLength * ((i + 1) % steps);
                
                if(!invert) {
                    faces.push(a, b, c); // Triangle 1
                    faces.push(c, b, d); // Triangle 2
                } else {
                    faces.push(d, b, a); // Triangle 1
                    faces.push(c, d, a); // Triangle 2
                }
            }
        }    
    }
    return { vertices, faces };
}

const generateGeometry = (vertices: THREE.Vector3[], faces: number[]) => {
    const positions = new Float32Array(vertices.length * 3);
    vertices.forEach((v, i) => {
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
    });

    const indices = new Uint16Array(faces);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
}