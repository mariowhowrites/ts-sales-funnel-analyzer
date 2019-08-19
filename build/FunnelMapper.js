"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var FunnelMapper = /** @class */ (function () {
    function FunnelMapper(path) {
        this.path = path;
        this.data = [];
        this.fileText = fs_1.default.readFileSync(path, 'utf-8');
        this.data = this.parse();
    }
    FunnelMapper.prototype.parse = function () {
        return this.fileText
            .split('\n')
            .map(function (line, index) {
            if (index === 0) {
                return {
                    sessionID: -1,
                    timestamp: -1,
                    action: ''
                };
            }
            var _a = line.split(', '), sessionID = _a[0], timestamp = _a[1], action = _a[2];
            action = action.replace(/\'/g, '');
            return {
                sessionID: parseInt(sessionID),
                timestamp: parseInt(timestamp),
                action: action
            };
        })
            .filter(function (entry) { return entry.sessionID !== -1; });
    };
    FunnelMapper.prototype.map = function () {
        return this.data.reduce(function (acc, entry) {
            var date = parseUTCIntoDateString(entry.timestamp);
            var entriesArray;
            if (acc.has(date)) {
                entriesArray = acc.get(date);
            }
            else {
                entriesArray = [];
            }
            entriesArray.push(entry);
            acc.set(date, entriesArray);
            return acc;
        }, new Map());
    };
    return FunnelMapper;
}());
exports.FunnelMapper = FunnelMapper;
function parseUTCIntoDateString(timestamp) {
    return Math.floor(timestamp / 10);
}
