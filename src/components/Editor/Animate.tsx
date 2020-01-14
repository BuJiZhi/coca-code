import React, { useState } from 'react';
import './Animate.css';
import { useSpring, animated, useTransition } from 'react-spring';
import { IanimateKey, Styles } from '../../types/store';

interface Ianimate {
  keyArr: IanimateKey,
  style: Styles
}

const Animate: React.FC<Ianimate> = ({keyArr, style}) => {
  const { lineHeight, fontWidth, fontSize, color,  } = style;
  const [reload, change] = useState(false);
  const springFac = (animateInfo:  IanimateKey) => {
    const { pos, payload, type, on } = animateInfo;
    switch (type) {
      case 'VariableDeclaration':
        return {
          from: {
            opacity: 0,
            left: `${payload.pos[0][1] * fontWidth}px`,
            top: `${payload.pos[0][0] * lineHeight + 3}px`,
            value: payload.payload.value
          },
          opacity: 1,
          left: `${pos[0][1] * fontWidth}px`,
          top: `${pos[0][0] * lineHeight + 3}px`,
          value: payload.payload.value,
        }
      case 'Literal':
        return {
          to: {
            color: 'blue',
            bold: 'normal',
            value: payload.value,
            left: `${pos[0][1] * fontWidth}px`,
            top: `${pos[0][0] * lineHeight + 3}px`,
          },
          from : {
            color: 'red',
          },
          config: {
            mass: 1
          }
        }
      default:
        return {};
    }
  }

  const commonStyle = {
    color,
    fontSize,
    position: 'absolute',
    zIndex: 10000
  }
  // @ts-ignore
  const props = useSpring(springFac(keyArr));
  return (
    reload 
    ? <animated.div 
      className="animateRoot" 
      style={{...commonStyle, ...props}}
      onClick={() => change(!reload)}
    >{ props.value }</animated.div>
    : <animated.div 
        className="animateRoot" 
        style={{...commonStyle, ...props}}
        onClick={() => change(!reload)}
      >{ props.value }</animated.div>
  );
}

export default Animate;
