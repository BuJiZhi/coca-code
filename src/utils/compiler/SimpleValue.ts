import { IsimpleValue } from '../../types/compiler';

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