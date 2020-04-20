"use strict";
const model = (function () {

    let board,
        boardElements,
        cols,
        rows,
        mines,
        actualMines,
        maxMines,
        gameOver,
        gameWin,

        getBoard = function () {
            return board;
        },

        getBoardElements = function () {
            return boardElements;
        },

        getCols = function () {
            return cols;
        },

        getRows = function () {
            return rows;
        },

        getMines = function () {
            return mines;
        },

        getActualMines = function () {
            return actualMines;
        },

        getMaxMines = function () {
            return maxMines;
        },

        getGameOver = function () {
            return gameOver;
        },

        getGameWin = function () {
            return gameWin;
        },

        setBoard = function (b) {
            board = b;
        },

        setBoardAt = function (i, j, value) {
            board[i][j] = value;
        },

        setBoardElements = function (bd) {
            boardElements = bd;
        },

        setCols = function (n) {
            cols = n;
        },

        setRows = function (n) {
            rows = n;
        },

        setMines = function (n) {
            mines = n;
        },

        setActualMines = function (n) {
            actualMines = n;
        },

        setMaxMines = function (n) {
            maxMines = n;
        },

        setGameOver = function (value) {
            gameOver = value;
        },

        setGameWin = function (value) {
            gameWin = value;
        };

    return {
        getBoard: getBoard,
        getBoardElements: getBoardElements,
        getCols: getCols,
        getRows: getRows,
        getMines: getMines,
        getActualMines: getActualMines,
        getMaxMines: getMaxMines,
        getGameOver: getGameOver,
        getGameWin: getGameWin,
        setBoard: setBoard,
        setBoardAt: setBoardAt,
        setBoardElements: setBoardElements,
        setCols: setCols,
        setRows: setRows,
        setMines: setMines,
        setActualMines: setActualMines,
        setMaxMines: setMaxMines,
        setGameOver: setGameOver,
        setGameWin: setGameWin
    }

})();