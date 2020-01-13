function num2index(
  num,
  code
){
  let ln = 0;
  let ch = 0;
  let isbegin = 1;
  for (let i = 0; i < code.length && i <= num; i++) {
    if (code[i] === '\n') {
      ln += 1;
      isbegin = 1;
      ch = 0;
    } else {
      if (isbegin) {
        ch = 0;
        isbegin = 0;
      } else {
        ch += 1;
      }
    }
  }
  return [ln, ch]
}

function startend2Index(start, end, code) {
  return [num2index(start, code), num2index(end, code)]
}
