// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export define Foo {
  method(a: i32): i32 {
    return a;
  }
}
