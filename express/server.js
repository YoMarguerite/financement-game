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
  // res.header('Access-Control-Allow-Origin', 'https://voicer-front.netlify.app');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  app.options('*', (req, res) => {
      res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
      res.send();
  });
});

app.use((req, res, next) => {
  if(req.headers.origin !== 'https://voicer-front.netlify.app') {
    res.status(403).end();
  }
  else{
    next();
  }
})

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
check.emptyPseudo,
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
 * @param {string} code - user pseudo.
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
 * Change the sentence of a game
 * @route POST /sentence 
 * @group Member of a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @param {string} sentence - user pseudo
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 */
router.post('/sentence',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
service.sentence);


/**
 * get an instance of game
 * @route POST /getgame 
 * @group Essential function of a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 */
router.post('/getgame',
check.emptyCode,
check.noGame,
check.noPlayer,
service.getgame);

/**
 * get all games
 * @route GET /getgames 
 * @group Administration
 * @returns {object} 200 - return game object
 */
router.get('/getgames',
service.getgames);


/**
 * player is ready
 * @route POST /ready 
 * @group Play in a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 */
router.post('/ready',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
service.ready);


/**
 * player is in the game
 * @route POST /ingame 
 * @group Play in a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 */
router.post('/ingame',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
service.ingame);


/**
 * receive the record of one player
 * @route POST /leave 
 * @group Play in a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 */
router.post('/record',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
service.record);


/**
 * vote for a player of a game
 * @route POST /vote 
 * @group Play in a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 * @returns {Error}  500 - vote for yourself is forbidden
 */
router.post('/vote',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
check.noVote,
service.vote);


/**
 * reinit a player in a game
 * @route POST /reinit 
 * @group Essential function of a game
 * @param {string} pseudo - user pseudo.
 * @param {string} code - user pseudo.
 * @returns {object} 200 - return game object
 * @returns {Error}  401 - pseudo is empty
 * @returns {Error}  403 - code is empty
 * @returns {Error}  410 - game with this code doesn't exist
 * @returns {Error}  412 - no player with this pseudo in the game
 */
router.post('/reinit',
check.emptyPseudo,
check.emptyCode,
check.noGame,
check.noPlayer,
service.reinit);

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
