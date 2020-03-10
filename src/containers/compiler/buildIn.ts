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

const values = {
  Array: String,
  true: true,
  false: false
}

let buildIn = {
  declartion:{
    __pythonRuntime,
   ...values
  }
};

export default buildIn;