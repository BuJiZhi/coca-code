import React from 'react';
import './Animate.css';
import { useSpring,animated } from 'react-spring';
import { IanimateKey, Styles } from '../../types/store';

interface Ianimate {
  keyArr: IanimateKey,
  style: Styles
}


const Animate: React.FC<Ianimate> = ({keyArr, style}) => {
  const { pos, payload, type, on } = keyArr;
  const { lineHeight, fontWidth, fontSize, color,  } = style;
  const propsTypes = {
    varibleDeclare: useSpring({
      from: {
        position: 'absolute'
      },
      to:{}
    }),
    Literal: useSpring({
      to: {
        color: 'blue',
        bold: 'normal'
      },
      from : {
        color: 'red',
      },
      config: {
        mass: 10
      }
    })
  }
  const commonStyle = {
    color,
    fontSize,
    position: 'absolute',
    left: `${pos[0][1] * fontWidth}px`,
    top: `${pos[0][0] * lineHeight + 3}px`,
    zIndex: 10000
  }
  // @ts-ignore
  const props = propsTypes[type];
  
  return (
    <div>
      {
        // @ts-ignore
        keyArr.on
        ? <animated.span 
            className="animateRoot" 
            style={{...commonStyle, ...props}}
          >{ keyArr.payload.value }</animated.span>
        : ''
      }
    </div>
  );
}

export default Animate;
