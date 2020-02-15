import React from 'react';
import './index.css';
import './common/baseline.css';
import './common/theme.css';
import { Idisplay } from '../../containers/DisplayCon';
// import Measure from './Measure';

const Display:React.FC<Idisplay> = props => {
  const { ui } = props;
  const controlledStyle = {
    fontSize: `${ui.fontSize}px`,
    lineHeight: `${ui.lineHeight}px`,
    height: `${ui.lineHeight}px`
  }

  return (
    <div 
        className="display-root " 
        // ref={ this.containerRef }
        // onClick={ handleRootClick }
        // onKeyPress={ handleKeyPress }
        // onKeyDown={ handleKeyDown }
        // // 让div获取焦点
        // tabIndex={ 0 }
      >
        {/* <Measure 
          // updateFont={ updateFontWidth }
          // styles={ style }
        /> */}
        {/* <div className="common gutter">
          <div>
            <div></div>
          </div>
        </div>
        <div className="textarea">
          <textarea name="codeInput"></textarea>
      </div>*/}
        <div>
          <div style={controlledStyle}>
            hello world!
          </div>
        </div>
          {/* <div> */}
            {/* <PlayerCon />
            {/* <Cursor style={ style }/>
            { //lines
              doc.tokens.map((lineTokens, index) => 
                <Line 
                  lineStyle={ lineStyle }
                  lineTokens={ lineTokens }
                  key={ index }
                />)
            }
          </div>*/}
        {/* </div> */}
      </div>
  )
}

export default Display;
