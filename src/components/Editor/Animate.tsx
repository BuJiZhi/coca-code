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
const springFac = (animatedInfo: IanimateKey): any => {
  const { type, pos, payload } = animatedInfo;
  switch (type) {
    case 'VariableDeclaration':
      return {
        from: {
          value: true
        },
        to: {

        },
        config: {

        },
        reset: true
      }
    case 'Literal':
      return {
        from: {
          color: 'red'
        },
        to: {
          color: 'green'
        },
        config: {

        },
        reset: true
      }
    default:
      return {value: ''};
  }
}

const Animate: React.FC<Ianimate> = ({keyArr, style}) => {
  const props = useSpring(springFac(keyArr));
  return(
    // @ts-ignore
    <animated.div style={props}>
      { keyArr.payload.value }
    </animated.div>
  )
}

export default Animate;
