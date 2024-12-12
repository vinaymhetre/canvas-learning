import {
  Circle as CircleIcon,
  Square as SquareIcon,
  Type as TypeIcon,
  Image as ImageIcon,
  TriangleRight as TriangleRightIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { useCanvasStore } from '~/stores/canvasStore';
import {
  Rect,
  Circle,
  Textbox,
  FabricImage,
  loadSVGFromURL,
  util,
} from 'fabric';
import { nanoid } from 'nanoid';
import { ARTBOARD_LEFT, ARTBOARD_TOP } from '~/utils/constants';

export default function Toolbar() {
  const { canvas, setCanvas, artboardBoundary } = useCanvasStore();

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        id: nanoid(),
        top: ARTBOARD_TOP + 100,
        left: ARTBOARD_LEFT + 50,
        width: 100,
        height: 60,
        fill: '#ae3421',
      });
      canvas.add(rect);
      if (artboardBoundary) rect.clipPath = artboardBoundary;
      canvas.setActiveObject(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        id: nanoid(),
        top: ARTBOARD_TOP + 100,
        left: ARTBOARD_LEFT + 50,
        radius: 60,
        fill: '#20A39E',
      });
      canvas.add(circle);
      if (artboardBoundary) circle.clipPath = artboardBoundary;

      canvas.setActiveObject(circle);
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new Textbox('This is a textbox', {
        id: nanoid(),
        top: ARTBOARD_TOP + 100,
        left: ARTBOARD_LEFT + 50,
        width: 200,
        fontSize: 24,
        fill: '#20A39E',
      });
      canvas.add(text);
      if (artboardBoundary) text.clipPath = artboardBoundary;

      canvas.setActiveObject(text);
    }
  };

  const addImage = async () => {
    if (canvas) {
      const newImg = await FabricImage.fromURL(
        'https://placehold.co/600x400',
        {},
        {
          id: nanoid(),
          left: ARTBOARD_LEFT + 100,
          top: ARTBOARD_TOP + 200,
          scaleX: 0.3,
          scaleY: 0.3,
        }
      );

      canvas.add(newImg);
      if (artboardBoundary) newImg.clipPath = artboardBoundary;

      canvas.setActiveObject(newImg);
    }
  };

  const addSVG = async () => {
    if (canvas) {
      const svg = await loadSVGFromURL('/trophy.svg');

      const obj = util.groupSVGElements(
        svg.objects.filter((o) => o !== null),
        { top: ARTBOARD_TOP + 100, left: ARTBOARD_LEFT + 200 }
      );

      const aspectRatio = obj.width / obj.height;
      obj.id = nanoid();
      obj.scaleToWidth(100);
      obj.scaleToHeight(100 * aspectRatio);

      canvas.add(obj);
      if (artboardBoundary) obj.clipPath = artboardBoundary;
      canvas.setActiveObject(obj);
    }
  };

  return (
    <div className='p-4 rounded-lg bg-white shadow flex flex-col items-center gap-4'>
      <Button type='button' size={'icon'} title='Squre' onClick={addRectangle}>
        <SquareIcon className='size-9 shrink-0' />
      </Button>
      <Button type='button' size={'icon'} title='Circle' onClick={addCircle}>
        <CircleIcon className='size-9 shrink-0' />
      </Button>
      <Button type='button' size={'icon'} title='Type' onClick={addText}>
        <TypeIcon className='size-9 shrink-0' />
      </Button>
      <Button type='button' size={'icon'} title='Image' onClick={addImage}>
        <ImageIcon className='size-9 shrink-0' />
      </Button>
      <Button type='button' size={'icon'} title='Shapes' onClick={addSVG}>
        <TriangleRightIcon className='size-9 shrink-0' />
      </Button>
    </div>
  );
}
