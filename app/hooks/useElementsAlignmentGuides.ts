import { useState, useCallback } from 'react';
import { Canvas, FabricObject, Line } from 'fabric';

const SNAP_THRESHOLD = 5;

export const useElementsAlignmentGuides = () => {
  const [guidelines, setGuidelines] = useState<FabricObject[]>([]);

  const clearElementsGuidelines = (canvas: Canvas) => {
    const objects = canvas.getObjects('line');
    objects.forEach((obj) => {
      if (
        (obj.id && obj.id.startsWith('vertical-elements-')) ||
        obj.id?.startsWith('horizontal-elements-')
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

  const createVerticalGuideline = (
    id: string,
    y1: number,
    y2: number,
    x: number
  ) => {
    return new Line([x, y1, x, y2], {
      id,
      stroke: 'green',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
      opacity: 0.8,
    });
  };

  const createHorizontalGuideline = (
    id: string,
    x1: number,
    x2: number,
    y: number
  ) => {
    return new Line([x1, y, x2, y], {
      id,
      stroke: 'black',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
      opacity: 0.8,
    });
  };

  const checkElementsGuidelines = useCallback(
    (canvas: Canvas, movingObj: FabricObject) => {
      const movingObjLeft = movingObj.left;
      const movingObjTop = movingObj.top;
      const movingObjRight = movingObjLeft + movingObj.width * movingObj.scaleX;
      const movingObjBottom =
        movingObjTop + movingObj.height * movingObj.scaleY;

      const movingObjCenterX =
        movingObjLeft + (movingObj.width * movingObj.scaleX) / 2;
      const movingObjCenterY =
        movingObjTop + (movingObj.height * movingObj.scaleY) / 2;

      let newGuidelines: Line[] = [];
      clearElementsGuidelines(canvas);

      let snapped = false;

      const canvasObjects = canvas.getObjects();

      //means only one object in canvas
      if (canvasObjects.length == 1) return;

      // horizontal snapping logic
      canvasObjects.forEach((obj) => {
        //Dont do anything if its the same object
        if (movingObj.id == obj.id) return;
        //Dont consider canvas guidelines or artboard
        if (
          (obj.id && obj.id.startsWith('vertical-canvas-')) ||
          obj.id?.startsWith('horizontal-canvas-') ||
          obj.id?.startsWith('artboard-')
        )
          return;

        const objCenterY = obj.top + (obj.height * obj.scaleX) / 2;
        const objCenterX = obj.left + (obj.width * obj.scaleY) / 2;

        //horizontally center aligned
        if (Math.abs(movingObjCenterY - objCenterY) < SNAP_THRESHOLD) {
          movingObj.set({
            top:
              obj.top +
              (obj.height * obj.scaleY) / 2 -
              (movingObj.height * movingObj.scaleY) / 2,
          });
          if (!guidelineExists(canvas, 'horizontal-elements-center')) {
            const line = createHorizontalGuideline(
              'horizontal-elements-center',
              movingObjCenterX,
              objCenterX,
              objCenterY
            );

            newGuidelines.push(line);
            canvas.add(line);
          }
          snapped = true;
        }

        //vertically center aligned
        if (Math.abs(movingObjCenterX - objCenterX) < SNAP_THRESHOLD) {
          movingObj.set({
            left:
              obj.left +
              (obj.width * obj.scaleX) / 2 -
              (movingObj.width * movingObj.scaleX) / 2,
          });
          if (!guidelineExists(canvas, 'vertical-elements-center')) {
            const line = createVerticalGuideline(
              'vertical-elements-center',
              movingObjCenterY,
              objCenterY,
              objCenterX
            );

            newGuidelines.push(line);
            canvas.add(line);
          }
          snapped = true;
        }

        //top aligned
        if (Math.abs(movingObjTop - obj.top) < SNAP_THRESHOLD) {
          movingObj.set({
            top: obj.top,
          });
          if (!guidelineExists(canvas, 'horizontal-elements-top')) {
            const line = createHorizontalGuideline(
              'horizontal-elements-top',
              movingObjLeft + (movingObj.width * movingObj.scaleX) / 2,
              obj.left + (obj.width * obj.scaleX) / 2,
              obj.top
            );

            newGuidelines.push(line);
            canvas.add(line);
          }
          snapped = true;
        }

        //bottom aligned
        if (
          Math.abs(movingObjBottom - (obj.top + obj.height * obj.scaleY)) <
          SNAP_THRESHOLD
        ) {
          movingObj.set({
            top:
              obj.top +
              obj.height * obj.scaleY -
              movingObj.height * movingObj.scaleY,
          });
          if (!guidelineExists(canvas, 'horizontal-elements-bottom')) {
            const line = createHorizontalGuideline(
              'horizontal-elements-bottom',
              movingObjLeft + (movingObj.width * movingObj.scaleX) / 2,
              obj.left + (obj.width * obj.scaleX) / 2,
              obj.top + obj.height * obj.scaleY
            );

            newGuidelines.push(line);
            canvas.add(line);
          }
          snapped = true;
        }

        //left aligned
        if (Math.abs(movingObjLeft - obj.left) < SNAP_THRESHOLD) {
          movingObj.set({
            left: obj.left,
          });
          if (!guidelineExists(canvas, 'vertical-elements-left')) {
            const line = createVerticalGuideline(
              'vertical-elements-left',
              movingObjCenterY,
              objCenterY,
              obj.left
            );

            newGuidelines.push(line);
            canvas.add(line);
          }
          snapped = true;
        }

        //right aligned
        if (
          Math.abs(movingObjRight - (obj.left + obj.width * obj.scaleX)) <
          SNAP_THRESHOLD
        ) {
          movingObj.set({
            left:
              obj.left +
              obj.width * obj.scaleX -
              movingObj.width * movingObj.scaleX,
          });
          if (!guidelineExists(canvas, 'vertical-elements-right')) {
            const line = createVerticalGuideline(
              'vertical-elements-right',
              movingObjCenterY,
              objCenterY,
              obj.left + obj.width * obj.scaleX
            );

            newGuidelines.push(line);
            canvas.add(line);
          }
          snapped = true;
        }
      });

      if (!snapped) {
        clearElementsGuidelines(canvas);
      } else {
        setGuidelines(newGuidelines);
      }
    },
    [
      clearElementsGuidelines,
      createHorizontalGuideline,
      createVerticalGuideline,
      guidelineExists,
    ]
  );

  return {
    guidelines,
    checkElementsGuidelines,
    clearElementsGuidelines,
  };
};

export const getObjectBounds = (obj: FabricObject) => {
  const bounds = obj.getBoundingRect();
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.left + bounds.width,
    bottom: bounds.top + bounds.height,
    centerX: bounds.left + bounds.width / 2,
    centerY: bounds.top + bounds.height / 2,
    width: bounds.width,
    height: bounds.height,
  };
};
