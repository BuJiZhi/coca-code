import React, {useEffect, useState} from 'react';
import Element from './Element';
import {Ieditor} from '../../types/editor';
import { IsingleFrame, Ispring } from '../../types/animation';
import produceSpring from './produceSpring';

interface Iprops {
  fontWidth: number;
  lineHeight: number;
  frame: IsingleFrame;
}

const Display: React.FC<Iprops> = ({fontWidth, lineHeight, frame}) => {
  const [springLst, setSpring] = useState([] as Ispring[]);
  useEffect(() => {
    if (frame) {
      let springTemp:Ispring[] = [];
      for (let i = 0; i < frame.length; i++) {
        springTemp.push(produceSpring(frame[i], fontWidth, lineHeight));
      }
      setSpring(springTemp);
    }
  }, [frame])
  return (
    <div>
      {springLst.map((item) =>
        <Element info={ item } key= { item.key }/>)
      }
    </div>
  )
}

export default Display;