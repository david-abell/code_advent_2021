"use strict";

const fs = require("fs");

const positions = fs
  .readFileSync("input.txt", "utf8")
  .replaceAll("\r", "")
  .split("\n");

//   Puzzle One
const destination = positions.reduce((acc, item) => {
  const [direction, movement] = item.split(" ").map((el) => {
    if (Number(el)) {
      return Number(el);
    }
    return el;
  });

  if (!acc[direction]) {
    acc[direction] = movement;
    return acc;
  }

  acc[direction] = acc[direction] + movement;

  return acc;
}, {});

const { down, up, forward } = destination;
console.log("Basic direction:", (down - up) * forward);

// Puzzle Two
const adjustAim = (key, value) => {
  let result = 0;
  if (key === "down") {
    result += value;
  }
  if (key === "up") {
    result -= value;
  }
  return result;
};

const aimedDestination = positions.reduce(
  (acc, item) => {
    const [direction, movement] = item.split(" ").map((el) => {
      if (Number(el)) {
        return Number(el);
      }
      return el;
    });

    acc.aim += adjustAim(direction, movement);

    if (direction === "forward") {
      acc.horizontal += movement;
      acc.depth += acc.aim * movement;
    }

    return acc;
  },
  { aim: 0, horizontal: 0, depth: 0 }
);

console.log(
  "aim Destination:",
  aimedDestination.horizontal * aimedDestination.depth
);
