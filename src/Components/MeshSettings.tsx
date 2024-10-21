import { useCvStore } from '../stores/cvStore';
import { useMeshStore } from '../stores/meshStore';
import RangeInput from './Slider';
import { Checkbox, Typography, Card } from '@mui/material';
import { pink } from '@mui/material/colors';

export default function MeshSettings() {
    const {threshold, setThreshold, smoothing, setSmoothing, blur, setBlur} = useCvStore();
    const { 
        scale, setScale, 
        bevelEnabled, setBevelEnabled,
        bevelThickness, setBevelThickness,
        bevelSize, setBevelSize,
        bevelSegments, setBevelSegments,
        bevelOffset, setBevelOffset,
        depth, setDepth,
        extrusionMode
    } = useMeshStore();
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: 200,
            margin: 10
        }}>
            <RangeInput label="Threshold" min={0} max={255} value={threshold} setValue={setThreshold} />
            <RangeInput label="Blend" min={1} max={20} step={1} value={blur} setValue={setBlur} />
            <RangeInput label="Simplify" min={0} max={0.01} step={0.0001} value={smoothing} setValue={setSmoothing} />
            <RangeInput label="Scale" min={0.02} max={1} step={0.0001} value={scale} setValue={setScale} />
            {/* <RangeInput label="Steps" min={1} max={10} value={steps} setValue={setSteps} /> */}
            <RangeInput label="Depth (mm)" min={.4} max={50} step={0.01} value={depth} setValue={setDepth} />
            {extrusionMode === "extrude" && <Card style={{
                padding: 15,
                backgroundColor: bevelEnabled ? pink[900] : 'lightgrey',
                color: bevelEnabled ? 'white' : 'black',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography>Bevel {bevelEnabled ? "On" : "Off"}</Typography>
                    <Checkbox
                        checked={bevelEnabled}
                        onChange={(e) => setBevelEnabled(e.target.checked)}
                    />
                </div>
                <RangeInput label="Thickness" disabled={!bevelEnabled} min={0.00} max={5} step={0.0001} value={bevelThickness} setValue={setBevelThickness} />
                <RangeInput label="Size" disabled={!bevelEnabled} min={0.01} max={5} step={0.0001} value={bevelSize} setValue={setBevelSize} />
                <RangeInput label="Segments" disabled={!bevelEnabled} min={1} max={10} value={bevelSegments} setValue={setBevelSegments} />
                <RangeInput label="Offset" disabled={!bevelEnabled} min={-3} max={3} step={0.0001} value={bevelOffset} setValue={setBevelOffset} />
        
            </Card>}
            {extrusionMode === "lathe" && "Coming soon"}
        </div>
    );
}