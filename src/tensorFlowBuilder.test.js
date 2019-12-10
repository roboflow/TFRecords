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
const tensorFlowBuilder_1 = require("./tensorFlowBuilder");
describe("TFRecords Builder Functions", () => {
    describe("Check Adding Single Features", () => {
        let builder;
        beforeEach(() => {
            builder = new tensorFlowBuilder_1.TFRecordsBuilder();
        });
        it("Check addIntFeature", () => __awaiter(void 0, void 0, void 0, function* () {
            builder.addFeature("image/height", tensorFlowBuilder_1.FeatureType.Int64, 123);
            expect(builder.build()).toEqual(new Buffer([10, 23, 10, 21, 10, 12, 105, 109, 97, 103, 101, 47, 104,
                101, 105, 103, 104, 116, 18, 5, 26, 3, 10, 1, 123]));
        }));
        it("Check addFloatFeature", () => __awaiter(void 0, void 0, void 0, function* () {
            builder.addFeature("image/height", tensorFlowBuilder_1.FeatureType.Float, 123.0);
            expect(builder.build()).toEqual(new Buffer([10, 26, 10, 24, 10, 12, 105, 109, 97, 103, 101, 47, 104,
                101, 105, 103, 104, 116, 18, 8, 18, 6, 10, 4, 0, 0, 246, 66]));
        }));
        it("Check addStringFeature", () => __awaiter(void 0, void 0, void 0, function* () {
            builder.addFeature("image/height", tensorFlowBuilder_1.FeatureType.String, "123");
            expect(builder.build()).toEqual(new Buffer([10, 25, 10, 23, 10, 12, 105, 109, 97, 103, 101, 47, 104,
                101, 105, 103, 104, 116, 18, 7, 10, 5, 10, 3, 49, 50, 51]));
        }));
    });
    describe("Check single TFRecord generation with arrays", () => {
        let builder;
        it("Check releaseTFRecord", () => __awaiter(void 0, void 0, void 0, function* () {
            builder = new tensorFlowBuilder_1.TFRecordsBuilder();
            builder.addArrayFeature("image/height", tensorFlowBuilder_1.FeatureType.Int64, [1, 2]);
            builder.addArrayFeature("image/height", tensorFlowBuilder_1.FeatureType.Float, [1.0, 2.0]);
            builder.addArrayFeature("image/height", tensorFlowBuilder_1.FeatureType.String, ["1", "2"]);
            const buffer = builder.build();
            expect(buffer.length).toEqual(28);
            const tfrecords = tensorFlowBuilder_1.TFRecordsBuilder.buildTFRecords([buffer]);
            // 16 = 8bytes for Lenght + 4bytes for CRC(Length) + 4bytes CRC(buffer)
            const headersSize = 16;
            expect(tfrecords.length).toEqual(28 + headersSize);
        }));
    });
});
