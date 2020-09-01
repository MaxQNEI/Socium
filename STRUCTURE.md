Terms:
Core = Framework - created by MaxQNEI
App - target application contains in src

```
/
  express/            - express-server Core engine
    controllers/      - controllers of routes -> actions of express
    core/             - Core scripts/... for express-server
  node_modules/       - NPM's
  public/             - bundle/assets/etc.
    assets/           - [n/d]
    css/              - basic-public css-styles
    facebook/         - facebook pages: tems of use, etc.
  socket/             - socket-server folder
    controllers/      - socket-server controllers
  src/                - sources of part of threejs
    app/              - App
      modules/        - (App/ThreeJS) modules
      scenarios/      - (App/ThreeJS) scenarios
      socket/         - (App) socket-client scripts
    core/             - Core
      controllers/    - [n/d]
      helpers/        - [n/d]
    css/              - [n/d]
    lib/              - js-library (non modules - as external library)
```
