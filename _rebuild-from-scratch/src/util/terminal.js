"use strict";
/**
 * @fileoverview Terminal utility.
 * @license Apache-2.0
 */
exports.__esModule = true;
exports.colorize = exports.setColorsEnabled = exports.isColorsEnabled = exports.COLOR_RESET = exports.COLOR_WHITE = exports.COLOR_CYAN = exports.COLOR_MAGENTA = exports.COLOR_BLUE = exports.COLOR_YELLOW = exports.COLOR_GREEN = exports.COLOR_RED = exports.COLOR_GRAY = void 0;
/** Gray terminal color code. */
exports.COLOR_GRAY = "\u001b[90m";
/** Red terminal color code. */
exports.COLOR_RED = "\u001b[91m";
/** Green terminal color code. */
exports.COLOR_GREEN = "\u001b[92m";
/** Yellow terminal color code. */
exports.COLOR_YELLOW = "\u001b[93m";
/** Blue terminal color code. */
exports.COLOR_BLUE = "\u001b[94m";
/** Magenta terminal color code. */
exports.COLOR_MAGENTA = "\u001b[95m";
/** Cyan terminal color code. */
exports.COLOR_CYAN = "\u001b[96m";
/** White terminal color code. */
exports.COLOR_WHITE = "\u001b[97m";
/** Terminal color reset code. */
exports.COLOR_RESET = "\u001b[0m";
/** Whether terminal colors are enabled or not. */
var colorsEnabled = true;
/** Checks whether terminal colors are enabled or not. */
function isColorsEnabled() {
    return colorsEnabled;
}
exports.isColorsEnabled = isColorsEnabled;
/** Sets whether terminal colors are enabled or not. */
function setColorsEnabled(isEnabled) {
    var wasEnabled = isEnabled;
    colorsEnabled = isEnabled;
    return wasEnabled;
}
exports.setColorsEnabled = setColorsEnabled;
/** Wraps the specified text in the specified terminal color code. */
function colorize(text, color) {
    return colorsEnabled ? color + text + exports.COLOR_RESET : text;
}
exports.colorize = colorize;
