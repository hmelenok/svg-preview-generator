import {
  chunk, find, findIndex, first, flatten, get, isEmpty, isNumber, keys, reverse, set, slice,
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
          const prevYY = coloredPixel.items[colorindex - 1] && coloredPixel.items[colorindex - 1][0];
          const postXX = coloredPixel.items[colorindex + 1] && coloredPixel.items[colorindex + 1][1];
          const postYY = coloredPixel.items[colorindex + 1] && coloredPixel.items[colorindex + 1][0];
          const isNextXX = isNumber(postXX) && (xx + 1) === postXX;
          const isPrevXX = isNumber(prevXX) && (xx - 1) === prevXX;
          const isNextYY = isNumber(postYY) && yy === postYY;
          const isPrevYY = isNumber(prevYY) && yy === prevYY;
          // //Alone stuff without neigbours
          // if ((!isNextXX && !isPrevXX) || //[]
          //   !isPrevXX && !isNextYY || //line break
          //   (!isNextXX || !isNextYY)) {
          //   ccolorItem[2] = 'alone';
          //   return ccolorItem;
          // }
          //
          //
          // if (isNextXX) {
          //   return ccolorItem;
          // }
          //
          // //START of new line
          // if (isNumber(postXX) && xx > postXX) {
          //   return ccolorItem;
          // }
          //
          //
          // if (isPrevXX) {
          //   return ccolorItem;
          // }
          //
          // //BREAK of line
          // if (!isNextYY) {
          //   return ccolorItem;
          // }
          // //Start or end of array
          // if (!isNumber(prevXX) || !isNumber(postXX)) {
          //   return ccolorItem;
          // }
          let status = '';
          if (!prevYY && !prevXX &&
            isNextXX && isNextYY &&
            !isPrevYY && !isPrevXX) {
            status = 'start';
          } else if (isNextXX && isNextYY &&
            isPrevYY && isPrevXX) {
            status = 'skipped';
          } else if (!isNextXX && isNextYY &&
            isPrevYY && isPrevXX) {
            status = 'ending';
          } else if (isNextXX && isNextYY &&
            isPrevYY && !isPrevXX) {
            status = 'starting';
          } else if (!isNextXX && !isNextYY &&
            isPrevYY && isPrevXX) {
            status = 'endLine';
          } else if (isNextXX && isNextYY &&
            !isPrevYY && !isPrevXX) {
            status = 'startLine';
          } else if (!isNextXX && !isNextYY &&
            isPrevYY && !isPrevXX) {
            status = 'alone';
          } else if (!isNextXX && isNextYY &&
            !isPrevYY && !isPrevXX) {
            status = 'aloneToo';
          } else if (isNextXX && !isNextYY &&
            !isPrevYY && !isPrevXX) {
            status = 'aloneThree';
          } else if (!isNextXX && !isNextYY &&
            !isPrevYY && isPrevXX) {
            status = 'aloneFour';
          } else if (!isNextXX && !isNextYY &&
            !isPrevYY && !isPrevXX) {
            status = 'aloneCompletely';
          }
          ccolorItem[2] = status;
          ccolorItem[3] = {
            status,
            prevXX,
            prevYY,
            postXX,
            postYY,
            isPrevXX,
            isPrevYY,
            isNextXX,
            isNextYY
          };
          return ccolorItem;
        })
        // .filter(([yy, xx, skipped]) => !skipped);
      }
      return coloredPixel;
    });
  return {colors};
}
