import {chunk, flatten, get, sortBy, reverse} from 'lodash';

/**
 *
 * @param {Object} pixels - ndarray with pixels
 * @return {Array} - array of [width X heigth] with [r,g,b,a,x,y] data
 */
export function makeTwoDimentionalMap(pixels) {
  return sortBy(flatten(chunk(
    chunk(pixels.data, 4),
    get(pixels, 'shape[0]', 0))
    .map((row, rowIndex) => reverse(row)
      .map((colorCell, index) => [...colorCell, rowIndex, index])
    )).map((([r, g, b, a, x, y]) => ({
    rgba: `${r},${g},${b},${a}`, x, y
  }))), ['rgba', 'x']);
}
