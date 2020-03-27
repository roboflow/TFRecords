"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tensorFlowRecordsProtoBuf_pb_1 = require("./tensorFlowRecordsProtoBuf_pb");
const tensorFlowHelpers_1 = require("./tensorFlowHelpers");
const stream_1 = require("stream");
/**
 * @name - TFRecords Feature Type
 * @description - Defines the type of TFRecords Feature
 * @member String - Specifies a Feature as a string
 * @member Binary - Specifies a Feature as a binary UInt8Array
 * @member Int64 - Specifies a Feature as a Int64
 * @member Float - Specifies a Feature as a Float
 */
var FeatureType;
(function (FeatureType) {
    FeatureType[FeatureType["String"] = 0] = "String";
    FeatureType[FeatureType["Binary"] = 1] = "Binary";
    FeatureType[FeatureType["Int64"] = 2] = "Int64";
    FeatureType[FeatureType["Float"] = 3] = "Float";
})(FeatureType = exports.FeatureType || (exports.FeatureType = {}));
/**
 * @name - TFRecords Builder Class
 * @description - Create a TFRecords object
 */
class TFRecordsBuilder {
    constructor() {
        this.features = new tensorFlowRecordsProtoBuf_pb_1.Features();
    }
    /**
     * @records - An Array of TFRecord Buffer created with releaseTFRecord()
     * @description - Return a Buffer representation of a TFRecords object
     */
    static buildTFRecords(records) {
        return Buffer.concat(records.map((record) => {
            const length = record.length;
            // Get TFRecords CRCs for TFRecords Header and Footer
            const bufferLength = tensorFlowHelpers_1.getInt64Buffer(length);
            const bufferLengthMaskedCRC = tensorFlowHelpers_1.getInt32Buffer(tensorFlowHelpers_1.maskCrc(tensorFlowHelpers_1.crc32c(bufferLength)));
            const bufferDataMaskedCRC = tensorFlowHelpers_1.getInt32Buffer(tensorFlowHelpers_1.maskCrc(tensorFlowHelpers_1.crc32c(record)));
            // Concatenate all TFRecords Header, Data and Footer buffer
            return Buffer.concat([bufferLength,
                bufferLengthMaskedCRC,
                record,
                bufferDataMaskedCRC]);
        }));
    }
    /**
     * @records - An Array of TFRecord Buffer created with releaseTFRecord()
     * @description - Return a Readable Stream containing Buffers representating TFRecord objects
     */
    static buildTFRecordsAsStream(records, highWaterMark) {
        const transformer = this.transformStream(highWaterMark);
        records.forEach((r) => transformer.push(r));
        return transformer;
    }
    static transformStream(highWaterMark) {
        return new stream_1.Transform({
            transform: (record, _encoding, callback) => {
                const length = record.length;
                // Get TFRecords CRCs for TFRecords Header and Footer
                const bufferLength = tensorFlowHelpers_1.getInt64Buffer(length);
                const bufferLengthMaskedCRC = tensorFlowHelpers_1.getInt32Buffer(tensorFlowHelpers_1.maskCrc(tensorFlowHelpers_1.crc32c(bufferLength)));
                const bufferDataMaskedCRC = tensorFlowHelpers_1.getInt32Buffer(tensorFlowHelpers_1.maskCrc(tensorFlowHelpers_1.crc32c(record)));
                callback(undefined, Buffer.concat([bufferLength, bufferLengthMaskedCRC, record, bufferDataMaskedCRC]));
            },
            highWaterMark,
        });
    }
    /**
     * @key - Feature Key
     * @type - Feature Type
     * @value - A Int64 | Float | String | Binary value
     * @description - Add a Int64 | Float | String | Binary value feature
     */
    addFeature(key, type, value) {
        this.addArrayFeature(key, type, [value]);
    }
    /**
     * @key - Feature Key
     * @type - Feature Type
     * @value - An Array of Int64 | Float | String | Binary values
     * @description - Add an Array of Int64 | Float | String | Binary values feature
     */
    addArrayFeature(key, type, values) {
        const feature = new tensorFlowRecordsProtoBuf_pb_1.Feature();
        switch (type) {
            case FeatureType.String:
                const stringList = new tensorFlowRecordsProtoBuf_pb_1.BytesList();
                values.forEach((value) => {
                    stringList.addValue(tensorFlowHelpers_1.textEncode(value));
                });
                feature.setBytesList(stringList);
                break;
            case FeatureType.Binary:
                const byteList = new tensorFlowRecordsProtoBuf_pb_1.BytesList();
                values.forEach((value) => {
                    byteList.addValue(value);
                });
                feature.setBytesList(byteList);
                break;
            case FeatureType.Int64:
                const intList = new tensorFlowRecordsProtoBuf_pb_1.Int64List();
                values.forEach((value) => {
                    intList.addValue(value);
                });
                feature.setInt64List(intList);
                break;
            case FeatureType.Float:
                const floatList = new tensorFlowRecordsProtoBuf_pb_1.FloatList();
                values.forEach((value) => {
                    floatList.addValue(value);
                });
                feature.setFloatList(floatList);
                break;
            default:
                break;
        }
        const featuresMap = this.features.getFeatureMap();
        featuresMap.set(key, feature);
    }
    /**
     * @description - Return a Buffer representation of a single TFRecord
     */
    build() {
        // Get Protocol Buffer TFRecords object with exported image features
        const imageMessage = new tensorFlowRecordsProtoBuf_pb_1.TFRecordsImageMessage();
        imageMessage.setContext(this.features);
        // Serialize Protocol Buffer in a buffer
        const bytes = imageMessage.serializeBinary();
        return new Buffer(bytes);
    }
}
exports.TFRecordsBuilder = TFRecordsBuilder;
