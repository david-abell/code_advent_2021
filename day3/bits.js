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

let oxyRateBits = Object.assign(
  {},
  Array(bits[0].length).fill(null, 0, bits[0].length)
);

let counter = 0;
let oxyIndex = 0;
const oxyBitsReducer = (arr) => {
  if (arr.length === 1) {
    return parseInt(arr, 2);
  }

  let tempArr = [];

  if (counter === 0 || counter % 2 === 0) {
    arr.forEach((item) => {
      oxyRateBits[oxyIndex] += parseInt(item[oxyIndex]);
    });
    counter++;
    return oxyBitsReducer(arr);
  }
  const isGreater = oxyRateBits[oxyIndex] / arr.length >= 0.5 ? 1 : 0;

  arr.forEach((item) => {
    const curBit = parseInt(item[oxyIndex]);
    if (isGreater === curBit) {
      tempArr.push(item);
    }
  });
  counter++;
  oxyIndex++;

  return oxyBitsReducer(tempArr);
};

let co2RateBits = Object.assign(
  {},
  Array(bits[0].length).fill(null, 0, bits[0].length)
);

let co2Counter = 0;
let co2Index = 0;
const co2BitsReducer = (arr) => {
  if (arr.length === 1) {
    return parseInt(arr, 2);
  }

  let tempArr = [];

  if (co2Counter === 0 || co2Counter === 3) {
    const tempOxy =
      bits
        .map((item) => {
          return [...item][0];
        })
        .join("") /
        arr.length >=
      0.5
        ? 1
        : 0;
    if (tempOxy === 1) {
      arr.forEach((item) => {
        if (parseInt(item[0]) === 0) {
          co2RateBits[co2Index]++;
        }
      });
    }
    if (tempOxy === 0) {
      arr.forEach((item) => {
        if (parseInt(item[0]) === 1) {
          co2RateBits[co2Index]++;
        }
      });
    }

    co2Counter++;
    return co2BitsReducer(arr);
  }

  const isGreater =
    (arr.length - co2RateBits[co2Index]) / arr.length >= 0.5 ? 1 : 0;

  //   console.log("co2%2", arr, "co2Index", co2Index, "counter", co2Counter);
  if (co2Counter % 2 === 0) {
    arr.forEach((item) => {
      if (parseInt(item[co2Index] === 0)) {
        co2RateBits[co2Index]++;
      }
    });
    co2Counter++;
    return co2BitsReducer(arr);
  }

  arr.forEach((item) => {
    const curBit = parseInt(item[co2Index]);
    if (isGreater !== curBit) {
      tempArr.push(item);
    }
  });
  co2Counter++;
  co2Index++;

  return co2BitsReducer(tempArr);
};

console.log("OxyBits reduced:", oxyBitsReducer(bits));
console.log("Co2Bits reduced:", co2BitsReducer(bits));

// console.log(
//   "Life support rating:",
//   oxyBitsReducer(bits) * co2BitsReducer(bits)
// );
