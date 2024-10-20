import { Slider, Typography } from '@mui/material';

type SliderProps = {
    label: string;
    min: number;
    max: number;
    value: number;
    setValue: (value: number) => void;
    step?: number;
    disabled?: boolean;
}

export default function RangeInput(props: SliderProps) {
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
                    <Typography variant='body1'>{props.label}</Typography>
                    <input 
                        disabled={props.disabled}
                        style={{ width: 60 }}
                        type="number" 
                        value={props.value} 
                        onChange={(e) => props.setValue(parseFloat(e.target.value))} />
                </div>
                <Slider 
                    disabled={props.disabled}
                    value={props.value}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    //@ts-expect-error
                    onChange={(e, value) => props.setValue(value as number)}
                />
            </div>
        </>
    )
    
}