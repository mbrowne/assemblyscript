"use strict";
/**
 * @fileoverview Various math utility.
 * @license Apache-2.0
 */
exports.__esModule = true;
exports.accuratePow64 = exports.isPowerOf2 = void 0;
/** Tests if `x` is a power of two. */
function isPowerOf2(x) {
    return x != 0 && (x & (x - 1)) == 0;
}
exports.isPowerOf2 = isPowerOf2;
function accuratePow64(x, y) {
    if (!ASC_TARGET) { // ASC_TARGET == JS
        // Engines like V8, WebKit and SpiderMonkey uses powi fast path if exponent is integer
        // This speculative optimization leads to loose precisions like 10 ** 208 != 1e208
        // or/and 10 ** -5 != 1e-5 anymore. For avoid this behaviour we are forcing exponent
        // to fractional form and compensate this afterwards.
        if (isFinite(y) && Math.abs(y) >= 2 && Math.trunc(y) == y) {
            if (y < 0) {
                return Math.pow(x, y + 0.5) / Math.pow(x, 0.5);
            }
            else {
                return Math.pow(x, y - 0.5) * Math.pow(x, 0.5);
            }
        }
    }
    return Math.pow(x, y);
}
exports.accuratePow64 = accuratePow64;
