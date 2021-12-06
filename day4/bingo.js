"use strict";

const fs = require("fs");
const path = require("path");

const draws = fs
  .readFileSync(path.resolve(__dirname, "draws.txt"), "utf8")
  .split(",");

const boards = fs
  .readFileSync(path.resolve(__dirname, "boards.txt"), "utf8")
  .split("\r\n\r\n")
  .map((item) => {
    const tempObj = item.split("\r\n").map((el) => {
      return el.trim().replaceAll(/ +/g, ",").split(",");
    });
    return tempObj;
  });

const reduceBoard = (arr, drawsIndex) => {
  let nextIndex = drawsIndex || 0;
  let curNum = nextIndex ? draws[nextIndex] : draws[0];
  let tempArr = [];

  for (let board of arr) {
    let tempBoard = [];
    let colWinner = {};
    let rowWinner = {};
    let boardIndex = 0;
    for (let row of board) {
      const tempRow = row.map((item, index) => {
        colWinner[index] ??= 0;
        rowWinner[boardIndex] ??= 0;
        if (item == curNum || item == -1) {
          colWinner[index] += 1;
          rowWinner[boardIndex] += 1;
        }
        return item == curNum ? -1 : item;
      });
      tempBoard.push(tempRow);
      boardIndex += 1;
    }
    let foundWinner;
    if (
      Object.values(rowWinner).includes(5) ||
      Object.values(colWinner).includes(5)
    ) {
      foundWinner = true;
    }

    if (foundWinner) {
      return (
        tempBoard
          .flat()
          .map(Number)
          .filter((item) => item !== -1)
          .reduce((acc, item) => {
            return acc + item;
          }) * curNum
      );
    }
    tempArr.push(tempBoard);
  }
  nextIndex += 1;
  return reduceBoard(tempArr, nextIndex);
};

console.log("Winning Board Score:", reduceBoard(boards));

const reduceBoardToLast = (arr, drawsIndex, winner) => {
  let nextIndex = drawsIndex || 0;
  let curNum = nextIndex ? draws[nextIndex] : draws[0];
  let tempArr = [];
  let lastWinner = winner ? winner : null;
  if (arr.length < 1) {
    return lastWinner;
  }

  for (let board of arr) {
    let tempBoard = [];
    let colWinner = {};
    let rowWinner = {};
    let boardIndex = 0;
    for (let row of board) {
      const tempRow = row.map((item, index) => {
        colWinner[index] ??= 0;
        rowWinner[boardIndex] ??= 0;
        if (item == curNum || item == -1) {
          colWinner[index] += 1;
          rowWinner[boardIndex] += 1;
        }
        return item == curNum ? -1 : item;
      });
      tempBoard.push(tempRow);
      boardIndex += 1;
    }
    let foundWinner;
    if (
      Object.values(rowWinner).includes(5) ||
      Object.values(colWinner).includes(5)
    ) {
      lastWinner =
        tempBoard
          .flat()
          .map(Number)
          .filter((item) => item !== -1)
          .reduce((acc, item) => {
            return acc + item;
          }) * curNum;
      foundWinner = true;
    }
    if (!foundWinner) {
      tempArr.push(tempBoard);
    }
  }
  nextIndex += 1;
  if (lastWinner) {
    return reduceBoardToLast(tempArr, nextIndex, lastWinner);
  }
  return reduceBoardToLast(tempArr, nextIndex);
};

console.log("Last Possible Winning Board:", reduceBoardToLast(boards));
