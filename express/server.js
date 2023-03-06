'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const expressSwagger = require('express-swagger-generator')(app);
const service = require('./services');
const check = require('./middleware');
const {options} = require("./swagger");
expressSwagger(options);

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  app.options('*', (req, res) => {
      res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
      res.send();
  });
});

// app.use((req, res, next) => {
//   if(req.headers.origin !== 'https://voicer-front.netlify.app') {
//     res.status(403).end();
//   }
//   else{
//     next();
//   }
// })

const router = express.Router();

/**
 * get status Server
 * @route Get / 
 * @group Status
 * @returns {object} 200 - return html page
 */
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Server on</h1>');
  res.end();
});

/**
 * create a new instance of game
 * @route POST /create 
 * @group Member of a game
 * @param {string} pseudo - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  424 - too much instances of games
 */
router.post('/create', 
service.create);


/**
 * join an instance of game
 * @route POST /join 
 * @group Member of a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  409 - pseudo already use in the game
 */
router.post('/join',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.usePlayer,
service.join);


/**
 * leave an instance of game
 * @route POST /leave 
 * @group Member of a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - code game.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 */
router.post('/leave',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
service.leave);


/**
 * get an instance of game
 * @route POST /getgame 
 * @group Essential function of a game
 * @param {string} code - code game.
 * @returns {object} 200 - return game object
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 */
router.post('/getgame',
check.emptyCode,
check.noGame,
service.getgame);

/**
 * get all games
 * @route GET /getgames 
 * @group Administration
 * @returns {object} 200 - return game object
 */
router.get('/getgames',
service.getgames);


app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
