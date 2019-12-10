"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guard_1 = __importDefault(require("./guard"));
const tensorFlowBuilder_1 = require("./tensorFlowBuilder");
const tensorFlowHelpers_1 = require("./tensorFlowHelpers");
const tensorFlowRecordsProtoBuf_pb_1 = require("./tensorFlowRecordsProtoBuf_pb");
/**
 * @name - TFRecords Read Class
 * @description - Read a TFRecords object
 */
class TFRecordsReader {
    constructor(tfrecords) {
        guard_1.default.null(tfrecords);
        this.imageMessages = [];
        let position = 0;
        while (position < tfrecords.length) {
            const lengthBuffer = tfrecords.slice(position, position + 8);
            const dataLength = tensorFlowHelpers_1.readInt64(lengthBuffer);
            const lengthCrc = tensorFlowHelpers_1.maskCrc(tensorFlowHelpers_1.crc32c(lengthBuffer));
            position += 8;
            const expectedLengthCrc = tfrecords.readUInt32LE(position);
            position += 4;
            if (lengthCrc !== expectedLengthCrc) {
                console.log("Wrong Length CRC");
                break;
            }
            const dataBuffer = tfrecords.slice(position, position + dataLength);
            const dataCrc = tensorFlowHelpers_1.maskCrc(tensorFlowHelpers_1.crc32c(dataBuffer));
            position += dataLength;
            const expectedDataCrc = tfrecords.readUInt32LE(position);
            position += 4;
            if (dataCrc !== expectedDataCrc) {
                console.log("Wrong Data CRC");
                break;
            }
            // Deserialize TFRecord from dataBuffer
            const imageMessage = tensorFlowRecordsProtoBuf_pb_1.TFRecordsImageMessage.deserializeBinary(dataBuffer);
            this.imageMessages.push(imageMessage);
        }
    }
    /**
     * @description - Return the number of TFRecords read
     */
    get length() {
        return this.imageMessages.length;
    }
    /**
     * @description - Return the TFRecords in a JSON Object Array format
     */
    toArray() {
        return this.imageMessages.map((imageMessage) => imageMessage.toObject());
    }
    /**
     * @recordPos - Record Position
     * @key - Feature Key
     * @type - Feature Type
     * @description - Get a Int64 | Float | String | Binary value
     */
    getFeature(recordPos, key, type) {
        const message = this.imageMessages[recordPos];
        const feature = message.getContext().getFeatureMap().get(key);
        switch (type) {
            case tensorFlowBuilder_1.FeatureType.String:
                return tensorFlowHelpers_1.textDecode(feature.getBytesList().array[0][0]);
            case tensorFlowBuilder_1.FeatureType.Binary:
                return feature.getBytesList().array[0][0];
            case tensorFlowBuilder_1.FeatureType.Int64:
                return feature.getInt64List().array[0][0];
            case tensorFlowBuilder_1.FeatureType.Float:
                return feature.getFloatList().array[0][0];
        }
    }
    /**
     * @recordPos - Record Position
     * @key - Feature Key
     * @type - Feature Type
     * @description - Get an array of Int64 | Float | String | Binary value
     */
    getArrayFeature(recordPos, key, type) {
        const message = this.imageMessages[recordPos];
        const feature = message.getContext().getFeatureMap().get(key);
        switch (type) {
            case tensorFlowBuilder_1.FeatureType.String:
                return feature.getBytesList().array[0].map((buffer) => tensorFlowHelpers_1.textDecode(buffer));
            case tensorFlowBuilder_1.FeatureType.Binary:
                return feature.getBytesList().array[0];
            case tensorFlowBuilder_1.FeatureType.Int64:
                return feature.getInt64List().array[0];
            case tensorFlowBuilder_1.FeatureType.Float:
                return feature.getFloatList().array[0];
        }
    }
}
exports.TFRecordsReader = TFRecordsReader;
