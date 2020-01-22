import React from 'react';
import { EditorState } from '../../types/store';
import { Iframe, Icontent, Ispring } from '../../types/animate';
import FrameSub from './FrameSub';

interface Iprops {
  editor: EditorState,
  currentFrame: Iframe
}
const springFac = (content: Icontent) => {
  const { key, type, startpos, endpos, value, process } = content;
  let springs: Ispring = {
    key: "null",
    value,
    process,
    style: {
      opacity: 1
    }
  }
  const commonStyle = {
    position: 'absolute'
  }
  switch(type) {
    case 't0':
      springs.style = {

      }
      break;
    case 't1':
      springs.style = {
        to:{
          fontSize: '3rem'
        },
        from: {
          fontSize: '2rem'
        }
      }
      break;
    case 't2':
      springs.style = {
        to: {
          left: '100px'
        },
        from: {
          left: '300px'
        }
      }
      break;
    case 't3': {
      springs.style = {
        to: {
          color: 'red'
        },
        from: {
          color: 'green'
        }
      }
      break;
    }
    default:
      break;
  }
  springs.key = key;
  springs.style.reset = true;
  springs.style.from = {...commonStyle, ...springs.style.from}
  return springs;
}

const Display: React.FC<Iprops> = ({editor, currentFrame}) => {
  let springLst = [];
  for (let i = 0; i < currentFrame.length; i++) {
    springLst.push(springFac(currentFrame[i]));
  }
  return (
    <div>
      {springLst.map((item) =>
        <FrameSub info={ item } key= { item.key }/>)
      }
    </div>
  )
}

export default Display;