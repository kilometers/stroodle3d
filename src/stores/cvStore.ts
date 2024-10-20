import { MatVector } from '@techstark/opencv-js';
import { create } from 'zustand';

type CvState = {
    threshold: number;
    setThreshold: (threshold: number) => void;
    contours: MatVector | null;
    setContours: (contours: MatVector) => void;
    smoothing: number;
    setSmoothing: (smoothing: number) => void;
}

export const useCvStore = create<CvState>((set) => ({
    threshold: 127,
    setThreshold: (threshold: number) => set({ threshold }),
    contours: null,
    setContours: (contours: MatVector) => set({ contours }),
    smoothing: 0,
    setSmoothing: (smoothing: number) => set({ smoothing }),
}));