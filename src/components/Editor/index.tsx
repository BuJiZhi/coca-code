import React, { Component } from 'react';
import './index.css';
import './common.css';
import Cursor from './Cursor';
import Line from './Line';
import Measure from './Measure';
import Animate from './Animate';
import { CustomOptions } from '../../containers/EditorCon';

export default class index extends Component<CustomOptions> {
  
  containerRef: React.RefObject<any>;

  constructor(props: CustomOptions) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.setOffset && this.containerRef.current) {
      this.props.setOffset([
        this.containerRef.current.getBoundingClientRect().left,
        this.containerRef.current.getBoundingClientRect().top
      ])
    }
  }
  
  render() {
    const { 
      style, 
      doc,
      updateFontWidth, 
      handleKeyPress, 
      handleRootClick,
      handleKeyDown
    } = this.props;
    const rootStyle = {
      fontSize: `${style.fontSize || 20}px`,
      lineHeight:`${style.lineHeight || 25}px`,
    }

    const lineStyle = {
      fontSize: `${style.fontSize || 20}px`,
      lineHeight:`${style.lineHeight || 25}px`,
      height:`${style.lineHeight || 25}px`,
      color: `rgb(${style.color || [0, 0, 0]})`
    }

    return (
      <div 
        className="common aditor-root" 
        style={ rootStyle }
        ref={ this.containerRef }
        onClick={ handleRootClick }
        onKeyPress={ handleKeyPress }
        onKeyDown={ handleKeyDown }
        // 让div获取焦点
        tabIndex={ 0 }
      >
        {/* measure */}
        <Measure 
          updateFont={ updateFontWidth }
          styles={ style }
        />
        {/* gutter */}
        <div className="common gutter">
          <div>
            <div></div>
          </div>
        </div>
        {/* input */}
        <div className="textarea">
          <textarea name="codeInput"></textarea>
        </div>
        {/* lines */}
        <div>
          <div>
            <Animate 
              keyArr={ doc.keyArr }
            />
            <Cursor style={ style }/>
            { //lines
              doc.tokens.map((lineTokens, index) => 
                <Line 
                  lineStyle={ lineStyle }
                  lineTokens={ lineTokens }
                  key={ index }
                />)
            }
          </div>
        </div>
      </div>
    );
  }
}
