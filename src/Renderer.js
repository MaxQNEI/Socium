import BaseController from './Base.js';

import { WebGLRenderer } from 'three';

export default class RendererController extends BaseController {
  SceneList = [];
  CameraList = [];

  constructor() {
    super();
  }


}
