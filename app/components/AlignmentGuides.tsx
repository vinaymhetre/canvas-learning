import React from 'react';
import { AlignmentGuide } from '~/types/canvas';

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({
  guides,
  canvasWidth,
  canvasHeight,
}) => {
  return (
    <div className='absolute inset-0 pointer-events-none'>
      {guides.map((guide, index) => {
        const style = {
          position: 'absolute' as const,
          backgroundColor: '#00ff00',
          ...(guide.dimension === 'horizontal'
            ? {
                top: `${guide.position}px`,
                left: 0,
                width: `${canvasWidth}px`,
                height: '1px',
              }
            : {
                top: 0,
                left: `${guide.position}px`,
                width: '1px',
                height: `${canvasHeight}px`,
              }),
        };

        return <div key={`${guide.dimension}-${index}`} style={style} />;
      })}
    </div>
  );
};
