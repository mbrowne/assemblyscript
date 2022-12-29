"use strict";
/**
 * @fileoverview Various binary reading and writing utility.
 * @license Apache-2.0
 */
exports.__esModule = true;
exports.writeV128 = exports.readV128 = exports.writeF64 = exports.readF64 = exports.writeF32 = exports.readF32 = exports.writeI64AsI32 = exports.writeI64 = exports.readI64 = exports.writeI32AsI64 = exports.writeI32 = exports.readI32 = exports.writeI16 = exports.readI16 = exports.writeI8 = exports.readI8 = void 0;
/** Reads an 8-bit integer from the specified buffer. */
function readI8(buffer, offset) {
    return buffer[offset];
}
exports.readI8 = readI8;
/** Writes an 8-bit integer to the specified buffer. */
function writeI8(value, buffer, offset) {
    buffer[offset] = value;
}
exports.writeI8 = writeI8;
/** Reads a 16-bit integer from the specified buffer. */
function readI16(buffer, offset) {
    return i32(buffer[offset])
        | i32(buffer[offset + 1]) << 8;
}
exports.readI16 = readI16;
/** Writes a 16-bit integer to the specified buffer. */
function writeI16(value, buffer, offset) {
    buffer[offset] = value;
    buffer[offset + 1] = value >>> 8;
}
exports.writeI16 = writeI16;
/** Reads a 32-bit integer from the specified buffer. */
function readI32(buffer, offset) {
    return i32(buffer[offset])
        | i32(buffer[offset + 1]) << 8
        | i32(buffer[offset + 2]) << 16
        | i32(buffer[offset + 3]) << 24;
}
exports.readI32 = readI32;
/** Writes a 32-bit integer to the specified buffer. */
function writeI32(value, buffer, offset) {
    buffer[offset] = value;
    buffer[offset + 1] = value >>> 8;
    buffer[offset + 2] = value >>> 16;
    buffer[offset + 3] = value >>> 24;
}
exports.writeI32 = writeI32;
/** Writes a 32-bit integer as a 64-bit integer to the specified buffer. */
function writeI32AsI64(value, buffer, offset, unsigned) {
    if (unsigned === void 0) { unsigned = false; }
    writeI32(value, buffer, offset);
    writeI32(unsigned || value >= 0 ? 0 : -1, buffer, offset + 4);
}
exports.writeI32AsI64 = writeI32AsI64;
/** Reads a 64-bit integer from the specified buffer. */
function readI64(buffer, offset) {
    var lo = readI32(buffer, offset);
    var hi = readI32(buffer, offset + 4);
    return i64_new(lo, hi);
}
exports.readI64 = readI64;
/** Writes a 64-bit integer to the specified buffer. */
function writeI64(value, buffer, offset) {
    writeI32(i64_low(value), buffer, offset);
    writeI32(i64_high(value), buffer, offset + 4);
}
exports.writeI64 = writeI64;
/** Writes a 64-bit integer as a 32-bit integer to the specified buffer. */
function writeI64AsI32(value, buffer, offset, unsigned) {
    if (unsigned === void 0) { unsigned = false; }
    assert(unsigned ? i64_is_u32(value) : i64_is_i32(value));
    writeI32(i64_low(value), buffer, offset);
}
exports.writeI64AsI32 = writeI64AsI32;
/** Reads a 32-bit float from the specified buffer. */
function readF32(buffer, offset) {
    return i32_as_f32(readI32(buffer, offset));
}
exports.readF32 = readF32;
/** Writes a 32-bit float to the specified buffer. */
function writeF32(value, buffer, offset) {
    writeI32(f32_as_i32(value), buffer, offset);
}
exports.writeF32 = writeF32;
/** Reads a 64-bit float from the specified buffer. */
function readF64(buffer, offset) {
    return i64_as_f64(readI64(buffer, offset));
}
exports.readF64 = readF64;
/** Writes a 64-bit float to the specified buffer. */
function writeF64(value, buffer, offset) {
    var valueI64 = f64_as_i64(value);
    writeI32(i64_low(valueI64), buffer, offset);
    writeI32(i64_high(valueI64), buffer, offset + 4);
}
exports.writeF64 = writeF64;
/** Reads a 128-bit vector from the specified buffer. */
function readV128(buffer, offset) {
    return buffer.slice(offset, offset + 16);
}
exports.readV128 = readV128;
/** Writes a 128-bit vector to the specified buffer. */
function writeV128(value, buffer, offset) {
    assert(value.length == 16);
    buffer.set(value, offset);
}
exports.writeV128 = writeV128;
