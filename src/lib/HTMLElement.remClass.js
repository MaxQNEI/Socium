'use strict';

(() => {
  Object.defineProperties(HTMLElement.prototype, {
    remClass: { enumerable: true, value: function remClass(className) {
      if(className === '*') {
        Object.values(document.body.classList).some((className) => {
          this.classList.remove(className);
        });

        return this;
      }

      className.split(' ').some((className) => {
        this.classList.remove(className);
      });

      return this;
    } },
  });
})();
