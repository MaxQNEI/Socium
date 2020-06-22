const FS = require('fs');
const Path = require('path');

class RouteController extends CoreController {
  Server = null;
  Controllers = {};

  constructor(Server) {
    super();

    this
      .Use(Server)
      .ApplyControllers()
    ;
  }

  Use(Server) {
    this.Server = Server;

    this.Server.get('*', this.Handle.bind(this));
    this.Server.post('*', this.Handle.bind(this));

    return this;
  }

  ApplyControllers() {
    const Place = __dirname;
    const Ignore = [__filename];
    const Controllers = FS
      .readdirSync(Place)
      .filter((filename) => {
        const isIgnored = Ignore.includes(`${Place}/${filename}`);
        const isHiddened = !!filename.match(/^\./);
        const isJSFile = !!filename.match(/\.js$/);

        return !(isIgnored || isHiddened || !isJSFile);
      })
      .map((filename) => {
        return {
          route: filename
            .replace(/Controller\.js$/, '')
            .replace(/\./g, '-')
            .toLowerCase(),
          controller: require(`./${filename}`),
        };
      })
      .some(({route, controller}) => {
        this.Controllers[route] = controller;
      })
    ;

    return this;
  }

  Handle(req, res, next) {
    const parsedUrl = req.originalUrl.replace(/(^\/+|\/+$)/g, '').toLowerCase().split('/');

    const controller = (parsedUrl[0] || 'index');
    const action = 'action'+ this.MtdName(parsedUrl[1] || 'index');
    const params = (parsedUrl.slice(2) || []);

    if(this.Controllers[controller] === undefined) {
      console.warn(`Controller «${controller}» is ${this.Controllers[controller]}!`);
      res.status(404);
      return res.send(this.Error());
    }

    const Controller = new this.Controllers[controller];

    if(!(action in Controller)) {
      console.warn(`Actions «${controller}.${action}» is ${Controllers[action]}!`);
      res.status(404);
      return res.send(this.Error());
    }

    new Promise((send, err) => {
      Controller.Set(req, res, next, req.method);
      const ActionResult = Controller[action].apply(Controller, params);

      if(ActionResult instanceof Promise) {
        return ActionResult
          .then((data) => {
            send(data);
          })
          .catch((err) => {
            err(err);
          })
        ;
      }

      if(ActionResult) {
        send(ActionResult);
      }

      send(ActionResult);
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      // res.send((err.message ? err.message : err) || 'Server error! Sorry. ):');
      res.status(500);
      return res.send(this.Error());
    });
  }


  MtdName(string) {
    string = string.split(/[^A-Za-z0-9]+/i);
    string.map(function(v,i) {
      string[i] = `${v.substr(0, 1).toUpperCase()}${v.substr(1).toLowerCase()}`;
    });
    return string.join('');
  }
}

module.exports = (Server) => {
  new RouteController(Server);
};
