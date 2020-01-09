import { reg } from '../utils/jsTokens';
import { KeyboardEvent } from 'react';
import { IanimateKey } from '../types/store';

export interface DocType{
  code: string,
  doc: string[],
  tokens: string[][],
  lineSep: string,
  keyArr: IanimateKey,
  currentIndex: [number, number],
  init(): void,
  setIndex(idx: [number, number]): void,
  updateCode(s: string): void,
  code2doc(): void,
  tokenizer(): void,
  insertTextBefore(text: string, pos: [number, number]): string[],
  keyPressHandler(e: KeyboardEvent): void,
  keyDownHandler(e: KeyboardEvent): void,
  getValue(): string,
  // animateKeyArr(): void
}

export default class Doc implements DocType {

  code: string;
  doc: string[];
  tokens: string[][];
  lineSep: string;
  keyArr: IanimateKey;
  currentIndex:[number, number];
  
  constructor(
    code: string
    ) {
    this.code = code;
    this.doc = [];
    this.tokens = [];
    this.lineSep = '\n';
    this.keyArr = Object.create(null);
    this.currentIndex = [0, 0];
  }

  init(): void {
    this.code2doc();
    this.tokenizer()
  }

  setIndex(index: [number, number]) {
    const yScope = [0, this.doc.length - 1];
    if (index[1] < yScope[0]) index[1] = yScope[0];
    if (index[1] > yScope[1]) index[1] = yScope[1];
    const xScope = [0, this.doc[index[1]].length];
    if (index[0] < xScope[0]) index[0] = xScope[0];
    if (index[0] > xScope[1]) index[0] = xScope[1];
    this.currentIndex = index;
  }

  updateCode(newCode: string): void {
    this.code = newCode;
  }

  code2doc(): string[] {
    this.doc = this.code.split('\n');
    return this.doc;
  }

  tokenizer(): string[][] {
    for (let i: number = 0; i < this.doc.length; i++) {
      this.tokens[i] = this.doc[i].match(reg) || [''];
    }
    return this.tokens;
  }

  getValue(): string {
    if (typeof this.doc === 'string') return this.doc;
    else {
      return this.doc.join('\n');
    }
  }

  // animateKeyArr(): IanimateKey[][] {
  //   let keyArr: IanimateKey[][] = [];
  //   for (let i = 0; i < this.tokens.length; i++) {
  //     keyArr[i] = [];
  //     for (let j = 0; j < this.tokens[i].length; j++) {
  //       keyArr[i].push({
  //         type: 'init',
  //         on: false,
  //         payload: null
  //       });
  //     }
  //   }
  //   this.keyArr = keyArr;
  //   return this.keyArr;
  // }

  codeUpdateDoc(code: string): string[] {
    let doc = code.split('\n');
    this.doc = doc;
    return this.doc;
  }

  appendLine(line: string): string[] {
    this.doc.push(line);
    return this.doc;
  }

  insertLineAfter(line: string, pos: number): string[] {
    this.doc.splice(pos + 1, 0, line);
    return this.doc
  }

  popLine(pos: number, num: number): string[] {
    this.doc.splice(pos, num);
    return this.doc;
  }

  insertTextBefore(text: string, pos: [number, number]): string[] {
    let ln = this.doc[pos[1]];
    this.doc[pos[1]] = ln.slice(0, pos[0]) + text + ln.slice(pos[0], ln.length);
    return this.doc;
  }

  keyPressHandler(e: KeyboardEvent): void {
    // 回车
    switch (e.charCode) {
      case 13:
        let ln = this.doc[this.currentIndex[1]];
        const oldLine = ln.slice(0, this.currentIndex[0]) || '';
        const newLine = ln.slice(this.currentIndex[0], ln.length);
        this.doc[this.currentIndex[1]] = oldLine;
        this.insertLineAfter(newLine, this.currentIndex[1])
        this.setIndex([
          0,
          this.currentIndex[1] + 1
        ])
        break;
      default: 
        const c = String.fromCharCode(e.charCode);
        this.insertTextBefore(c, this.currentIndex);
        this.currentIndex[0] += 1;
        break;
    }
    this.tokenizer();
    // this.animateKeyArr();
  }

  keyDownHandler(e: KeyboardEvent): void {
    const [ch, ln] = this.currentIndex;
    const line: string = this.doc[ln];
    switch(e.keyCode) {
      // delete
      case 46:
        this.doc[ln] = line.slice(0, ch) + line.slice(ch + 1, line.length);
        break;
      // backspace
      case 8:
        this.doc[ln] = line.slice(0, ch - 1) + line.slice(ch, line.length);
        this.setIndex([ch - 1, ln])
        break;
      // up down left right
      case 37:
        this.setIndex([ch - 1, ln]);
        break;
      case 38:
        this.setIndex([ch, ln - 1]);
        break;
      case 39:
        this.setIndex([ch + 1, ln]);
        break;
      case 40:
        this.setIndex([ch, ln + 1]);
        break;
      default:
        break;
    }
    this.tokenizer();
    // this.animateKeyArr();
  }
  // static appendText(text, line) {
  //   this.doc[line] += text;
  // }

  // static popText(line, from, to) {
  //   let ln = this.doc[line];
  //   this.doc[line] = ln.slice(0, from) + ln.slice(to + 1, ln.length);
  // }

}
