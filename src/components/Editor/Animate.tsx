import React from 'react';
import './Animate.css';
import { useSpring,animated } from 'react-spring';
import { IanimateKey } from '../../types/store';

interface Ianimate {
  keyArr: IanimateKey
}


const Animate: React.FC<Ianimate> = ({keyArr}) => {
  const { pos, payload } = keyArr;
  // @ts-ignore
  const props = useSpring({
    to: {
      left: payload.to[0],
      top: payload.to[1],
      opacity: 1
    },
    from: {
      position: 'absolute',
      left: pos[0],
      top: pos[1],
      opaity: 0 
    }
  })
  return (
    <div>
      {
        // @ts-ignore
        keyArr.on
        ? <animated.div style={ props }>{ keyArr.payload.value }</animated.div>
        : ''
      }
    </div>
  );
}

export default Animate;
