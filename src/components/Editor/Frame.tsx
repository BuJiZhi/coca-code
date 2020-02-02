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
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight,
          fontWeight: 500
        },
        from: {
          fontWeight: 100
        }
      }
      break;
    case 't3': {
      springs.style = {
        to: {
          color: 'red',
          left: endpos[1] * fontWidth,
          top: endpos[0] * lineHeight,
          opacity: 0
        },
        from: {
          color: 'green',
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight,
          opacity: 1
        }
      }
      break;
    }
    case 't4':
      springs.style = {
        to: {
          opacity: 1,
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight,
          backgroundColor: "#fff",
          border: "1px solid #aaa",
          borderRadius: "3px",
          width: (endpos[1] - startpos[1]) * fontWidth,
          textAlign: "center",
        },
        from: {
          opacity: 0
        }
      }
      break;
    default:
      break;
  }
  springs.key = key;
  springs.style.reset = true;
  springs.style.from = {...commonStyle, ...springs.style.from}
  springs.style.to = {...commonStyle, ...springs.style.to}
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