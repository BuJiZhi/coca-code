import {IsimpleValue, ImemberValue} from '../../types/compiler';
export const __pythonRuntime  = {
  ops: (a:number, b:number) => a + b,
  '=': (value:IsimpleValue | ImemberValue, v:any) => value.set(v),
  '+=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() + v),
  '-=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() - v),
  '*=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() * v),
  '/=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() / v),
  '%=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() % v),
  '**=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() ** v),
  '<<=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() << v) ,
  '>>=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() >> v),
  '>>>=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() >>> v),
  '|=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() | v),
  '^=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() ^ v),
  '&=': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() & v),
  '++': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() + 1),
  '--': (value:IsimpleValue | ImemberValue, v:any) => value.set(value.get() - 1),
}

let buildIn = {
  declartion:{
    __pythonRuntime
  }
};

export default buildIn;