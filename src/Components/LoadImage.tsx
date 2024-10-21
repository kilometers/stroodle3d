import { Button } from '@mui/material';
import { useImgStore } from '../stores/imgStore';
import React from 'react';

export default function LoadImage() {
    const {setImg} = useImgStore();
    const fileSelectRef = React.useRef<HTMLInputElement>(null);

    const handleSelectImage = () => {
        if(fileSelectRef.current) {
            fileSelectRef.current.click();
        }
    }
    
    return (
        <div>
            <Button onClick={handleSelectImage} variant='contained'>Select Image</Button>
            <input
                type="file"
                ref={fileSelectRef}
                style={{display: 'none'}}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            setImg(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
        </div>
    );
}