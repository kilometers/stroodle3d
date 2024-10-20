import { useCvStore } from '../stores/cvStore';
import { useMeshStore } from '../stores/meshStore';
import Slider from './Slider';

export default function MeshSettings() {
    const {threshold, setThreshold, smoothing, setSmoothing} = useCvStore();
    const { 
        scale, setScale, 
        bevelEnabled, setBevelEnabled,
        bevelThickness, setBevelThickness,
        bevelSize, setBevelSize,
        bevelSegments, setBevelSegments,
        bevelOffset, setBevelOffset,
        steps, setSteps,
        depth, setDepth
    } = useMeshStore();
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: 200,
            margin: 10
        }}>
            <Slider label="Threshold" min={0} max={255} value={threshold} setValue={setThreshold} />
            <Slider label="Smoothing" min={0.001} max={0.01} step={0.0001} value={smoothing} setValue={setSmoothing} />
            <Slider label="Scale" min={0.02} max={1} step={0.0001} value={scale} setValue={setScale} />
            <Slider label="Steps" min={1} max={10} value={steps} setValue={setSteps} />
            <Slider label="Depth" min={.4} max={50} step={0.01} value={depth} setValue={setDepth} />
            <div>Bevel Enabled
                <input
                    type="checkbox"
                    id="bevelEnabled"
                    checked={bevelEnabled}
                    onChange={(e) => setBevelEnabled(e.target.checked)}
                />
            </div>
            <Slider label="Bevel Thickness" disabled={!bevelEnabled} min={0.00} max={5} step={0.0001} value={bevelThickness} setValue={setBevelThickness} />
            <Slider label="Bevel Size" disabled={!bevelEnabled} min={0.01} max={5} step={0.0001} value={bevelSize} setValue={setBevelSize} />
            <Slider label="Bevel Segments" disabled={!bevelEnabled} min={1} max={10} value={bevelSegments} setValue={setBevelSegments} />
            <Slider label="Bevel Offset" disabled={!bevelEnabled} min={-3} max={3} step={0.0001} value={bevelOffset} setValue={setBevelOffset} />
        </div>
    );
}