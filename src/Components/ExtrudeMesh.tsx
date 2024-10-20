import React from 'react';
import * as THREE from 'three';

export default function WireframeMesh(props: {geometry: THREE.ExtrudeGeometry | undefined}) {    

    const wireframe = React.useMemo(() => {
        return new THREE.WireframeGeometry(props.geometry);
    }, [props.geometry]);

    return (
        <lineSegments geometry={wireframe}>
          <lineBasicMaterial color={0xff00ff} />
        </lineSegments>
    );
}