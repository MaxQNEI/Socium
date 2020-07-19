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

  async LogRequest(req, ...addout) {
    // https://en.wikipedia.org/wiki/ANSI_escape_code
    const time = `[\x1b[1;90m${new Date().toLocaleString()}\x1b[0m] `;
    const user = `<\x1b[1m${req.ip.replace(/[^\d\.]+/g, '')}\x1b[0m> `;

    const sess = ((req.sessionID && `[\x1b[1m${req.sessionID}\x1b[0m] `) || '');
    const method = `\x1b[1;90m${req.method.padStart(4, ' ')}\x1b[0m `;
    const url = `\x1b[4;94m${(req.protocol + '://' + req.hostname + req.originalUrl)}\x1b[0m `;
    console.log.apply(null, [`${time}${user}${sess}${method}${url}`, ...addout]);
  }
}

module.exports = CoreController;
