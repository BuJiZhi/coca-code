import React from 'react';
import { useSpring, animated } from 'react-spring';

interface Iprops {
  info: any
}

const Element: React.FC<Iprops> = ({info}) => {
  const { value, process, style } = info;  
  const spring = useSpring(style);
  return (
    <animated.div 
      style={ process === 'enter' ? spring : style.to }
    >
      { value }
    </animated.div>
  );
}

export default Element;
