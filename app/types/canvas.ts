import * as fabric from 'fabric';

export interface GuideLines {
  horizontal: number[];
  vertical: number[];
}

export interface AlignmentGuide {
  position: number;
  dimension: 'horizontal' | 'vertical';
}

export interface ObjectBounds {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}
