import { min, max } from 'd3-array';
import { isNumber } from 'lodash-es';

/**
 * Gets the min/max values handling nested arrays.
 */
export function extent(data: any[], attr: string): number[] {
  const accessor = (val, fn) => {
    if (Array.isArray(val.data)) {
      return fn(val.data, vv => vv[attr]);
    }
    return val[attr];
  };

  const minVal = min(data, d => accessor(d, min));
  const maxVal = max(data, d => accessor(d, max));

  return [minVal, maxVal];
}

/**
 * Get the domain for the Y Axis.
 */
export function getYDomain({ scaled = false, data }): number[] {
  const [startY, endY] = extent(data, 'y');
  const [startY1, endY1] = extent(data, 'y1');

  // If dealing w/ negative numbers, we should
  // normalize the top and bottom values
  if (startY < 0) {
    const posStart = -startY;
    const maxNum = Math.max(posStart, endY);

    return [-maxNum, maxNum];
  }

  // Scaled start scale at non-zero
  if (scaled) {
    return [startY1, endY1];
  }

  // Start at 0 based
  return [0, endY1];
}

/**
 * Get the domain for the X Axis.
 */
export function getXDomain({ data, scaled = false }): number[] {
  const [startX, endX] = extent(data, 'x');
  const [startX0, endX0] = extent(data, 'x0');

  // Histograms use dates for start/end
  if (isNumber(startX) && isNumber(endX)) {
    // If dealing w/ negative numbers, we should
    // normalize the top and bottom values
    if (startX0 < 0) {
      const posStart = -startX0;
      const maxNum = Math.max(posStart, endX0);

      return [-maxNum, maxNum];
    }

    // If not scaled, return 0/max domains
    if (!scaled) {
      return [0, endX];
    }
  }

  // Scaled start scale at non-zero
  return [startX, endX];
}