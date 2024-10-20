import { useEffect, useRef } from 'react';
import { useMeshStore } from '../stores/threeStore';
import poly2tri from 'poly2tri';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function Delauney() {
    const { loops, scale } = useMeshStore();
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let outerLoop: poly2tri.Point[] = [];
        let holes: poly2tri.Point[][] = [];

        let greatestArea = 0;

        // console.log(loops);
        // Convert loops to poly2tri Points use new poly2tri.Point(x, y)
        // Also search for which loop is the outer loop (aka has the largest bounding box)
        loops.forEach((loop) => {
            let minX = loop.points[0].x;
            let maxX = loop.points[0].x;
            let minY = loop.points[0].y;
            let maxY = loop.points[0].y;

            let newContour: poly2tri.Point[] = [];
            for(let i = 0; i < loop.points.length; i++) {
                newContour.push(new poly2tri.Point(loop.points[i].x * scale, loop.points[i].y * scale));
                if(loop.points[i].x < minX) {
                    minX = loop.points[i].x;
                }
                if(loop.points[i].x > maxX) {
                    maxX = loop.points[i].x;
                }
                if(loop.points[i].y < minY) {
                    minY = loop.points[i].y;
                }
                if(loop.points[i].y > maxY) {
                    maxY = loop.points[i].y;
                }
            }

            if((maxX - minX) * (maxY - minY) > greatestArea) {
                greatestArea = (maxX - minX) * (maxY - minY);
                outerLoop = newContour;
            } else {
                holes.push(newContour);
            }

            // console.log(`outerLoop: ${outerLoop.length}   holes: ${holes.length}`);
        });

        if(outerLoop.length === 0) {
            return;
        }

        const swctx = new poly2tri.SweepContext(outerLoop);
        try {
            for(let i = 0; i < holes.length; i++) {
                swctx.addHole(holes[i]);
            }
            swctx.triangulate();
        }
        catch(e) {
            console.error(e);
        }

        if(mountRef.current === null) {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = -5;
        // camera.position.y = 5;
        
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        const vertices: number[] = [];
        const indices: number[] = [];
        swctx.getTriangles().forEach((triangle, i) => {
            triangle.getPoints().forEach((point) => {
                vertices.push(point.x);
                vertices.push(point.y);
                vertices.push(0);
            });
            indices.push(i * 3, i * 3 + 1, i * 3 + 2);
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);

        // Create wireframe geometry and material
        const wireframe = new THREE.WireframeGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        const line = new THREE.LineSegments(wireframe, lineMaterial);
        scene.add(line);

        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(line);
        const center = boundingBox.getCenter(new THREE.Vector3());
        line.rotateZ(Math.PI);
        line.translateX(-center.x);
        line.translateY(-center.y);

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if(mountRef.current !== null) {
                mountRef.current.removeChild(renderer.domElement);
                controls.dispose();
            }
        }

    });

    return (
        <div ref={mountRef} />
    );
}