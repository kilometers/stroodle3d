import { useMeshStore } from '../stores/meshStore';

export default function ThreeViewOptions() {
    const { showWireframe, setShowWireframe } = useMeshStore();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontSize: 12,
        }}>
            <span style={{marginRight: 10, marginLeft: 10}}><i>1 Square = 10 Millimeters</i></span>
            <div>
                <input 
                    type="checkbox"
                    id="showWireframe"
                    checked={showWireframe}
                    onChange={(e) => setShowWireframe(e.target.checked)}
                />
                <label>Wireframe</label>
            </div>
        </div>
    )
}