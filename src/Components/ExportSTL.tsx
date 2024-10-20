import { STLExporter } from 'three/examples/jsm/Addons.js'
import { useMeshStore } from '../stores/meshStore';
import * as THREE from 'three';
import { Button } from '@mui/material'

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
            <Button 
                variant='contained'
                onClick={handleExportSTL}
                size='large'>
                    <b>Export STL</b>
            </Button>
        </div>
    )
}