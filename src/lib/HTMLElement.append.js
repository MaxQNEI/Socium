'use strict';

(() => {
  Object.defineProperties(HTMLElement.prototype, {
    append: { enumerable: true, value: function append(...elements) {
      elements.some((element) => {
        this.appendChild(element);
      })

      return this;
    } },
  });
})();
