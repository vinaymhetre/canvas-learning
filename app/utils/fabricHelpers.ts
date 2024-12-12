import { Canvas, FabricObject } from 'fabric';

export const moveToFront = (canvas: Canvas, object: FabricObject) => {
  if (!canvas || !object) return;

  const objects = canvas.getObjects();
  const currentIndex = objects.indexOf(object);

  if (currentIndex > -1) {
    objects.splice(currentIndex, 1);
    objects.push(object);
    canvas.renderAll();
  }
};
