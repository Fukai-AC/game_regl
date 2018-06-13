import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import * as REGL from 'regl';

const style = require('./index.less');

@CSSModules(style, { allowMultiple: true })
export class Player extends React.Component<any, any> {
  private canvas;
  private regl;
  constructor(props:any, context:any) {
    super(props, context);
  }
  componentDidMount() {
    this.regl = REGL({
      canvas: this.canvas,
    });
  }
  render() {
    return (
      <div styleName="player">
        <canvas id="regl_canvas" ref={(el) => this.canvas = el}></canvas>
      </div>
    );
  }
}