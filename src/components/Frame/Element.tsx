import React from 'react';
import { useSpring, animated } from 'react-spring';
import { valueConvert } from '../../utils/tools';

interface Iprops {
  info: any
}

const Element: React.FC<Iprops> = ({info}) => {
  const { value, valueType, process, style } = info;  
  const spring = useSpring(style);
  return (
    <animated.div 
      style={ process === 'enter' ? spring : style.to }
    >
      { valueConvert(value, valueType) }
    </animated.div>
  );
}

export default Element;
