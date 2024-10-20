type SliderProps = {
    label: string;
    min: number;
    max: number;
    value: number;
    setValue: (value: number) => void;
    step?: number;
    disabled?: boolean;
}

export default function Slider(props: SliderProps) {
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 5,
                justifyContent: 'left'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    whiteSpace: 'nowrap'
                }}>
                    <div>{props.label}:</div>
                    <input 
                        disabled={props.disabled}
                        style={{ width: 60 }}
                        type="number" 
                        value={props.value} 
                        onChange={(e) => props.setValue(parseFloat(e.target.value))} />
                </div>
                <input
                    disabled={props.disabled}
                    type="range"
                    min={props.min}
                    max={props.max}
                    value={props.value}
                    step={props.step}
                    onChange={(e) => props.setValue(parseFloat(e.target.value))}
                />
            </div>
        </>
    )
    
}