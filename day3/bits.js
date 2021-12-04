"use strict";

const fs = require("fs");
const path = require("path");

const bits = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf8")
  .split("\r\n");

let countedBits = Object.assign(
  {},
  Array(bits[0].length).fill(0, 0, bits[0].length)
);

bits.forEach((item) => {
  const itemNumber = [...item].map(Number);
  itemNumber.forEach((el, index) => (countedBits[index] += el));
});

const gamma = Object.values(countedBits).map((item) => {
  return item / bits.length > 0.5 ? 1 : 0;
});

const epsilon = gamma.map((item) => {
  return item === 0 ? 1 : 0;
});

console.log(
  "Total power:",
  parseInt(gamma.join(""), 2) * parseInt(epsilon.join(""), 2)
);

let counter = 0;
let reducerIndex = 0;
const bitsReducer = (arr, sortBit, keepBit) => {
  if (arr.length === 1) {
    return parseInt(arr, 2);
  }

  let tempArr = [];
  let oneCount = null;

  const createKeepBit = (item) => {
    if (sortBit === 1) {
      return item >= arr.length / 2 ? 1 : 0;
    }
    return item < arr.length / 2 ? 1 : 0;
  };

  if (counter === 0 || counter % 2 === 0) {
    arr.forEach((item) => {
      if (parseInt(item[reducerIndex]) === 1) oneCount++;
    });
    counter++;
    return bitsReducer(arr, sortBit, createKeepBit(oneCount));
  }

  arr.forEach((item) => {
    const curBit = parseInt(item[reducerIndex]);
    if (keepBit === curBit) {
      tempArr.push(item);
    }
  });
  counter++;
  reducerIndex++;

  return bitsReducer(tempArr, sortBit);
};

const oxygenRating = bitsReducer(bits, 1);
const co2Rating = bitsReducer(bits, 0);

// const co2Rating = setTimeout(bitsReducer, 1000, bits, 0);
// still exceeds call stack with this timeout

console.log("Oxygen Rating:", oxygenRating);
console.log("CO2 Rating:", co2Rating);
console.log("Life Support Rating:", oxygenRating * co2Rating);
