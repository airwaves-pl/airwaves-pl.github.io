"use strict";
const controller = (function () {

    const EASY_ROWS = 8,
        EASY_COLS = 8,
        EASY_MINES = 10,
        HARD_ROWS = 16,
        HARD_COLS = 16,
        HARD_MINES = 40,
        MAX_ROWS = 40,
        MAX_COLS = 40,

        countMines = function (row, col) {
            let mineCount = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    const nextRow = row + i,
                        nextCol = col + j;
                    if (nextRow >= model.getRows() || nextCol >= model.getCols() || nextRow < 0 || nextCol < 0) {
                        continue;
                    }
                    if (model.getBoard()[nextRow][nextCol] == "mine") {
                        mineCount++;
                    }
                }
            }
            return mineCount;
        },

        recursiveRevealCells = function (row, col) {
            if (row >= model.getRows() || col >= model.getCols() || row < 0 || col < 0) {
                return;
            }
            const mineCount = controller.countMines(row, col),
                cellState = model.getBoard()[row][col],
                $cell = $(`.col.hidden[data-row=${row}][data-col=${col}]`);
            if (cellState == 'revealed') {
                return;
            }
            if (cellState == "mine" || cellState == "flagged") {
                return;
            }
            model.setBoardAt(row, col, "revealed");
            view.revealCell($cell);
            if (mineCount > 0) {
                view.insertColoredText($cell, mineCount);
                return;
            }
            for (let deltaRow = -1; deltaRow < 2; deltaRow++) {
                for (let deltaCol = -1; deltaCol < 2; deltaCol++) {
                    controller.recursiveRevealCells(row + deltaRow, col + deltaCol);
                }
            }
        },

        leftClickEventHandler = function (event) {
            event.preventDefault();
            if (model.getGameOver()) {
                return;
            }
            if (model.getGameWin()) {
                return;
            }
            const i = $(event.target).data("row"),
                j = $(event.target).data("col");
            if (!$(event.target).hasClass("flag")) {
                if (model.getBoard()[i][j] == "hidden") {
                    controller.recursiveRevealCells(i, j);
                    if ($('.col.revealed').length == (model.getCols() * model.getRows() - model.getMines())) {
                        model.setGameWin(true);
                        view.showMines(model.getBoard(), model.getBoardElements(), model.getRows(), model.getCols());
                        view.playMusic("win-sound");
                        setTimeout(function () {
                            alert("You win!");
                        }, 1000);
                    }
                } else if (model.getBoard()[i][j] == "mine") {
                    model.setGameOver(true);
                    view.insertBomb($(event.target), "fa fa-bomb");
                    view.showMines(model.getBoard(), model.getBoardElements(), model.getRows(), model.getCols());
                    view.playMusic("bomb-sound");
                    setTimeout(function () {
                        alert("Game Over");
                    }, 1000);
                }
            }
        },

        rightClickEventHandler = function (event) {
            event.preventDefault();
            if (model.getGameOver()) {
                return;
            }
            if (model.getGameWin()) {
                return;
            }
            if ($(event.target).hasClass("hidden")) {
                model.setActualMines(model.getActualMines() - 1);
                view.insertFlag($(event.target), "fa fa-flag", model.getActualMines());
            }
            else if ($(event.target).hasClass("flag")) {
                model.setActualMines(model.getActualMines() + 1);
                view.removeFlag($(event.target), model.getActualMines());
            }
        },

        generateRandomMines = function (mines) {
            let randomRow = 0,
                randomCol = 0,
                board = util.generate2dArray(model.getRows(), model.getCols());
            for (let i = 0; i < model.getRows(); i++) {
                for (let j = 0; j < model.getCols(); j++) {
                    board[i][j] = "hidden";
                }
            }
            while (mines > 0) {
                randomRow = Math.floor(Math.random() * model.getRows());
                randomCol = Math.floor(Math.random() * model.getCols());
                if (board[randomRow][randomCol] != "mine") {
                    board[randomRow][randomCol] = "mine";
                    mines--;
                }
            }
            model.setBoard(board);
            model.setActualMines(model.getMines());
        },

        generateBoardElements = function (rows, cols, leftClickHandler, rightClickHandler) {
            const boardElements = util.generate2dArray(rows, cols);
            let $newCol, $newRow;
            for (let i = 0; i < rows; i++) {
                $newRow = view.insertNewRow();
                for (let j = 0; j < cols; j++) {
                    $newCol = view.insertNewCol($newRow, i, j, leftClickHandler, rightClickHandler);
                    boardElements[i][j] = $newCol;
                }
            }
            model.setBoardElements(boardElements);
        },

        validateSettings = function (rows, cols, mines, maxMines) {
            if (rows == "" || cols == "" || mines == "" || maxMines == "") {
                alert("Invalid number of rows, cols and/or mines.");
                return false;
            }
            if (mines > maxMines) {
                alert("Too much mines.");
                return false;
            }
            if (rows > MAX_ROWS || cols > MAX_COLS) {
                alert("Too much rows and/or cols.");
                return false;
            }
            return true;
        },

        loadGameSettings = function (level) {
            switch (level) {
                case "easy":
                    model.setCols(EASY_COLS);
                    model.setRows(EASY_ROWS);
                    model.setMines(EASY_MINES);
                    break;
                case "hard":
                    model.setCols(HARD_COLS);
                    model.setRows(HARD_ROWS);
                    model.setMines(HARD_MINES);
                    break;
                case "custom":
                    model.setCols($("#cols").val());
                    model.setRows($("#rows").val());
                    model.setMines($("#mines").val());
                    break;
                default:
                    model.setCols(EASY_COLS);
                    model.setRows(EASY_ROWS);
                    model.setMines(EASY_MINES);
            }
            model.setMaxMines((model.getRows() - 1) * (model.getCols() - 1));
            model.setActualMines(model.getMines());
            view.updateMinesCount(model.getActualMines());
            return controller.validateSettings(model.getRows(), model.getCols(), model.getMines(), model.getMaxMines());
        },

        startGame = function (level) {
            view.resetBoardElements();
            if (!controller.loadGameSettings(level)) {
                return;
            }
            view.hideSettings();
            controller.generateBoardElements(model.getRows(), model.getCols(), controller.leftClickEventHandler, controller.rightClickEventHandler);
            controller.generateRandomMines(model.getMines());
            model.setGameOver(false);
            model.setGameWin(false);
            return model.getBoard();
        };

    return {
        countMines: countMines,
        recursiveRevealCells: recursiveRevealCells,
        leftClickEventHandler: leftClickEventHandler,
        rightClickEventHandler: rightClickEventHandler,
        generateRandomMines: generateRandomMines,
        generateBoardElements: generateBoardElements,
        validateSettings: validateSettings,
        loadGameSettings: loadGameSettings,
        startGame: startGame
    }

})();