const LocalConfig = require('./config.local.js');

global.Config = module.exports = {
  WebPort: 80,
  Root: `${__dirname}`,
  Core: `${__dirname}/core`,
  Public: `${__dirname}/public`,
    PublicIndex: `${__dirname}/public/index.html`,
    PublicError: `${__dirname}/public/error.html`,
  Express: `${__dirname}/express`,
  Src: `${__dirname}/src`,

  ...LocalConfig,

  // WebPort: (LocalConfig.WebPort || 80),
};
