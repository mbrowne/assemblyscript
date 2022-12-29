const fs = require("fs");
const loader = require("../../lib/loader");
// const { WASI } = require('wasi');

// const wasi = new WASI({
//     args: process.argv,
//     env: process.env,
//     // preopens: {
//     //   '/sandbox': '/some/real/path/that/wasm/can/access'
//     // }
// });

// const imports = {
//     wasi_snapshot_preview1: wasi.wasiImport
// };

const wasmSourceFilename = process.env.NODE_ENV === 'development' ? 'untouched.wasm': 'optimized.wasm';

const wasmModule = loader.instantiateSync(fs.readFileSync(`${__dirname}/build/${wasmSourceFilename}`), {});
module.exports = wasmModule.exports;

// console.log('wasmModule', wasmModule)
// wasi.start(wasmModule.instance);

console.log(wasmModule.exports.add(1, 2));
