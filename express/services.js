const { tooMuchInstances } = require('./error');
var { Manage } = require('./model');


create = function (req, res) {
    let pseudo = req.body.pseudo;
    let game = Manage.addGame(pseudo);
    game.message ='You have create the game '+game.code+'.';
    if(game) {
        res.status(200);
        res.json(game);
    }
    else{
        tooMuchInstances(res);
    }
};

join = function (req, res) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;
    Manage.getGame(code).addPlayer(pseudo);
    res.status(200);
    res.json({ message: 'You have join the game '+code+'.', code: code });
};

leave = function (req,res) {
    let pseudo = req.body.pseudo;
    let code = req.body.code;
    let expulsion = req.body.expulsion;
    let game = Manage.getGame(code);
    
    game.delPlayer(pseudo);

    res.status(200);
    if(pseudo === game.creator.pseudo) {
        Manage.delGame(code);
        res.json({message:"You have delete the game "+code+"."});
    }
    else{
        res.json({
            message: expulsion ? 
                        "You have exclude "+pseudo+" from the game "+code+"." : 
                        "You have leave the game "+code+"."
        });
    }
};

sentence = function(req, res) {
    let code = req.body.code;
    let sentence = req.body.sentence;
    let game = Manage.getGame(code);
    game.setSentence(sentence);

    res.status(200);
    res.json({ message: "The sentence hase been changed.", game: game });
};

getgame = function(req, res) {
    let code = req.body.code;
    let game = Manage.getGame(code);

    res.status(200);
    res.json(game);
};

getgames = function(req, res) {
    res.status(200);
    res.json(Manage.getGames());
};


ready = function(req, res) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;

    let game = Manage.getGame(code);
    let player = game.getPlayer(pseudo);

    player.ready = !player.ready;
    res.status(200);
    res.json({ message: player.ready ? "You are ready." : "You are not ready." });
};

ingame = function(req, res) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;

    let game = Manage.getGame(code);
    let player = game.getPlayer(pseudo);

    player.ingame = true;
    res.status(200);
    res.json({ message: "You are in the game." });
};

record = function(req, res) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;
    let record = req.body.record;

    let game = Manage.getGame(code);
    let player = game.getPlayer(pseudo);

    player.record = record;
    res.status(200);
    res.json({message: "Your record is save."});
};

vote = function(req, res) {
    let code = req.body.code;
    let game = Manage.getGame(code);

    let pseudo = req.body.pseudo;
    let player = game.getPlayer(pseudo);
    player.haveVote = true;

    let vote = req.body.vote;
    let playerVote = game.getPlayer(vote);
    playerVote.addVote(pseudo);

    game.defineWinner();
    res.status(200);
    res.json({message: "You have vote for "+vote+"."});
};

reinit = function(req, res){
    let code = req.body.code;
    let pseudo = req.body.pseudo;

    let game = Manage.getGame(code);
    let player = game.getPlayer(pseudo);

    player.ingame = false;
    player.ready = false;
    player.haveVote = false;
    player.record = null;
    player.vote = [];

    if(game.players.filter((player) => player.record).length === 0) {
        game.winners = [];
        game.sentence = Manage.generateSentence();
    }

    res.status(200);
    res.json({message: "You are ready to play again."});
};

module.exports = {
    create,
    join,
    leave,
    sentence,
    getgame,
    getgames,
    ready,
    ingame,
    record,
    vote,
    reinit
};