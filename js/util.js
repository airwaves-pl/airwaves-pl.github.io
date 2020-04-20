"use strict";
const util = (function () {

    const generate2dArray = function (rows, cols) {
        const array = new Array(rows);
        for (let i = 0; i < rows; i++) {
            array[i] = new Array(cols);
        }
        return array;
    };

    return {
        generate2dArray: generate2dArray
    }

})();