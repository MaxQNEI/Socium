import '../css/index.css';
import '../lib/HTMLElement.addClass.js';
import '../lib/HTMLElement.append.js';
import '../lib/HTMLElement.remClass.js';
import '../lib/HTMLElement.setClass.js';

import { WebGLRenderer } from 'three';

export default class Core {
  OnDOMReady(listener) {
    window.addEventListener('DOMContentLoaded', listener.bind(this));
  }

  InitRootCanvas(parameters = {}) {
    const Renderer = new WebGLRenderer(parameters);
    const Canvas = Renderer.domElement;

    Renderer.setSize(this.Width(), this.Height());

    document.body
      .setClass('root-wrap')
      .append(
        Canvas.setClass('root-canvas')
      )
    ;

    setTimeout(() => {
      document.body.addClass('show-canvas');
    }, 1000);

    return this;
  }

  Aspect() {
    return this.Width() / this.Height();
  }

  Width() {
    return window.innerWidth;
  }

  Height() {
    return window.innerHeight;
  }
}
