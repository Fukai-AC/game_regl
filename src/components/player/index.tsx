import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import * as REGL from 'regl';
import { mat4, mat3 } from 'gl-matrix';

const style = require('./index.less');

@CSSModules(style, { allowMultiple: true })
export class Player extends React.Component<any, any> {
  private regl:REGL.Regl = REGL();
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
      frag: `
        precision mediump float;
        uniform vec4 u_color;

        void main() {
          gl_FragColor = u_color;
        }
      `,
      vert: `
        precision mediump float;
        attribute vec2 a_position;
        uniform mat4 u_transform;

        void main() {
          gl_Position = u_transform * vec4(a_position, 0, 1);
        }
      `,
      attributes: {
        a_position: [
          [0.2, 0.2],
          [0, 0.2],
          [0, 0.15],
          [0.2, 0.2],
          [0, 0.15],
          [0.2, 0.15],
          [0, 0.15],
          [0, 0],
          [0.05, 0.15],
          [0, 0],
          [0.05, 0],
          [0.05, 0.15],
        ],
      },
      uniforms: {
        u_color: [0, 1, 0, 1],
        u_transform: uniform_mat,
      },
      count: 12,
    })();
  }

  draw_batch(offset) {
    this.regl({
      frag: require('src/gl/glsl/base_color.glsl'),
      vert: require('src/gl/glsl/batch.glsl'),

      attributes: {
        position: [
          0.2, 0,
          0, 0.2,
          0.2, 0.2],
      },

      uniforms: {
        // the batchId parameter gives the index of the command
        color: ({tick}, props, batchId) => {
          return [
            Math.sin(0.02 * ((0.1 + Math.sin(batchId)) * tick + 3.0 * batchId)),
            Math.cos(0.02 * (0.02 * tick + 0.1 * batchId)),
            Math.sin(0.02 * ((0.3 + Math.cos(2.0 * batchId)) * tick + 0.8 * batchId)),
            1,
          ];
        },
        angle: ({tick}) => 0.01 * tick,
        offset: this.regl.prop('offset' as never),
      },

      depth: {
        enable: false,
      },

      count: 3,
    })(offset);
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
    // this.regl.frame(() => {
    //   this.regl.clear({
    //     color: [0, 0, 0, 1],
    //   });

    //   // This tells regl to execute the command once for each object
    //   this.draw_batch([
    //     { offset: [-0.5, -0.5] },
    //     { offset: [-0.5, 0] },
    //     { offset: [-0.5, 0.5] },
    //     { offset: [0, -0.5] },
    //     { offset: [0, 0] },
    //     { offset: [0, 0.5] },
    //     { offset: [0.5, -0.5] },
    //     { offset: [0.5, 0] },
    //     { offset: [0.5, 0.5] },
    //   ]);
    // });
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