require('./init.js');

const Route = require('./controllers/RouteController.js');

const Express = require('express');
const BodyParser = require('body-parser');
const Server = Express();

Server.use(Express.static(Config.Public));
Server.use(BodyParser.json({ strict: false }));
Server.use(BodyParser.urlencoded({ extended: true }));

Server.listen(Config.WebPort, () => {
  console.debug(`Express start at port: ${Config.WebPort}.`);
});

Route(Server);

// Server.get('/fb*', (req, res, next) => {
//   console.debug(`Server.post('*')`, req.headers.origin);

//   return Handlers.Facebook.apply(res, [req, next]);
// });

// Server.get('*', (req, res, next) => {
//   console.debug(`Server.get('*')`);
//   res.send(null);
// });
