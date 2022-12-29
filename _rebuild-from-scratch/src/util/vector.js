"use strict";
/**
 * @fileoverview Various vector utility.
 * @license Apache-2.0
 */
exports.__esModule = true;
exports.v128_ones = exports.v128_zero = void 0;
/** v128 zero constant. */
exports.v128_zero = new Uint8Array(16);
/** v128 all ones constant. */
exports.v128_ones = new Uint8Array(16).fill(0xFF);
