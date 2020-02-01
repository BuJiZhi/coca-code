import React from 'react';
import { EditorState, Styles } from '../../types/store';
import { Iframe, Icontent, Ispring } from '../../types/animate';
import FrameSub from './FrameSub';

interface Iprops {
  editor: EditorState,
  ui: Styles,
  currentFrame: Iframe
}
const springFac = (content: Icontent, ui: Styles) => {
  const { key, type, startpos, endpos, value, process } = content;
  const { fontWidth, lineHeight, fontSize } = ui;
  let springs: Ispring = {
    key: "null",
    value,
    process,
    style: {
      opacity: 1
    }
  }
  const commonStyle = {
    position: 'absolute',
    zIndex: 1000,
    fontSize
  }
  switch(type) {
    case 't0':
      springs.style = {

      }
      break;
    case 't1':
      springs.style = {
        to:{
          fontWeight: 500,
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight
        },
        from: {
          fontWeight: 100
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

const Display: React.FC<Iprops> = ({editor, currentFrame, ui}) => {
  if (!currentFrame) return <div></div>;
  let springLst = [];
  for (let i = 0; i < currentFrame.length; i++) {
    springLst.push(springFac(currentFrame[i], ui));
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