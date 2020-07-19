class IndexController extends CoreController {
  actionIndex(id) {
    return 'Hello World!';
  }

  actionRegistration(id) {
    return 'It\'s registration!';
  }
}

module.exports = IndexController;
