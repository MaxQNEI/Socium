const FS = require('fs');

class CoreController {
  req;
  res;
  next;
  method;

  actionIndex(id) {
    console.warn('CoreController.actionIndex always exists!');
    return this.Index();
  }

  Set(req, res, next, method) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.method = method.toLowerCase();
  }

  Index() {
    return FS.readFileSync(Config.PublicIndex, { encoding: 'utf8' });
  }

  Error() {
    return FS.readFileSync(Config.PublicError, { encoding: 'utf8' });
  }
}

module.exports = CoreController;
