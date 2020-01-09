import React,{ useState } from 'react';
import './Element.css';
import { useSpring, animated  } from 'react-spring';

interface Ielement {
  content: string,
}

const Element: React.FC<Ielement> = ({content}) => {
  let text = content.replace(/\s/g, '&ensp;');
  const props = useSpring({
    opacity: 1,
    from: {opacity: 0}
  })
  return (
    <animated.span 
      className="element" 
      dangerouslySetInnerHTML={{__html: text}} 
      style={ props }
    />
  );
}

export default Element;
