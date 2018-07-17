import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import { mat4, mat3 } from 'gl-matrix';
import { stage } from 'src/gl/regl';

let style = require('./index.less');

@CSSModules(style, { allowMultiple: true })
export default class GlStage extends React.Component<any, any> {
  constructor(props:any, context:any) {
    super(props, context);
  }
  render() {
    return (
      <div>
        hhhhh
      </div>
    );
  }
}