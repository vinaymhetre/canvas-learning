import { useCallback, useEffect } from 'react';
import * as fabric from 'fabric';
import { useCanvasStore } from '~/stores/canvasStore';

export const useKeyboardShortcuts = () => {
  const { canvas, setCanvas } = useCanvasStore();
  let clipboardData: fabric.FabricObject | null = null;

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (!canvas) return;
      const activeObject = canvas.getActiveObject();
      const activeObjectGroup = canvas.getActiveObjects();

      if (activeObject) {
        if (event.key == 'Delete' || event.key == 'Backspace') {
          if (activeObjectGroup.length > 1) {
            activeObjectGroup.forEach((obj) => {
              canvas.remove(obj);
            });
            canvas.discardActiveObject();
          } else {
            canvas.remove(activeObject);
          }

          canvas.requestRenderAll();
          setCanvas(canvas);
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
          clipboardData = await activeObject.clone();
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
          if (clipboardData) {
            const clonedObj = await clipboardData.clone();
            canvas.discardActiveObject();
            // Offset the paste by 20px to make it visible
            clonedObj.set({
              left: (clonedObj.left || 0) + 20,
              top: (clonedObj.top || 0) + 20,
              evented: true,
            });

            if (clonedObj instanceof fabric.ActiveSelection) {
              clonedObj.canvas = canvas;
              clonedObj.forEachObject((obj) => {
                canvas.add(obj);
              });
            } else {
              canvas.add(clonedObj);
            }

            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
            setCanvas(canvas);
          }
        }
      }
    },
    [canvas]
  );
  return { handleKeyDown };
};
