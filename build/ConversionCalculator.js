"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Stringer_1 = require("./Stringer");
var ConversionCalculator = /** @class */ (function (_super) {
    __extends(ConversionCalculator, _super);
    function ConversionCalculator(funnelMap) {
        var _this = _super.call(this) || this;
        _this.funnelMap = funnelMap;
        _this.conversionMap = new Map();
        _this.customerMap = new Map();
        _this.conversionStages = [
            'product_view',
            'purchase_click',
            'purchase_credit_card',
            'purchase_complete'
        ];
        return _this;
    }
    ConversionCalculator.prototype.run = function () {
        // this.funnelMap.forEach((dailyEntries: FunnelArray, date: number) => {
        //   this.calculateEntriesForDate(dailyEntries, date)
        // })
        var entries = this.funnelMap.get(12);
        if (entries) {
            this.calculateEntriesForDate(entries, 12);
        }
        return this;
    };
    /**
     * Calculates entries for a given date value. Loops through each entry,
     * leaves the entry logic to calculateConversionsForEntry.
     *
     * Resets the customer map for each new day, preventing multiday sequences.
     *
     * @param entries FunnelArray
     * @param date number
     */
    ConversionCalculator.prototype.calculateEntriesForDate = function (entries, date) {
        var _this = this;
        this.customerMap = new Map();
        var conversions = new Array(this.conversionStages.length).fill(0);
        entries.forEach(function (entry) {
            _this.calculateConversionsForEntry(conversions, entry);
        });
        this.conversionMap.set(date, conversions);
    };
    /**
     * Calculates the conversions for a given entry. Decides whether or not
     * a given entry advances a customer sequence, discarding it otherwise.
     *
     * @param conversions Array<number>
     * @param entry FunnelEntry
     */
    ConversionCalculator.prototype.calculateConversionsForEntry = function (conversions, entry) {
        var _a = this.calculateStages(entry), customerStage = _a[0], eventStage = _a[1];
        console.log('customer stage', customerStage);
        console.log('event stage', eventStage);
        if (this.isInvalid(customerStage, eventStage)) {
            console.log('event is invalid');
            return;
        }
        if (this.invalidatesCustomer(customerStage, eventStage)) {
            console.log('event invalidates customer');
            this.customerMap.delete(entry.sessionID);
            return;
        }
        console.log('event is incrementing');
        conversions[eventStage]++;
        this.customerMap.set(entry.sessionID, eventStage);
    };
    /**
     * Finds the event and customer stage of a given entry.
     *
     * The customer stage could either be a number, indicating an existing customer sequence, or undefined.
     * The event stage will always exist assuming properly-formatted data.
     *
     * @param entry FunnelEntry
     */
    ConversionCalculator.prototype.calculateStages = function (entry) {
        var customerStage = this.customerMap.get(entry.sessionID);
        var eventStage = this.conversionStages.findIndex(function (stage) {
            return stage === entry.action;
        });
        return [customerStage, eventStage];
    };
    /**
     * Determines whether an entry is invalid. entries are invalid if:
     * a) we don't have such a customer in our map; and
     * b) we aren't adding one with eventStage === 0
     *
     * @param customerStage number
     * @param eventStage number
     *
     * @returns boolean
     */
    ConversionCalculator.prototype.isInvalid = function (customerStage, eventStage) {
        return customerStage === undefined && eventStage !== 0;
    };
    /**
     * Determines whether an event invalidates a customer sequence. This happens if:
     * a) we have a customer; and
     * b) our current entry doesn't advance the customer's sequence
     *
     * @param customerStage number
     * @param eventStage number
     *
     * @returns boolean
     */
    ConversionCalculator.prototype.invalidatesCustomer = function (customerStage, eventStage) {
        return (customerStage && eventStage !== customerStage + 1);
    };
    return ConversionCalculator;
}(Stringer_1.Stringer));
exports.ConversionCalculator = ConversionCalculator;
