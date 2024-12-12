import { Canvas, FabricObject } from 'fabric';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CanvasCurrentState {
  canvas: Canvas | null;
  setArtboardBoundary: (artboard: FabricObject) => void;
  artboardBoundary: FabricObject | null;
  setCanvas: (canvas: Canvas) => void;
}

export const useCanvasStore = create<CanvasCurrentState>()(
  devtools(
    (set) => ({
      canvas: null,
      setCanvas: (canvas: Canvas) => set({ canvas }),
      artboardBoundary: null,
      setArtboardBoundary: (artboard: FabricObject) =>
        set({ artboardBoundary: artboard }),
    }),
    { name: 'CanvasStore' }
  ) // Name for easier identification in the devtools
);
