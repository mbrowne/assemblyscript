// The entry file of your WebAssembly module.

export func add(a: i32, b: i32): i32 {
  return a + b;
}

export define Foo {
  someMethod(a: i32): i32 {
    return a;
  }
}
