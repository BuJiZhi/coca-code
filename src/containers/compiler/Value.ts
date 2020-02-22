import { IsimpleValue, ImemberValue } from '../../types/compiler';

export default class SimpleValue implements IsimpleValue {
  
  kind: string;
  // type: ValueType;
  value: any;

  constructor(value: any, kind: string) {
    this.value = value;
    this.kind = kind;
  }

  get(): any {
    return this.value;
  }

  set(value: any): any {
    if (this.kind === 'const') {
      throw new Error(`assignment of constant`)
    } else {
      this.value = value;
      return this.value;
    }
  }
}

export class MemberValue implements ImemberValue {
  
  obj:object;
  prop:string;
  
  constructor(obj:object, prop:string) {
    this.obj = obj;
    this.prop = prop;
  }

  set(value:any) {
    const that:any = this;
    that.obj[this.prop] = value;
    return value;
  }

  get() {
    const that:any = this;
    return that.obj[that.prop];
  }

}