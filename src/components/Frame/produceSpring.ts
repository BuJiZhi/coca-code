import {Ieffect, Ispring} from '../../types/animation';
const produceSpring = (content:Ieffect, fontWidth:number, lineHeight:number) => {
  const {key, type, startpos, endpos, value, valueType, process} = content;
  const gutterWidth = 32;
  const paddingHeight = 4;
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
    boxSizing: "border-box",
    backgroundColor: "rgb(82, 139, 255)",
    color: "rgb(206, 203, 236)",
    width: (endpos[1] - startpos[1]) * fontWidth + 2,
    borderRadius: "2px",
    textAlign: "center",
    overflow: "hidden"
  }
  const common = {
    display: 'block',
    position: 'absolute',
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 1000,
    fontWeight: 500,
    fontSize: lineHeight - 8,
    lineHeight: `${lineHeight}px`,
    height: `${lineHeight}px`
  }
  switch(type) {
    case 'default':
      springs.style = {}
      break;
    case 'base':
      springs.style = {
        to: {
          top: (startpos[0]) * lineHeight + paddingHeight,
          width: "100%",
          height: `${lineHeight * (endpos[0] - startpos[0] + 1)}px`,
          backgroundColor: "#fff",
          opacity: 0.1,
          zIndex: 0
        }
      }
      break;
    case 'appear': // 翻转？
      springs.style = {
        to:{
          left: startpos[1] * fontWidth + gutterWidth,
          top: (startpos[0]) * lineHeight + paddingHeight,
          ...outlined
        },
        from: {
          height: `${lineHeight}px`
        }
      }
      break;
    case 'compute':
      springs.style = {
        to: {
          left: startpos[1] * fontWidth + gutterWidth,
          top: startpos[0] * lineHeight + paddingHeight,
          ...outlined,
          backgroundColor: "rgb(255, 171, 25)",
          color: "rgb(255, 255, 255)"
        },
        from: {
        }
      }
      break;
    case 'move': 
      springs.style = {
        to: {
          color: 'red',
          left: endpos[1] * fontWidth + gutterWidth,
          top: endpos[0] * lineHeight + paddingHeight,
          ...outlined,

          opacity: 0,
        },
        from: {
          color: 'green',
          left: startpos[1] * fontWidth + gutterWidth,
          top: startpos[0] * lineHeight + paddingHeight,
          opacity: 1
        }
      }
      break;
    case 'block':
      springs.style = {

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