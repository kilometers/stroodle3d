import { useImgStore } from '../stores/imgStore';

export default function LoadImage() {
    const {img, setImg} = useImgStore();
    
    return (
        <div>
        <input
            type="file"
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