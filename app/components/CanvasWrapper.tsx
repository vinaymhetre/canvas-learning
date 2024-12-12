import { Canvas, Circle, Rect } from 'fabric';
import * as fabric from 'fabric';
import { useEffect, useRef, useState } from 'react';
import { useCanvasAlignmentGuides } from '~/hooks/useCanvasAlignmentGuides';
import { useElementsAlignmentGuides } from '~/hooks/useElementsAlignmentGuides';
import { useCanvasStore } from '~/stores/canvasStore';
import { useKeyboardShortcuts } from '~/hooks/useKeyboardShortcuts';
import {
  ARTBOARD_HEIGHT,
  ARTBOARD_LEFT,
  ARTBOARD_TOP,
  ARTBOARD_WIDTH,
} from '~/utils/constants';
import { moveToFront } from '~/utils/fabricHelpers';

const artboardOptions: Partial<fabric.RectProps> = {
  originX: 'left',
  originY: 'top',
  left: ARTBOARD_LEFT,
  top: ARTBOARD_TOP,
  width: ARTBOARD_WIDTH,
  height: ARTBOARD_HEIGHT,
  fill: '#fff',
  selectable: false,
  evented: false,
  absolutePositioned: true,
};

export default function CanvasWrapper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visibleRectRef = useRef<fabric.FabricObject | null>(null);

  const { canvas, setCanvas, setArtboardBoundary } = useCanvasStore();
  const { checkCanvasGuidelines, clearCanvasGuidelines } =
    useCanvasAlignmentGuides();

  const { checkElementsGuidelines, clearElementsGuidelines } =
    useElementsAlignmentGuides();

  const { handleKeyDown } = useKeyboardShortcuts();

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 1000,
        height: 1000,
        backgroundColor: 'transparent',
      });

      fabric.InteractiveFabricObject.ownDefaults = {
        ...fabric.InteractiveFabricObject.ownDefaults,
        transparentCorners: false,
        cornerStyle: 'circle',
        cornerSize: 12,
        cornerStrokeColor: '#fff',
        cornerColor: '#275DAD',
        borderColor: '#275DAD',
      };

      // Define the artboard boundary
      const artboardBoundary = new fabric.Rect({
        ...artboardOptions,
        id: 'artboard-lower',
      });
      initCanvas.add(artboardBoundary);
      setArtboardBoundary(artboardBoundary);

      const visibleRect = new fabric.Rect({
        ...artboardOptions,
        id: 'artboard-upper',
      });
      initCanvas.add(visibleRect);
      visibleRectRef.current = visibleRect;

      // Move the visible rectangle to front
      moveToFront(initCanvas, visibleRect);

      initCanvas.renderAll();

      if (visibleRectRef.current) {
        moveToFront(initCanvas, visibleRectRef.current);
      }

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas && canvasRef.current) {
      canvas.on('mouse:over', (e) => {
        if (canvas.getActiveObjects().length > 0) return;

        const target = e.target;
        if (!target) return;
        const bound = target.getBoundingRect();
        const ctx = canvas.getContext();
        ctx.strokeStyle = '#275DAD';
        ctx.strokeRect(bound.left, bound.top, bound.width, bound.height);
      });

      canvas.on('mouse:out', (e) => {
        if (canvas.getActiveObjects().length > 0) return;

        const target = e.target;
        if (!target) return;
        canvas.renderAll();
      });

      canvas.on('object:moving', (event) => {
        checkCanvasGuidelines(canvas, event.target);
        checkElementsGuidelines(canvas, event.target);
        // Event listener to ensure visible rectangle stays on top
        if (visibleRectRef.current) {
          moveToFront(canvas, visibleRectRef.current);
        }
      });

      canvas.on('object:modified', () => {
        clearCanvasGuidelines(canvas);
        clearElementsGuidelines(canvas);
      });

      //keyboard listener
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        canvas.off();
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [canvas, canvasRef]);

  return <canvas id='canvas' ref={canvasRef} className='' />;
}
