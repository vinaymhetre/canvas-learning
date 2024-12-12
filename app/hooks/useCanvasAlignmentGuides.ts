import { useState, useCallback } from 'react';
import { Canvas, FabricObject, Line } from 'fabric';
import { useCanvasStore } from '~/stores/canvasStore';

const SNAP_THRESHOLD = 10;

export const useCanvasAlignmentGuides = () => {
  const [guidelines, setGuidelines] = useState<FabricObject[]>([]);
  const { artboardBoundary } = useCanvasStore();
  const clearCanvasGuidelines = (canvas: Canvas) => {
    const objects = canvas.getObjects('line');
    objects.forEach((obj) => {
      if (
        (obj.id && obj.id.startsWith('vertical-canvas-')) ||
        obj.id?.startsWith('horizontal-canvas-')
      ) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
    setGuidelines([]);
  };

  const guidelineExists = (canvas: Canvas, id: string) => {
    const objects = canvas.getObjects('line');
    return objects.some((obj) => obj.id === id);
  };

  const createVerticalGuideline = (canvas: Canvas, x: number, id: string) => {
    const y1 = artboardBoundary?.top || 0;
    const y2 =
      (artboardBoundary?.top || 0) +
      (artboardBoundary?.height || canvas.height);
    return new Line([x, y1, x, y2], {
      id,
      stroke: 'red',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: 0.8,
    });
  };

  const createHorizontalGuideline = (canvas: Canvas, y: number, id: string) => {
    const x1 = artboardBoundary?.left || 0;
    const x2 =
      (artboardBoundary?.left || 0) + (artboardBoundary?.width || canvas.width);

    return new Line([x1, y, x2, y], {
      id,
      stroke: 'red',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: 0.8,
    });
  };

  const checkCanvasGuidelines = useCallback(
    (canvas: Canvas, obj: FabricObject) => {
      if (!artboardBoundary) return;

      const artboardWidth = artboardBoundary.width * artboardBoundary.scaleX;
      const artboardHeight = artboardBoundary.height * artboardBoundary.scaleY;

      const left = obj.left;
      const top = obj.top;
      const right = left + obj.width * obj.scaleX;
      const bottom = top + obj.height * obj.scaleY;

      const artboardRight =
        artboardBoundary.left +
        +artboardBoundary.width * artboardBoundary.scaleX;
      const artboardBottom =
        artboardBoundary.top +
        +artboardBoundary.height * artboardBoundary.scaleY;

      const centerX = left + (obj.width * obj.scaleX) / 2;
      const centerY = top + (obj.height * obj.scaleY) / 2;

      let newGuidelines = [];
      clearCanvasGuidelines(canvas);

      let snapped = false;

      // Vertical snapping logic
      if (Math.abs(left - artboardBoundary.left) < SNAP_THRESHOLD) {
        obj.set({ left: artboardBoundary.left });
        if (!guidelineExists(canvas, 'vertical-canvas-left')) {
          const line = createVerticalGuideline(
            canvas,
            artboardBoundary.left,
            'vertical-canvas-left'
          );
          newGuidelines.push(line);
          canvas.add(line);
        }
        snapped = true;
      }

      if (Math.abs(right - artboardRight) < SNAP_THRESHOLD) {
        obj.set({ left: artboardRight - obj.width * obj.scaleX });
        if (!guidelineExists(canvas, 'vertical-canvas-right')) {
          const line = createVerticalGuideline(
            canvas,
            artboardRight,
            'vertical-canvas-right'
          );
          newGuidelines.push(line);
          canvas.add(line);
        }
        snapped = true;
      }

      if (
        Math.abs(centerX - (artboardBoundary.left + artboardWidth / 2)) <
        SNAP_THRESHOLD
      ) {
        obj.set({
          left:
            artboardBoundary.left +
            artboardWidth / 2 -
            (obj.width * obj.scaleX) / 2,
        });
        if (!guidelineExists(canvas, 'vertical-canvas-center')) {
          const line = createVerticalGuideline(
            canvas,
            artboardBoundary.left + artboardWidth / 2,
            'vertical-canvas-center'
          );
          newGuidelines.push(line);
          canvas.add(line);
        }
        snapped = true;
      }

      // Horizontal snapping logic
      if (Math.abs(top - artboardBoundary.top) < SNAP_THRESHOLD) {
        obj.set({ top: artboardBoundary.top });
        if (!guidelineExists(canvas, 'horizontal-canvas-top')) {
          const line = createHorizontalGuideline(
            canvas,
            artboardBoundary.top,
            'horizontal-canvas-top'
          );
          newGuidelines.push(line);
          canvas.add(line);
        }
        snapped = true;
      }

      if (Math.abs(bottom - artboardBottom) < SNAP_THRESHOLD) {
        obj.set({ top: artboardBottom - obj.height * obj.scaleY });
        if (!guidelineExists(canvas, 'horizontal-canvas-bottom')) {
          const line = createHorizontalGuideline(
            canvas,
            artboardBottom,
            'horizontal-canvas-bottom'
          );
          newGuidelines.push(line);
          canvas.add(line);
        }
        snapped = true;
      }

      if (
        Math.abs(centerY - (artboardBoundary.top + artboardHeight / 2)) <
        SNAP_THRESHOLD
      ) {
        obj.set({
          top:
            artboardBoundary.top +
            artboardHeight / 2 -
            (obj.height * obj.scaleY) / 2,
        });

        if (!guidelineExists(canvas, 'horizontal-canvas-center')) {
          const line = createHorizontalGuideline(
            canvas,
            artboardBoundary.top + artboardHeight / 2,
            'horizontal-canvas-center'
          );
          newGuidelines.push(line);
          canvas.add(line);
        }
        snapped = true;
      }

      if (!snapped) {
        clearCanvasGuidelines(canvas);
      } else {
        setGuidelines(newGuidelines);
      }
    },
    [
      clearCanvasGuidelines,
      createHorizontalGuideline,
      createVerticalGuideline,
      guidelineExists,
    ]
  );

  return {
    guidelines,
    checkCanvasGuidelines,
    clearCanvasGuidelines,
  };
};
