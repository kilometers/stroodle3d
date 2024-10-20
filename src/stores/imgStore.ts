import { create } from 'zustand';

type ImgState = {
    img: string;
    setImg: (img: string) => void;
}

export const useImgStore = create<ImgState>((set) => ({
  img: '',
  setImg: (img: string) => set({ img }),
}));