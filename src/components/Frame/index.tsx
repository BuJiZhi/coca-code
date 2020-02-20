import React from 'react';
import Element from './Element';
import {Ieditor} from '../../types/editor';
import { IsingleFrame } from '../../types/animation';
import produceSpring from './produceSpring';

interface Iprops {
  editor: Ieditor,
  frame: IsingleFrame
}

const Display: React.FC<Iprops> = ({editor, frame}) => {
  if (!frame) return <div></div>;
  let springLst = [];
  for (let i = 0; i < frame.length; i++) {
    springLst.push(produceSpring(frame[i], editor));
  }
  return (
    <div>
      {springLst.map((item) =>
        <Element info={ item } key= { item.key }/>)
      }
    </div>
  )
}

export default Display;