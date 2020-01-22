import React, { useState } from 'react';
import './Animate.css';
import { useSpring, animated, useTransition } from 'react-spring';
import { IanimateKey, Styles } from '../../types/store';
// reset
interface Ianimate {
  keyArr: IanimateKey,
  style: Styles
}

const calc = (x: number ,y: number) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 2, 1.1];
const trans = (x: number, y: number, s: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
const posFac = (pos: [number, number], fontWidth: number, lineHeight: number): {left: string, top: string} => 
  ({left: `${pos[1] * fontWidth}px`, top: `${pos[0] * lineHeight}px`})
const springFac = (animatedInfo: IanimateKey, style:any): any => {
  const { type, pos, payload } = animatedInfo;
  const { fontWidth, lineHeight } = style;
  let startPos: {left: string, top: string};
  let endPos: {left: string, top: string};
  switch (type) {
    case 'VariableDeclaration':
      startPos = posFac(payload.pos[0], fontWidth, lineHeight);
      endPos = posFac(pos[0], fontWidth, lineHeight);
      console.log(startPos)
      console.log(endPos)
      return {
        from: {
          value: payload.payload.value,
          opacity: 1,
          ...startPos
        },
        to: {
          value: payload.payload.value,
          opacity: 0.3,
          ...endPos
        },
        config: {

        },
        reset: true
      }
    case 'Literal':
      startPos = posFac(pos[0], fontWidth, lineHeight);
      return {
        from: {
          color: 'red',
          value: payload.value,
          fontSize: '20px',
          opacity: 0,
          ...startPos
        },
        to: {
          color: 'green',
          fontSize: '30px',
          value: payload.value,
          opacity: 1,
          ...startPos
        },
        config: {
          mass: 3
        },
        reset: true
      }
    default:
      return {};
  }
}

const commonStyle = {
  position: 'absolute'
}

const Animate: React.FC<Ianimate> = ({keyArr, style}) => {
  console.log(keyArr)
  const props = useSpring(springFac(keyArr, style));
  // @ts-ignore
  const { value } = props;
  return(
    // @ts-ignore
    <animated.div style={{...commonStyle, ...props}}>
      { value }
    </animated.div>
  )
}

export default Animate;
