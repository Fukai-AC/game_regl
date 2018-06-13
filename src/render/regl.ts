import * as Regl from 'regl';

class RenderRegl {
  private regl;
  
  constructor(canvas:HTMLCanvasElement) {
    this.regl = Regl({
      canvas: canvas
    });
  }
}