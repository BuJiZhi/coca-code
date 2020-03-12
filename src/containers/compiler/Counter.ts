interface Icounter {
  trackCounter: number;
  basetrackCounter: number;
  keyCounter: number;
  stepCounter: number;
}

export default class Counter implements Icounter {

  trackCounter: number;
  basetrackCounter: number;
  keyCounter: number;
  stepCounter: number;

  constructor() {
    this.basetrackCounter = 0;
    this.keyCounter = 0;
    this.trackCounter = 0;
    this.stepCounter = 0;
  }

  getBasetrackcounte(isSkip:boolean) {
    if (isSkip) {
      return -1;
    } else {
      return this.basetrackCounter;
    }
  }

  getKeycount(isSkip:boolean) {
    if (isSkip) {
      return this.keyCounter;
    } else {
      this.keyCounter += 1;
      return this.keyCounter;
    }
  }

  getTrackcount(isSkip:boolean) {
    if (isSkip) {
      return -1;  // count为-1后面做删除处理
    } else {
      this.trackCounter += 1;
      return this.trackCounter - 1;  // 防止跳过0的情况
    }
  }

  getStepcount(isSkip:boolean) {
    if (isSkip) {
      return this.stepCounter === 0 ? 0 :  this.stepCounter - 1;
    } else {
       // 如果是一开始，不需要增加
      this.stepCounter += 1
      return this.stepCounter - 1;  // 防止跳过0的情况
    }
  }

  getKeyAndTrackCount(isSkip:boolean):[number, number] {
    return [
      this.getKeycount(isSkip),
      this.getTrackcount(isSkip)
    ]
  }

  getBaseKeyAndTrackCount(isSkip:boolean):[number, number] {
    return [
      this.getBasetrackcounte(isSkip),
      this.trackCounter
    ]
  }

}