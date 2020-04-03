import {Ieffect, Ispring} from '../../types/animation';
const produceSpring = (content:Ieffect, fontWidth:number, lineHeight:number) => {
  const {key, type, startpos, endpos, value, valueType, process, idx} = content;
  startpos.line -= 1;
  endpos.line -= 1;
  const gutterWidth = 32;
  const paddingHeight = 4;
  let springs:Ispring = {
    key,
    value,
    valueType,
    process,
    idx,
    fontWidth,
    lineHeight,
    highlight: {
      backgroundColor: "rgb(0, 0, 255)"
    },
    style: {
      opacity: 1,
      reset: true
    }
  }
  const outlined = {
    boxSizing: "border-box",
    backgroundColor: "rgb(82, 139, 255)",
    color: "rgb(206, 203, 236)",
    width: Math.abs(endpos.column - startpos.column) * fontWidth,
    border: "1px solid rgba(245, 245, 245, .05)",
    borderRadius: "2px",
    textAlign: "center",
    overflow: "hidden",
    
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
          top: (startpos.line) * lineHeight + paddingHeight,
          width: "100%",
          height: `${lineHeight * (endpos.line - startpos.line + 1)}px`,
          backgroundColor: "#666",
          opacity: 0.3,
          zIndex: 0
        }
      }
      break;
    case 'appear': // 翻转？
      springs.style = {
        to:{
          left: startpos.column * fontWidth + gutterWidth,
          top: startpos.line * lineHeight + paddingHeight,
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
          left: startpos.column * fontWidth + gutterWidth,
          top: startpos.line * lineHeight + paddingHeight,
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
          left: endpos.column * fontWidth + gutterWidth,
          top: endpos.line * lineHeight + paddingHeight,
          ...outlined,
          opacity: 0
        },
        from: {
          left: startpos.column * fontWidth + gutterWidth,
          top: startpos.line * lineHeight + paddingHeight,
          opacity: 1
        }
      }
      break;
    case 'block':
      springs.style = {

      }
    case 'list_appear':
      springs.style = {
        
      }
    default:
      break;
  } 
  springs.style.from = {...common, ...springs.style.from}
  springs.style.to = {...common, ...springs.style.to}
  return springs;
}

export default produceSpring;