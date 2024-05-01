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
const tensorFlowHelpers_1 = require("./tensorFlowHelpers");
describe("TFRecords Helper Functions", () => {
    describe("Run getInt64Buffer method test", () => {
        it("Check getInt64Buffer for number 164865", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.getInt64Buffer)(164865)).toEqual(new Buffer([1, 132, 2, 0, 0, 0, 0, 0]));
        }));
    });
    describe("Run getInt32Buffer method test", () => {
        it("Check getInt32Buffer for number 164865", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.getInt32Buffer)(164865)).toEqual(new Buffer([1, 132, 2, 0]));
        }));
    });
    describe("Run crc32c method test", () => {
        it("Check crc32c for number 164865", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.crc32c)(new Buffer([1, 132, 2, 0, 0, 0, 0, 0]))).toEqual(1310106699);
        }));
    });
    describe("Run maskCrc method test", () => {
        it("Check maskCrc for crc 1310106699", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.maskCrc)(1310106699)).toEqual(3944318725);
        }));
    });
    describe("Run integration of getInt32Buffer(maskCrc(crc32c(getInt64Buffer())) methods test", () => {
        it("Check maskCrc for for number 164865", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.getInt32Buffer)((0, tensorFlowHelpers_1.maskCrc)((0, tensorFlowHelpers_1.crc32c)((0, tensorFlowHelpers_1.getInt64Buffer)(164865)))))
                .toEqual(new Buffer([5, 135, 25, 235]));
        }));
    });
    describe("Run textEncode method test", () => {
        it("Check textEncode for string 'ABC123'", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.textEncode)("ABC123")).toEqual(new Uint8Array([65, 66, 67, 49, 50, 51]));
        }));
    });
    describe("Run textDecode method test", () => {
        it("Check textDecode for array [65, 66, 67, 49, 50, 51]", () => __awaiter(void 0, void 0, void 0, function* () {
            expect((0, tensorFlowHelpers_1.textDecode)(new Uint8Array([65, 66, 67, 49, 50, 51]))).toEqual("ABC123");
        }));
    });
});
