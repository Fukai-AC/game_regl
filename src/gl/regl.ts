import * as REGL from 'regl';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export class Stage {
  private _regl = REGL();
  constructor() {
  }
  get regl() {
    return this._regl;
  }
}

export const stage = new Stage();