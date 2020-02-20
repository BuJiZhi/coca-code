/**
 * t0 默认类型(default)                     无动画效果
 * t1 变量定义名(identifier)                显示变量名字
 * t2 基础数值(literal)                     显示值
 * t3 变量定义/赋值(varialblledeclaration)  初始值移到变量名
 * t4 运算(binaryExpression)               显示运算结果
 * t5 函数定义(function declaration)       显示函数注册效果
 */
import React from 'react';
import { EditorState, Styles } from '../../types/feedback/store';
import { Iframe, Ieffect, Ispring } from '../../types/feedback/animate';
import FrameSub from './FrameSub';

interface Iprops {
  editor: EditorState,
  ui: Styles,
  currentFrame: Iframe
}
const springFac = (content: Ieffect, ui: Styles) => {
  const { key, type, startpos, endpos, value, valueType, process } = content;
  const { fontWidth, lineHeight, fontSize } = ui;
  let springs: Ispring = {
    key: "null",
    value,
    valueType,
    process,
    style: {
      opacity: 1
    }
  }
  const bottomFrame = {
    backgroundColor: "#fff",
    border: "1px solid #aaa",
    borderRadius: "3px",
    width: (endpos[1] - startpos[1]) * fontWidth,
    textAlign: "center",
    overflow: "hidden"
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
          top: startpos[0] * lineHeight,
          ...bottomFrame
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
          fontWeight: 500,
          ...bottomFrame
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
          ...bottomFrame,
          opacity: 0,
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
          overflow: "hidden"
        },
        from: {
          opacity: 0
        }
      }
      break;
    case 't5':
      springs.style = {
        to: {
          opacity: 1,
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight,
          backgroundColor: "#fff",
          border: "1px solid #aaa",
          value: `Declare function: ${value}`,
          borderRadius: "3px",
          // width: (endpos[1] - startpos[1]) * fontWidth,
          textAlign: "center",
          // overflow: "hidden"
        },
        from: {
          opacity: 0
        }
      }
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