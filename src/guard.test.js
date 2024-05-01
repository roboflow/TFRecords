"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guard_1 = __importDefault(require("./guard"));
describe("Guard", () => {
    function methodWithRequiredName(name) {
        guard_1.default.empty(name);
    }
    function methodWithRequiredNameWithParam(name) {
        guard_1.default.empty(name, "name", "Name is required");
    }
    function methodWithRequiredObject(options) {
        guard_1.default.null(options);
    }
    function methodWithRequiredExpression(value) {
        guard_1.default.expression(value, (num) => num > 0 && num < 100);
    }
    describe("empty", () => {
        it("throws error on null value", () => {
            expect(() => methodWithRequiredName(null)).toThrowError();
        });
        it("throws error on empty value", () => {
            expect(() => methodWithRequiredName("")).toThrowError();
        });
        it("throw error on whitespace", () => {
            expect(() => methodWithRequiredName(" ")).toThrowError();
        });
        it("does not throw error on valid value", () => {
            expect(() => methodWithRequiredName("valid")).not.toThrowError();
        });
        it("throws specific error message", () => {
            expect(() => methodWithRequiredNameWithParam(null)).toThrowError("Name is required");
        });
    });
    describe("null", () => {
        it("throws error on null value", () => {
            expect(() => methodWithRequiredObject(null)).toThrowError();
        });
        it("does not throw error on valid value", () => {
            expect(() => methodWithRequiredObject({})).not.toThrowError();
        });
    });
    describe("expression", () => {
        it("throws error on invalide value", () => {
            expect(() => methodWithRequiredExpression(0)).toThrowError();
        });
        it("does not throw error on valid value", () => {
            expect(() => methodWithRequiredExpression(1)).not.toThrowError();
        });
    });
});
