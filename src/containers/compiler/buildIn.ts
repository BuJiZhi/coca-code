export const __pythonRuntime  = {
  ops: {
    add: (a:number, b:number) => a + b,
    multiply: (a:number, b:number) => a * b
  },
  objects: {
    list: function() {
      return new Array(arguments);
    }
  }
}

let buildIn = {
  declartion:{
    __pythonRuntime,
    Array: Array
  }
};

export default buildIn;