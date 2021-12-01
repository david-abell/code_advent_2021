"use strict";

const fs = require("fs");

const measures = fs
  .readFileSync("input.txt", "utf8")
  .replaceAll("\r", "")
  .split("\n")
  .map(Number);

const largerMeasures = measures.reduce((acc, item, index) => {
  if (item > measures[index - 1]) {
    return acc + 1;
  }
  return acc;
}, 0);

function measureWindows(arr) {
  let total = 0;
  let priorSum = arr[0] + arr[1] + arr[2];
  for (let i = 3; i < arr.length; i++) {
    const currentSum = priorSum - arr[i - 3] + arr[i];
    if (currentSum > priorSum) {
      total++;
    }
  }
  return total;
}

console.log("larger Windows:", measureWindows(measures));
console.log("larger Measures:", largerMeasures);
