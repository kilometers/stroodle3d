import { STLExporter } from 'three/examples/jsm/Addons.js'
import { useMeshStore } from '../stores/threeStore';
import * as THREE from 'three';

export default function ExportSTL() {
    const { geometry } = useMeshStore();

    const exporter = new STLExporter();
    const options = {
        binary: true
    }
    const handleExportSTL = () => {
        if(geometry) {
            const duplicate = geometry.clone();
            const stl = exporter.parse(new THREE.Mesh(duplicate), options);
            const blob = new Blob([stl], {type: 'application/octet-stream'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'model.stl';
            a.click();
        }
    }

    return (
        <div>
            <button onClick={handleExportSTL}>Export STL</button>
        </div>
    )
}