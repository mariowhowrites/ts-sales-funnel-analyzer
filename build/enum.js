"use strict";
var Stages;
(function (Stages) {
    Stages[Stages["stage_one"] = 0] = "stage_one";
    Stages[Stages["stage_two"] = 1] = "stage_two";
})(Stages || (Stages = {}));
console.log(Stages['stage_one']);
