# Socium
## Online multiplayer game
### Develops onto Facebook (for experience)



# Step-By-Step
* `npm i webpack@latest webpack-cli@latest --save-dev`
* `npm i three@latest --save-dev`
* `npm i express@latest --save`
* `npm i socket.io@latest --save`


## Create socket js files assets as symbolic link
```
/public
  /assets
    /js
      /socket.io.js
      /socket.io.js.map
```
via command's
* `ln -s ../../../node_modules/socket.io-client/dist/socket.io.js`
* `ln -s ../../../node_modules/socket.io-client/dist/socket.io.js.map`


# Reference

# Server
Global "Variables" defines in:
```
/express
  /config.js
  /init.js
```

## Init.js defines «Core» controllers/modules/etc...
```
/core
  /...
```


## Common OWNER Config file is «/config.local.js»

Need to use */config.local.example.js*! Read it!
