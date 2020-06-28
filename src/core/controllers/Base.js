export default class BaseController {
  Wrap;

  constructor(Wrap = window) {
    this.Wrap = Wrap;
  }

  Aspect() {
    return (this.Width() / this.Height());
  }

  Width() {
    return (this.innerWidth || this.offsetWidth);
  }

  Height() {
    return (this.innerHeight || this.ioffseteight);
  }

  OnResize(handle) {
    window.addEventListener('resize', () => {
      handle(evt);
    });
  }
}
