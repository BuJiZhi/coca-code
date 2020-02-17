import { sign } from "crypto";

interface Isignal {
  type: string,
  value: any
}

export default class Signal implements Isignal {
  
  type: string;
  value: any;

  constructor(type: string, value: any) {
    this.type = type;
    this.value = value;
  }

  static Return(value: any) {
    return new Signal('return', value);
  }

  static Break(label=null) {
    return new Signal('break', label)
  }

  static Continue(label: any) {
    return new Signal('continue', label)
  }

  static isReturn(signal: Isignal) {
    return signal instanceof Signal && signal.type === 'return';
  }

  static isBreak(signal: Isignal) {
    return signal instanceof Signal && signal.type === 'break';
  }

  static isContinue(signal: Isignal) {
    return signal instanceof Signal && signal.type === 'continue';
  }

  static isSignal(signal: Isignal) {
    return signal instanceof Signal;
  }
}