"use strict";
// A TFRecords file contains a sequence of strings with CRC
// hashes. Each record has the format
//
//     uint64 length
//     uint32 masked_crc32_of_length
//     byte   data[length]
//     uint32 masked_crc32_of_data
//
// and the records are concatenated together to produce the file. The
// CRC32s are described here, and the mask of a CRC is
//
//     masked_crc = ((crc >> 15) | (crc << 17)) + 0xa282ead8ul
//
// For more information, please refer to
// https://www.tensorflow.org/versions/master/api_docs/python/python_io.html#tfrecords-format-details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInt64 = exports.textDecode = exports.textEncode = exports.getInt32Buffer = exports.getInt64Buffer = exports.maskCrc = exports.crc32c = void 0;
// maskDelta is a magic number taken from
// https://github.com/tensorflow/tensorflow/blob/754048a0453a04a761e112ae5d99c149eb9910dd/
//    tensorflow/core/lib/hash/crc32c.h#L33.
// const maskDelta uint32 = 0xa282ead8
// mask returns a masked representation of crc.
const node_int64_1 = __importDefault(require("node-int64"));
const buffer_reverse_1 = __importDefault(require("buffer-reverse"));
const guard_1 = __importDefault(require("./guard"));
/**
 * @buffer - Buffer input
 * @description - Calculate 32-bit CRC using the Castagnoli polynomial (0x1EDC6F41)
 */
function crc32c(buffer) {
    guard_1.default.null(buffer);
    const polynomial = 0x1EDC6F41; // 0x04C11DB7 for crc32
    const initialValue = 0xFFFFFFFF;
    const finalXORValue = 0xFFFFFFFF;
    const table = [];
    let crc = initialValue;
    let i = 0;
    let j = 0;
    let c = 0;
    function reverse(x, n) {
        let b = 0;
        while (n) {
            b = b * 2 + x % 2;
            x /= 2;
            x -= x % 1;
            n--;
        }
        return b;
    }
    for (i = 255; i >= 0; i--) {
        c = reverse(i, 32);
        for (j = 0; j < 8; j++) {
            c = ((c * 2) ^ (((c >>> 31) % 2) * polynomial)) >>> 0;
        }
        table[i] = reverse(c, 32);
    }
    for (i = 0; i < buffer.length; i++) {
        c = buffer[i];
        if (c > 255) {
            throw new RangeError();
        }
        j = (crc % 256) ^ c;
        crc = ((crc / 256) ^ table[j]) >>> 0;
    }
    return (crc ^ finalXORValue) >>> 0;
}
exports.crc32c = crc32c;
/**
 * @value - Input CRC32 value
 * @description - Mask an input CRC32 value according to the TensorFlow TFRecords specs
 */
function maskCrc(value) {
    guard_1.default.null(value);
    const kCrc32MaskDelta = 0xa282ead8;
    const fourGb = Math.pow(2, 32);
    return (((value >>> 15) | (value << 17)) + kCrc32MaskDelta) % fourGb;
}
exports.maskCrc = maskCrc;
/**
 * @value - Input number value
 * @description - Get a Buffer representation of a Int64 bit value
 */
function getInt64Buffer(value) {
    guard_1.default.null(value);
    const metadataBuffer = new ArrayBuffer(8);
    const intArray = new Uint8Array(metadataBuffer, 0, 8);
    const dataView = new DataView(metadataBuffer, 0, 8);
    dataView.setUint32(4, 0, true);
    dataView.setUint32(0, value, true);
    return new Buffer(intArray);
}
exports.getInt64Buffer = getInt64Buffer;
/**
 * @value - Input number value
 * @description - Get a Buffer representation of a Int32 bit value
 */
function getInt32Buffer(value) {
    guard_1.default.null(value);
    const fourGb = Math.pow(2, 32);
    const value32 = value % fourGb;
    const metadataBuffer = new ArrayBuffer(4);
    const intArray = new Uint8Array(metadataBuffer, 0, 4);
    const dataView = new DataView(metadataBuffer, 0, 4);
    dataView.setUint32(0, value32, true);
    return new Buffer(intArray);
}
exports.getInt32Buffer = getInt32Buffer;
/**
 * @str - Input string
 * @description - Get a Uint8Array representation of an input string value
 */
function textEncode(str) {
    guard_1.default.null(str);
    const utf8 = unescape(encodeURIComponent(str));
    const result = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
    }
    return result;
}
exports.textEncode = textEncode;
/**
 * @arr - Input Uint8Array byte array
 * @description - Get a UTF8 string value
 */
function textDecode(arr) {
    guard_1.default.null(arr);
    const utf8 = Array.from(arr).map((item) => String.fromCharCode(item)).join("");
    return decodeURIComponent(escape(utf8));
}
exports.textDecode = textDecode;
/**
 * @buffer - Input buffer
 * @description - Read an Int64 value from buffer
 */
function readInt64(buffer) {
    guard_1.default.null(buffer);
    guard_1.default.expression(buffer.length, (num) => num >= 8);
    buffer = (0, buffer_reverse_1.default)(buffer.slice(0, 8));
    const int64 = new node_int64_1.default(buffer, 0);
    return int64.toNumber(true);
}
exports.readInt64 = readInt64;
