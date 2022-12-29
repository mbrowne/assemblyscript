"use strict";
/**
 * @fileoverview Various collections utility.
 * @license Apache-2.0
 */
exports.__esModule = true;
exports.BitSet = exports.mergeMaps = exports.cloneMap = void 0;
/** Clone map. Typically used to track contextual type arguments. */
function cloneMap(map) {
    if (!ASC_TARGET) { // JS
        // fast path for js target
        return new Map(map);
    }
    else {
        var out = new Map();
        if (map) {
            // TODO: for (let [k, v] of map) {
            for (var _keys = Map_keys(map), i = 0, k = _keys.length; i < k; ++i) {
                var k_1 = unchecked(_keys[i]);
                var v = assert(map.get(k_1));
                out.set(k_1, v);
            }
        }
        return out;
    }
}
exports.cloneMap = cloneMap;
/** Merge two maps in into new one. */
function mergeMaps(map1, map2) {
    if (!ASC_TARGET) { // JS
        var out_1 = new Map(map1);
        map2.forEach(function (v, k) { return out_1.set(k, v); });
        return out_1;
    }
    else {
        var out = new Map();
        // TODO: for (let [k, v] of map1) {
        for (var _keys = Map_keys(map1), i = 0, k = _keys.length; i < k; ++i) {
            var k_2 = unchecked(_keys[i]);
            var v = assert(map1.get(k_2));
            out.set(k_2, v);
        }
        // TODO: for (let [k, v] of map2) {
        for (var _keys = Map_keys(map2), i = 0, k = _keys.length; i < k; ++i) {
            var k_3 = unchecked(_keys[i]);
            var v = assert(map2.get(k_3));
            out.set(k_3, v);
        }
        return out;
    }
}
exports.mergeMaps = mergeMaps;
/** BitSet represent growable sequence of N bits. It's faster alternative of Set<i32> when elements
 * are not too much sparsed. Also it's more memory and cache efficient than Array<bool>.
 * The best way to use it for short bit sequences (less than 32*(2**16)).
 */
var BitSet = /** @class */ (function () {
    function BitSet() {
        this.clear();
    }
    Object.defineProperty(BitSet.prototype, "size", {
        get: function () {
            var count = 0;
            var words = this.words;
            for (var i = 0, len = words.length; i < len; i++) {
                var word = unchecked(words[i]);
                if (word)
                    count += popcnt(word);
            }
            return count;
        },
        enumerable: false,
        configurable: true
    });
    BitSet.prototype.add = function (index) {
        var idx = index >>> 5;
        var words = this.words;
        if (idx >= words.length) { // resize
            this.words = new Uint32Array(idx + 16);
            this.words.set(words);
            words = this.words;
        }
        unchecked(words[idx] |= 1 << index);
        return this;
    };
    BitSet.prototype["delete"] = function (index) {
        var idx = index >>> 5;
        var words = this.words;
        if (idx >= words.length)
            return;
        unchecked(words[idx] &= ~(1 << index));
    };
    BitSet.prototype.has = function (index) {
        var idx = index >>> 5;
        var words = this.words;
        if (idx >= words.length)
            return false;
        return (unchecked(words[index >>> 5]) & (1 << index)) !== 0;
    };
    BitSet.prototype.clear = function () {
        this.words = new Uint32Array(16);
    };
    BitSet.prototype.toArray = function () {
        var res = new Array(this.size);
        for (var i = 0, p = 0, len = this.words.length; i < len; ++i) {
            var word = unchecked(this.words[i]);
            while (word) {
                var mask = word & -word;
                unchecked(res[p++] = (i << 5) + popcnt(mask - 1));
                word ^= mask;
            }
        }
        return res;
    };
    BitSet.prototype.toString = function () {
        return "BitSet { ".concat(this.toArray(), " }");
    };
    return BitSet;
}());
exports.BitSet = BitSet;
