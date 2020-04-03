import React from 'react';
import {useSpring, animated} from 'react-spring';
import {valueConvert} from '../../utils/tools';

interface Iprops {
  info: any
}

const Element:React.FC<Iprops> = ({info}) => {
  const {value, valueType, process, style, idx, highlight, lineHeight, fontWidth} = info;
  const showvalue = valueConvert(value, valueType);
  
  if (showvalue.charNums * fontWidth > style.to.width) {
    if (style.to.top) {
      style.to.top -= lineHeight;
      style.to.width = showvalue.charNums * fontWidth;
      if (style.from.top) style.from.top -= lineHeight;
    }
  }
  const spring = useSpring(style);
  const elementContained = () => {
    return (
      <animated.div
        style={process === 'enter' ? spring : style.to}
      >
        <animated.span>
          {showvalue.value.map((ch, index) => (
            <animated.span key={index} style={index === idx ? highlight : {}}>{ch}</animated.span>
            ))
          }
        </animated.span>
      </animated.div>
    )
  }
  
  return (
    <div>
      {elementContained()}
    </div>
  );
}

export default Element;
