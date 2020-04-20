describe('tests for controller.js', function () {

    it('should start game with easy level', function () {

        // given
        const LEVEL = "easy";

        spyOn(view, "resetBoardElements");
        spyOn(controller, "loadGameSettings").and.returnValue(true);
        spyOn(view, "hideSettings");
        spyOn(controller, "generateBoardElements");
        spyOn(controller, "generateRandomMines");
        spyOn(model, "setGameOver");
        spyOn(model, "setGameWin");

        // when
        controller.startGame(LEVEL);

        // then
        expect(view.resetBoardElements).toHaveBeenCalledTimes(1);
        expect(controller.loadGameSettings).toHaveBeenCalledWith(LEVEL);
        expect(view.hideSettings).toHaveBeenCalledTimes(1);
        expect(controller.generateBoardElements).toHaveBeenCalledTimes(1);
        expect(controller.generateRandomMines).toHaveBeenCalledTimes(1);
        expect(model.setGameOver).toHaveBeenCalledTimes(1);
        expect(model.setGameWin).toHaveBeenCalledTimes(1);

    });

    it('should not start custom game because of form validation failure', function () {

        // given
        const LEVEL = "custom";

        spyOn(view, "resetBoardElements");
        spyOn(controller, "loadGameSettings").and.returnValue(false);
        spyOn(view, "hideSettings");
        spyOn(controller, "generateBoardElements");
        spyOn(controller, "generateRandomMines");
        spyOn(model, "setGameOver");
        spyOn(model, "setGameWin");

        // when
        controller.startGame(LEVEL);

        // then
        expect(view.resetBoardElements).toHaveBeenCalledTimes(1);
        expect(controller.loadGameSettings).toHaveBeenCalledWith(LEVEL);
        expect(view.hideSettings).toHaveBeenCalledTimes(0);
        expect(controller.generateBoardElements).toHaveBeenCalledTimes(0);
        expect(controller.generateRandomMines).toHaveBeenCalledTimes(0);
        expect(model.setGameOver).toHaveBeenCalledTimes(0);
        expect(model.setGameWin).toHaveBeenCalledTimes(0);

    });

    it('should win game after revealing every possible cell', function () {

        // given
        const ROWS = 8, COLS = 8, MINES = 10, ARRAY = new Array(ROWS),
            $event = $.Event("click"),
            div = document.createElement("div");

        for (let i = 0; i < ROWS; i++) {
            ARRAY[i] = new Array(COLS);
        }
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                ARRAY[i][j] = "hidden"
            }
        }

        div.className = "col hidden";
        $event.target = div;
        $event.target.setAttribute("data-row", 0);
        $event.target.setAttribute("data-col", 0);

        spyOn(model, "getGameOver").and.returnValue(false);
        spyOn(model, "getGameWin").and.returnValue(false);
        spyOn(model, "getBoard").and.returnValue(ARRAY);
        spyOn(controller, "recursiveRevealCells");
        spyOn(model, "getCols").and.returnValue(0);
        spyOn(model, "getRows").and.returnValue(0);
        spyOn(model, "getMines").and.returnValue(0);
        spyOn(model, "setGameWin");
        spyOn(model, "getBoardElements");
        spyOn(view, "showMines");
        spyOn(window, "alert");

        // when
        controller.leftClickEventHandler($event);

        // then
        expect(model.getGameOver).toHaveBeenCalled();
        expect(model.getGameWin).toHaveBeenCalled();
        expect(model.getBoard).toHaveBeenCalled();
        expect(controller.recursiveRevealCells).toHaveBeenCalled();
        expect(model.getCols).toHaveBeenCalled();
        expect(model.getMines).toHaveBeenCalled();
        expect(model.setGameWin).toHaveBeenCalledWith(true);
        expect(model.getBoardElements).toHaveBeenCalled();
        expect(view.showMines).toHaveBeenCalled();

        setTimeout(function () {
            expect(window.alert).toHaveBeenCalledWith("You win!");
        }, 1000);

    });

    it('should load game settings', function () {

        // given
        const ROWS = 8, COLS = 8, MINES = 10, MAX_MINES = (COLS - 1) * (ROWS - 1), LEVEL = "easy";

        spyOn(model, "getCols").and.returnValue(COLS);
        spyOn(model, "getRows").and.returnValue(ROWS);
        spyOn(model, "getMines").and.returnValue(MINES);
        spyOn(model, "setCols");
        spyOn(model, "setRows");
        spyOn(model, "setMines");
        spyOn(model, "setMaxMines");
        spyOn(model, "getMaxMines").and.returnValue(MAX_MINES);
        spyOn(model, "setActualMines");
        spyOn(model, "getActualMines").and.returnValue(MINES);
        spyOn(view, "updateMinesCount");
        spyOn(controller, "validateSettings").and.returnValue(true);

        // when
        let result = controller.loadGameSettings(LEVEL);

        // then
        expect(result).toBe(true);
        expect(model.getCols).toHaveBeenCalledTimes(2);
        expect(model.getRows).toHaveBeenCalledTimes(2);
        expect(model.getMines).toHaveBeenCalledTimes(2);
        expect(model.getMaxMines).toHaveBeenCalledTimes(1);
        expect(model.setMaxMines).toHaveBeenCalledWith(MAX_MINES);
        expect(model.setActualMines).toHaveBeenCalledWith(MINES);
        expect(view.updateMinesCount).toHaveBeenCalledWith(MINES);
        expect(controller.validateSettings).toHaveBeenCalledWith(ROWS, COLS, MINES, MAX_MINES);

    });

    it('should validate settings and return true', function () {

        // given
        const ROWS = 8, COLS = 8, MINES = 10, MAX_MINES = (COLS - 1) * (ROWS - 1);

        // when
        let result = controller.validateSettings(ROWS, COLS, MINES, MAX_MINES);

        // then
        expect(result).toBe(true);

    });

    it('should validate settings and return false', function () {

        // given
        const ROWS = "", COLS = "", MINES = "", MAX_MINES = undefined;

        spyOn(window, "alert");

        // when
        let result = controller.validateSettings(ROWS, COLS, MINES, MAX_MINES);

        // then
        expect(result).toBe(false);
        expect(window.alert).toHaveBeenCalledWith("Invalid number of rows, cols and/or mines.");

    });

    it('should generate board elements', function () {

        // given
        const ROWS = 8, COLS = 8, LEFT_CLICK = function () { }, RIGHT_CLICK = function () { },
            ARRAY = new Array(ROWS);
        for (let i = 0; i < ROWS; i++) {
            ARRAY[i] = new Array(COLS);
        }

        spyOn(util, "generate2dArray").and.returnValue(ARRAY);
        spyOn(view, "insertNewRow");
        spyOn(view, "insertNewCol");
        spyOn(model, "setBoardElements");

        // when
        controller.generateBoardElements(ROWS, COLS, LEFT_CLICK, RIGHT_CLICK);

        // then
        expect(util.generate2dArray).toHaveBeenCalledWith(ROWS, COLS);
        expect(view.insertNewRow).toHaveBeenCalledTimes(ROWS);
        expect(view.insertNewCol).toHaveBeenCalledTimes(ROWS * COLS);
        expect(model.setBoardElements).toHaveBeenCalledWith(ARRAY);

    });

    it('should generate random mines', function () {

        // given
        const ROWS = 8, COLS = 8, MINES = 10, ARRAY = new Array(ROWS);
        for (let i = 0; i < ROWS; i++) {
            ARRAY[i] = new Array(COLS);
        }

        spyOn(util, "generate2dArray").and.returnValue(ARRAY);
        spyOn(model, "getCols").and.returnValue(COLS);
        spyOn(model, "getRows").and.returnValue(ROWS);
        spyOn(model, "setBoard");
        spyOn(model, "getMines").and.returnValue(MINES);
        spyOn(model, "setActualMines");

        // when
        controller.generateRandomMines(MINES);

        // then
        expect(util.generate2dArray).toHaveBeenCalledWith(ROWS, COLS);
        expect(model.getRows).toHaveBeenCalled()
        expect(model.getCols).toHaveBeenCalled();
        expect(model.setBoard).toHaveBeenCalledWith(ARRAY);
        expect(model.getMines()).toBe(MINES);
        expect(model.setActualMines).toHaveBeenCalledWith(model.getMines());

    });

});
