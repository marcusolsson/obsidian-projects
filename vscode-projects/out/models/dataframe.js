"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordError = exports.isOptional = exports.isDate = exports.isNumber = exports.isList = exports.isString = exports.isBoolean = exports.emptyDataFrame = exports.isRepeatedDataValue = exports.isOptionalDataValue = exports.DataFieldType = void 0;
var DataFieldType;
(function (DataFieldType) {
    DataFieldType["String"] = "string";
    DataFieldType["Number"] = "number";
    DataFieldType["Boolean"] = "boolean";
    DataFieldType["Date"] = "date";
    DataFieldType["List"] = "multitext";
    DataFieldType["Unknown"] = "unknown";
})(DataFieldType = exports.DataFieldType || (exports.DataFieldType = {}));
function isOptionalDataValue(value) {
    switch (typeof value) {
        case "string":
            return true;
        case "number":
            return true;
        case "boolean":
            return true;
        default:
            return false;
    }
}
exports.isOptionalDataValue = isOptionalDataValue;
function isRepeatedDataValue(value) {
    if (Array.isArray(value)) {
        return value.every(isOptionalDataValue);
    }
    return false;
}
exports.isRepeatedDataValue = isRepeatedDataValue;
exports.emptyDataFrame = {
    records: [],
    fields: [],
};
function isBoolean(value) {
    return typeof value === "boolean";
}
exports.isBoolean = isBoolean;
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
function isList(value) {
    return Array.isArray(value);
}
exports.isList = isList;
function isNumber(value) {
    return typeof value === "number";
}
exports.isNumber = isNumber;
function isDate(value) {
    return value instanceof Date;
}
exports.isDate = isDate;
function isOptional(value) {
    return value === null || value === undefined;
}
exports.isOptional = isOptional;
class RecordError extends Error {
    constructor(recordId, err) {
        super(err.message);
        this.recordId = recordId;
        this.err = err;
    }
}
exports.RecordError = RecordError;
//# sourceMappingURL=dataframe.js.map