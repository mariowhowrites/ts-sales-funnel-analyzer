"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stringer = /** @class */ (function () {
    function Stringer() {
    }
    Stringer.prototype.toString = function () {
        var _this = this;
        var conversionString = '';
        this.conversionMap.forEach(function (conversions, date) {
            conversionString = conversionString + "\nConversions for day " + date + ":\n";
            conversions.forEach(function (total, index) {
                var stageString = _this.conversionStages[index] + ": " + total;
                if (index > 0) {
                    var percent = void 0;
                    if (conversions[index - 1] === 0) {
                        percent = 0;
                    }
                    else {
                        percent = total / conversions[index - 1];
                    }
                    percent = percent * 100;
                    stageString = stageString + ", " + percent + "%";
                }
                conversionString = "" + conversionString + stageString + "\n";
                if (index === conversions.length - 1) {
                    var totalConversions = conversions[index] / conversions[0] * 100;
                    if (Number.isNaN(totalConversions)) {
                        totalConversions = 0;
                    }
                    conversionString = conversionString + "Final Conversion: " + totalConversions + "\n%";
                }
            });
        });
        return conversionString;
    };
    return Stringer;
}());
exports.Stringer = Stringer;
