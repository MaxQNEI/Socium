import BaseController from './Base.js';

import {
  CubeCamera,
  OrthographicCamera,
  PerspectiveCamera,
  StereoCamera,
} from 'three';

export default class CameraController extends BaseController {
  AnimationList = [];

  constructor(type, parameters) {
    super();
  }


}
