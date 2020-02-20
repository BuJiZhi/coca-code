import {Ieffect, Ispring} from '../../types/animation';
import {Ieditor} from '../../types/editor';
const produceSpring = (content:Ieffect, editor:Ieditor) => {
  const {key, type, startpos, endpos, value, valueType, process} = content;
  const {fontWidth, lineHeight} = editor;
  let springs:Ispring = {
    key,
    value,
    valueType,
    process,
    style: {
      opacity: 1,
      reset: true
    }
  }
  const outlined = {
    backgroundColor: "#fff",
    border: "1px solid #aaa",
    borderRadius: "3px",
    width: (endpos[1] - startpos[1]) * fontWidth,
    textAlign: "center",
    overflow: "hidden"
  }
  const common = {
    position: 'absolute',
    zIndex: 1000,
    fontSize: lineHeight
  }
  switch(type) {
    case 'default':
      springs.style = {}
      break;
    case 'appear':
      springs.style = {
        to:{
          fontWeight: 500,
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight,
          ...outlined
        },
        from: {
          fontWeight: 100
        }
      }
      break;
    case 'compute':
      springs.style = {
        to: {
          left: startpos[1] * fontWidth,
          top: startpos[0] * lineHeight,
          fontWeight: 500,
          ...outlined
        },
        from: {
          fontWeight: 100
        }
      }
      break;
    case 'move': {
      springs.style = {
        to: {
          color: 'red',
          left: endpos[1] * fontWidth,
          top: endpos[0] * lineHeight,
          ...outlined,
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
    // case 't4':
    //   springs.style = {
    //     to: {
    //       opacity: 1,
    //       left: startpos[1] * fontWidth,
    //       top: startpos[0] * lineHeight,
    //       backgroundColor: "#fff",
    //       border: "1px solid #aaa",
    //       borderRadius: "3px",
    //       width: (endpos[1] - startpos[1]) * fontWidth,
    //       textAlign: "center",
    //       overflow: "hidden"
    //     },
    //     from: {
    //       opacity: 0
    //     }
    //   }
    //   break;
    // case 't5':
    //   springs.style = {
    //     to: {
    //       opacity: 1,
    //       left: startpos[1] * fontWidth,
    //       top: startpos[0] * lineHeight,
    //       backgroundColor: "#fff",
    //       border: "1px solid #aaa",
    //       value: `Declare function: ${value}`,
    //       borderRadius: "3px",
    //       // width: (endpos[1] - startpos[1]) * fontWidth,
    //       textAlign: "center",
    //       // overflow: "hidden"
    //     },
    //     from: {
    //       opacity: 0
    //     }
    //   }
    default:
      break;
  }
  springs.style.from = {...common, ...springs.style.from}
  springs.style.to = {...common, ...springs.style.to}
  return springs;
}

export default produceSpring;