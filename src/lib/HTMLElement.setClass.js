(() => {
  Object.defineProperties(HTMLElement.prototype, {
    setClass: { enumerable: true, value: function setClass(className) {
      Object.values(this.classList).some((className) => {
        this.classList.remove(className);
      });

      className.split(' ').some((className) => {
        className && this.classList.add(className);
      });

      return this;
    } },
  });
})();
