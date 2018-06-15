import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import * as REGL from 'regl';

const style = require('./index.less');

@CSSModules(style, { allowMultiple: true })
export class Player extends React.Component<any, any> {
  private canvas;
  private regl:REGL.Regl = REGL();
  constructor(props:any, context:any) {
    super(props, context);
  }

  draw_rectangle() {
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

        void main() {
          gl_Position = vec4(a_position, 0, 1);
        }
      `,
      attributes: {
        a_position: [
          [0.5, 0.0],
          [0.0, 0.5],
          [0.0, -0.5],
          [-0.5, 0.0],
          [0.0, 0.5],
          [0.0, -0.5],
        ],
      },
      uniforms: {
        u_color: [0, 1, 0, 1],
      },
      count: 6,
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

  componentDidMount() {
    // this.draw_rectangle();
    this.regl.frame(() => {
      this.regl.clear({
        color: [0, 0, 0, 1],
      });

      // This tells regl to execute the command once for each object
      this.draw_batch([
        { offset: [-0.5, -0.5] },
        { offset: [-0.5, 0] },
        { offset: [-0.5, 0.5] },
        { offset: [0, -0.5] },
        { offset: [0, 0] },
        { offset: [0, 0.5] },
        { offset: [0.5, -0.5] },
        { offset: [0.5, 0] },
        { offset: [0.5, 0.5] },
      ]);
    });
  }
  render() {
    return (
      <div styleName="player" onClick={(ev) => { this.click_canvas(ev); }}>
      </div>
    );
  }
}