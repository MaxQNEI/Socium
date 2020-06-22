const Config = require('../config');
const Crypto = require('crypto');

class FacebookController extends CoreController {
  actionIndex(id) {
    // console.debug(this.req);
    return this.Index();
  }

  Check(onGuest, onUser, onUnknown)  {
    var { signed_request, fb_locale } = req.body;

    if(!signed_request || !fb_locale) {
      this.send({error: `What is that? O_o`});
      return null;
    }

    signed_request = signed_request.split('.');

    const encodedSig = signed_request[0];
    const payload = signed_request.slice(1).join('.');

    const sig = decode(encodedSig);
    const data = JSON.parse(decode(payload));

    const expectedSig = Crypto
      .createHmac('sha256', Config.Facebook.AppSecret)
      .update(payload, 'utf8')
      .digest('utf8');
    ;

    if(sig !== expectedSig) {
      console.debug('Bad Signed JSON signature!');
      this.send({error: `What is that? O_o`});
      return false;
    }

    return true;
  }

  Send() {
    return this.sendFile('index.html', { root: Config.Root });
  }

  // return this.send(data);

  decode(str) {
    str = str
      .replace(/\-/g, '+')
      .replace(/\_/g, '/')
    ;

    return Buffer.from(str, 'base64').toString();
  }
}

module.exports = FacebookController;
