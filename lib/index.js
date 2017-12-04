import {
  chunk,
  find,
  findIndex,
  first,
  flatten,
  get,
  isEmpty,
  isNumber,
  keys,
  reverse,
  set,
  slice,
  sortBy
} from 'lodash';

/**
 *
 * @param {Object} pixels - ndarray with pixels
 * @return {Array} - array of [width X heigth] with [r,g,b,a,y,x] data
 */
export function makeTwoDimentionalMap(pixels = {}) {
  return flatten(chunk(
    chunk(pixels.data, 4),
    get(pixels, 'shape[0]', 0))
    .map((row, rowIndex) => row
      .map((colorCell, index) => [...colorCell, rowIndex, index])
    ));
}

/**
 *
 * @param imageMap
 * @return {*|Array}
 */
export function makeColorIslands(imageMap = []) {
  return imageMap
    .reduce(function(memo, [r, g, b, a, y, x]) {
      const passingIsland = first(memo.filter(island => {
        const [iR, iG, iB, iA] = first(island);
        return iR === r &&
          iB === b &&
          iG === g &&
          iA === a;
      }));
      const indexOfpassingIsland = memo
        .indexOf(passingIsland);
      if (passingIsland && indexOfpassingIsland > -1) {
        memo[indexOfpassingIsland] = [...passingIsland, [y, x]];
      } else {
        memo = [...memo, [[r, g, b, a, y, x]]];
      }
      return memo;
    }, []);
}

/**
 *
 * @param imageMap
 * @return {*|Array}
 */
export function simplifyMapByColors(imageMap = []) {
  const colors = slice(imageMap, 0, 10000)
    .reduce(function(memo, [r, g, b, a, y, x]) {
      const color = `${r},${g},${b},${a}`;
      const colorArray = find(memo, {color});
      const colorIndex = findIndex(memo, {color});
      if (isEmpty(colorArray)) {
        // Moment of color birth
        memo = [...memo, {color, items: [[y, x]]}];
      } else {
        // moment to add one more point with existing color
        let items = [...colorArray.items, [y, x]];
        memo[colorIndex] = {
          color,
          items,
        };
      }
      return memo;
    }, [])
    .map((coloredPixel) => {
      if (coloredPixel.items) {
        coloredPixel.items = coloredPixel.items.map((ccolorItem, colorindex) => {
          const [yy, xx] = ccolorItem;
          const prevXX = coloredPixel.items[colorindex - 1] && coloredPixel.items[colorindex - 1][1];
          const postXX = coloredPixel.items[colorindex + 1] && coloredPixel.items[colorindex + 1][1];
          console.log([colorindex, prevXX, xx, postXX]);
          if(postXX && xx < (postXX - 1) && prevXX && xx > (prevXX + 1)) {
            ccolorItem[2] = 'alone';
            return ccolorItem;
          }

          if (postXX && xx < (postXX - 1)) {
            return ccolorItem;
          }

          //START of new line
          if (postXX && xx > postXX) {
            return ccolorItem;
          }

          if (prevXX && xx > (prevXX + 1)) {
            return ccolorItem;
          }

          //BREAK of line
          if (prevXX && xx < prevXX) {
            return ccolorItem;
          }
          if(!isNumber(prevXX) || !isNumber(postXX)) {
            return ccolorItem;
          }
          ccolorItem[2] = 'skipped';
          return ccolorItem;
        })
          // .filter(([yy, xx, skipped]) => !skipped);
      }
      return coloredPixel;
    });
  return {colors};
}
