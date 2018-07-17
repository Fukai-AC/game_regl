import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import { mat4, mat3 } from 'gl-matrix';

import { stage } from 'src/gl/regl';

const style = require('./index.less');

@CSSModules(style, { allowMultiple: true })
export default class Transition extends React.Component<any, any> {
  private regl = stage.regl;
  constructor(props:any, context:any) {
    super(props, context);
    this.state = {
      translate_x: 0,
      translate_y: 0,
      radian: 0,
    };
  }

  draw_rectangle() {
    let { translate_x, translate_y, radian } = this.state;
    const uniform_mat = mat4.create();
    mat4.translate(uniform_mat, uniform_mat, [translate_x, translate_y, 0]);
    mat4.rotateZ(uniform_mat, uniform_mat, radian);

    // const translate_mat = mat4.fromValues(
    //   1, 0, 0, 0,
    //   0, 1, 0, 0,
    //   0, 0, 1, 0,
    //   translate_x, translate_y, 0, 1,
    // );
    // const roate_mat = mat4.fromValues(
    //   Math.cos(radian), Math.sin(radian), 0, 0,
    //   -Math.sin(radian), Math.cos(radian), 0, 0,
    //   0, 0, 1, 0,
    //   0, 0, 0, 1,
    // );
    // mat4.multiply(uniform_mat, translate_mat, roate_mat);
    this.regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    });
    this.regl({
      frag: require('src/gl/glsl/base_color.glsl'),
      vert: require('src/gl/glsl/transition.glsl'),
      attributes: {
        a_position: [
          [200, 200],
          [0, 200],
          [0, 150],
          [200, 200],
          [0, 150],
          [200, 150],
          [0, 150],
          [0, 0],
          [50, 150],
          [0, 0],
          [50, 0],
          [50, 150],
        ],
      },
      uniforms: {
        u_color: [0, 1, 0, 1],
        u_transform: uniform_mat,
        u_resolution: (context) => [context.viewportWidth, context.viewportHeight],
      },
      count: 12,
    })();
  }
  click_canvas(ev) {
    const x = ev.clientX;
    const y = ev.clientY;

  }
  change_x(ev) {
    console.log(ev.target.value);
    this.setState({translate_x: (ev.target.value - 50) / 100});
  }
  change_y(ev) {
    console.log(ev.target.value);
    this.setState({translate_y: (ev.target.value - 50) / 100});
  }
  change_angle(ev) {
    console.log(ev.target.value);
    let radian = -Math.PI * ev.target.value / 180;
    this.setState({radian: radian});
  }

  componentDidMount() {
    this.draw_rectangle();
  }
  componentWillUpdate() {
    this.draw_rectangle();
  }
  render() {
    return (
      <div styleName="player" onClick={(ev) => { this.click_canvas(ev); }}>
        <div styleName="control_panel">
          <p>
            <span>x:</span>
            <input type="range" onChange={(ev) => { this.change_x(ev); }} />
          </p>
          <p>
            <span>y:</span>
            <input type="range" onChange={(ev) => { this.change_y(ev); }} />
          </p>
          <p>
            <span>angle:</span>
            <input type="range" onChange={(ev) => { this.change_angle(ev); }} defaultValue="0" min="0" max="360" />
          </p>
        </div>
      </div>
    );
  }
}