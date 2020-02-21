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
        { valueConvert(value, valueType) }
      </animated.span>
    </animated.div>
  );
}

export default Element;
