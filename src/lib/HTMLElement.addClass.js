'use strict';

(() => {
  Object.defineProperties(HTMLElement.prototype, {
    addClass: { enumerable: true, value: function addClass(className) {
      className.split(' ').some((className) => {
        className && this.classList.add(className);
      });

      return this;
    } },
  });
})();
