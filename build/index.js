"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunnelMapper_1 = require("./FunnelMapper");
var FunnelReducer_1 = require("./FunnelReducer");
var entriesMap = new FunnelMapper_1.FunnelMapper('sampleData.csv').map();
console.log(new FunnelReducer_1.FunnelReducer(entriesMap).toString());
