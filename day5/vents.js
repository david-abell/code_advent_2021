"use strict";
const fs = require("fs");
const path = require("path");
const {
  checkIntersection,
  colinearPointWithinSegment,
} = require("line-intersect");

const lines = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf8")
  .split("\r\n")
  .map((item) => item.replaceAll(" -> ", ",").split(","))
  .map((item) => item.map(Number));

// let verticalLines = [];
// let horizontalLines = [];
let filteredLines = [];
let intersects = new Map();

//  Below slope formula also correctly filters vertical and horizontal lines
//
// const slope = ([x1, y1, x2, y2]) => {
//   return (y2 - y1) / (x2 - x1);
// };
//
// for (let line of lines) {
//   const curSlope = slope(line);
//   if (Math.abs(curSlope) === Infinity) {
//     verticalLines.push(line);
//     filteredLines.push(line);
//   }
//   if (Math.abs(curSlope) === 0) {
//     horizontalLines.push(line);
//     filteredLines.push(line);
//   }
// }
lines.forEach((item) => {
  const [x1, y1, x2, y2] = item;
  if (x1 === x2 || y1 === y2) {
    filteredLines.push(item);
  }
});
/*   
  @function checkIntersection(line1, line2)
  { type: 'none' | 'parallel' | 'colinear' }
  { type: 'intersecting', point: { x: number, y: number } }

*/
const compareLines = (line1, line2) => {
  let lineIntersect = checkIntersection(...line1, ...line2);
  if (lineIntersect.type === "colinear") {
    let points = [];

    const [ln1x1, ln1y1, ln1x2, ln1y2] = line1;
    const [ln2x1, ln2y1, ln2x2, ln2y2] = line2;
    const isColinearX = ln1x1 === ln1x2 && ln2x1 === ln2x2 ? true : false;
    let ln1Length = isColinearX
      ? Math.abs(ln1y1 - ln1y2) + 1
      : Math.abs(ln1x1 - ln1x2) + 1;
    let firstPoint = ln1y1 < ln1y2 ? ln1y1 : ln1y2;
    if (!isColinearX) {
      firstPoint = ln1x1 < ln1x2 ? ln1x1 : ln1x2;
    }
    const startX = [ln2x1, ln2x2].sort((a, b) => a - b)[0];
    const endX = [ln2x1, ln2x2].sort((a, b) => b - a)[0];
    const startY = [ln2y1, ln2y2].sort((a, b) => a - b)[0];
    const endY = [ln2y1, ln2y2].sort((a, b) => b - a)[0];

    for (let i = firstPoint; i < firstPoint + ln1Length; i++) {
      if (isColinearX) {
        const isPoint = colinearPointWithinSegment(
          ln1x1,
          i,
          startX,
          startY,
          endX,
          endY
        );
        if (isPoint) {
          points.push({ x: ln1x1, y: i });
        }
        continue;
      }
      const isPoint = colinearPointWithinSegment(
        i,
        ln1y1,
        startX,
        startY,
        endX,
        endY
      );
      if (isPoint) {
        points.push({ x: i, y: ln1y1 });
      }
    }
    lineIntersect.points = points;
  }
  return lineIntersect;
};

const loopThroughLines = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (i !== j) {
        const comparedResult = compareLines(arr[i], arr[j]);
        if (
          comparedResult.point &&
          (Math.round(comparedResult.point.x) !== comparedResult.point.x ||
            Math.round(comparedResult.point.y) !== comparedResult.point.y)
        ) {
          comparedResult.point.x = Math.round(comparedResult.point.x);
          comparedResult.point.y = Math.round(comparedResult.point.y);
        }
        let curPoint = comparedResult.point
          ? Object.entries(comparedResult.point).toString()
          : false;
        if (curPoint && !intersects.has(curPoint)) {
          intersects.set(curPoint, true);
        }
        if (comparedResult.points) {
          comparedResult.points.forEach((point) => {
            curPoint = Object.entries(point).toString();
            if (!intersects.has(curPoint)) {
              intersects.set(curPoint, true);
            }
          });
        }
      }
    }
  }
};
loopThroughLines(filteredLines);
console.log("Total intersects found:", intersects.size);
