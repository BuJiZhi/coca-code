import {Itoken} from '../../types/compiler';

interface Itoenizer {
  input: string;
  tokens: Itoken[];
  pos: number;
}

function isSubstring(str:string, sub:string) {
  const strList = str.split(" ");
  return strList.indexOf(sub) === -1 ? false : true;
}

const KEY_WORDS = 'class def int str float print input';
const PARENS = '( ) [ ] : ';
const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const QUOTATION = /'|"/;
const LINE_BREAK = '\n';
const LETTERS = /[a-z]/i;

class Tokenizer implements Itoenizer{

  input: string;
  tokens: Itoken[];
  pos: number;

  constructor(input:string) {
    this.input = input;
    this.tokens = [];
    this.pos = 0;
  }

  addToken(type:string, value:string, start:number, end:number) {
    const token = {type, value, start, end};
    this.tokens.push(token);
  }

  walk() {
    let {pos, input} = this;
    while (pos < input.length) {
      let char = input[pos];
      let isNewline = true;
      if (isSubstring(char, PARENS)) {
        this.addToken('paren', '(', pos, ++pos);
        continue;
      }
      if (char === LINE_BREAK) {
        let value = '';
        const start = pos;
        while (NUMBERS.test(char)) {
          value += char;
          char = input[++pos];
        }
        this.addToken('number', value, start, pos);
        continue;
      }
      if (WHITESPACE.test(char)) {
        if (isNewline) {
          let value = ' ';
          let start = pos;
          let char = input[++pos];
          while (WHITESPACE.test(char)) {
            value += ' ';
            char = input[++pos];
          }
          this.addToken('paren', value, start, pos);
        } else {
          pos++;
        }
        continue;
      }
      if (NUMBERS.test(char)) {
        let value = '';
        const start = pos;
        while (NUMBERS.test(char)) {
          value += char;
          char = input[++pos];
        }
        this.addToken('number', value, start, pos);
        continue;
      }
      if (QUOTATION.test(char)) {
        const quot = char;
        let value = '';
        const start = pos;
        char = input[++pos];
        while (char !== quot) {
          value += char;
          char = input[++pos];
          if (char === LINE_BREAK) {
            throw new SyntaxError('Missing quotation');
          }
        }
        this.addToken('string', value, start, pos++)
        char = input[pos];
        continue;
      }
      if (LETTERS.test(char)) {
        let value = '';
        const start = pos;
        while (LETTERS.test(char)) {
          value += char;
          char = input[++pos];
        }
        this.addToken('name', value, start, pos);
        char = input[pos];
        continue;
      }
      throw new TypeError('I dont know what this character is: ' + char);
    }
  }
}

export default Tokenizer;