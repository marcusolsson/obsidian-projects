"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectViewV2 = exports.DataFieldType = void 0;
var DataFieldType;
(function (DataFieldType) {
    DataFieldType["String"] = "string";
    DataFieldType["Number"] = "number";
    DataFieldType["Boolean"] = "boolean";
    DataFieldType["Date"] = "date";
    DataFieldType["Link"] = "link";
    DataFieldType["List"] = "list";
    DataFieldType["Unknown"] = "unknown";
})(DataFieldType = exports.DataFieldType || (exports.DataFieldType = {}));
class ProjectViewV2 {
    onData(data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onClose() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.ProjectViewV2 = ProjectViewV2;
