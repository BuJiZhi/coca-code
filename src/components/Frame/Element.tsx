import React from 'react';
import { useSpring, animated } from 'react-spring';
import { valueConvert } from '../../utils/tools';

interface Iprops {
  info: any
}

const Element: React.FC<Iprops> = ({info}) => {
  const { value, valueType, process, style } = info;
  const { height, lineHeight } = style;  
  const spring = useSpring(style);
  const string2arr = (str:string) => {
    if (typeof str !== 'string') {return [];}
    let arr = [];
    for (let i = 0; i < str.length; i++) {
      arr.push(str.charAt(i));
    }
    return arr;
  }
  const showvalue = string2arr(valueConvert(value, valueType));
  return (
    <animated.div
      style={ process === 'enter' ? spring : style.to }
    >
      <animated.span
        style={{
          height, 
          lineHeight
        }}
      >
        {showvalue.map((ch, index) => (
          <animated.span key={index}>{ch}</animated.span>
          ))
        }
      </animated.span>
    </animated.div>
  );
}

export default Element;
