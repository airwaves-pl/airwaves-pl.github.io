"use strict";
const view = (function () {

    const resetBoardElements = function () {
        $("#board").empty();
    },

        playMusic = function (id) {
            document.getElementById(id).play();
        },

        insertNewRow = function () {
            const $newRow = $("<div>").addClass("row");
            $("#board").append($newRow);
            return $newRow;
        },

        insertNewCol = function ($newRow, row, col, leftClickEventHandler, rightClickEventHandler) {
            const $newCol = $("<div>")
                .addClass("col hidden")
                .attr("data-row", row)
                .attr("data-col", col)
                .on("click", leftClickEventHandler)
                .on("contextmenu", rightClickEventHandler);
            $newRow.append($newCol);
            return $newCol;
        },

        insertColoredText = function ($cell, value) {
            $cell.text(value);
            $cell.addClass("revealed" + value);
        },

        insertBomb = function ($target, icon) {
            $target.removeClass("hidden").addClass("mine").append($("<span>").addClass(icon));
        },

        insertFlag = function ($target, icon, mines) {
            $target.removeClass("hidden").addClass("flag").append($("<span>").addClass(icon));
            $("#mines-left").text("Mines left:" + mines);
        },

        removeFlag = function ($target, mines) {
            $target.empty();
            $target.removeClass("flag").addClass("hidden");
            $("#mines-left").text("Mines left:" + mines);
        },

        updateMinesCount = function (mines) {
            $("#mines-left").text("Mines left:" + mines);
        },

        revealCell = function ($cell) {
            $cell.removeClass("hidden");
            $cell.addClass("revealed");
        },

        hideSettings = function () {
            $("#settings").hide();
            $("#menu").show();
            $("#board").show();
        },

        showSettings = function () {
            $("#settings").show();
            $("#menu").hide();
            $("#board").hide();
        },

        showMines = function (board, boardElements, rows, cols) {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (board[i][j] == "mine" && !boardElements[i][j].hasClass("mine")) {
                        boardElements[i][j].addClass("mine").append($("<span>").addClass("fa fa-bomb"));
                    }
                }
            }
        };

    return {
        resetBoardElements: resetBoardElements,
        insertNewRow: insertNewRow,
        insertNewCol: insertNewCol,
        insertColoredText: insertColoredText,
        insertBomb: insertBomb,
        insertFlag: insertFlag,
        removeFlag: removeFlag,
        updateMinesCount: updateMinesCount,
        revealCell: revealCell,
        showSettings: showSettings,
        hideSettings: hideSettings,
        showMines: showMines,
        playMusic: playMusic
    }

})();