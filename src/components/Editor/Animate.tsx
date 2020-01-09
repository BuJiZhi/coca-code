import React from 'react';
import './Animate.css';
import { useSpring, animated } from 'react-spring';
import { IanimateKey } from '../../types/store';

interface Ianimate {
  keyArr: IanimateKey
}

const Animate: React.FC<Ianimate> = ({keyArr}) => {
  console.log(keyArr)
  const props = useSpring({
    color: keyArr.on ? 'green' : 'red',
    opacity: 1,
    value: keyArr.payload.value,
    scroll: 100,
    from: {
      color: 'black',
      opacity: 0,
      scroll: 0
    }
  })
  return (
    <animated.div 
      className="animateRoot"
      style={ props }
  >
    <animated.span scrollTop={ props.scroll }/>
  </animated.div>
  );
}

export default Animate;
