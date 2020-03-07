function isSubstring(sub, str) {
  const strList = str.split(" ");
  console.log(strList);
  return strList.indexOf(sub) === -1 ? false : true;
}

const KEY_WORDS = 'class def int str float print input';
console.log(isSubstring('c', KEY_WORDS));
console.log('"""""dfsd')
let pos = 1;
console.log(pos, ++pos)