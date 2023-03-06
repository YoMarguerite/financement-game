const { tooMuchInstances } = require('./error');
var { Manage } = require('./model');


create = function (req, res) {
    let game = Manage.addGame();
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
    let label = req.body.label;
    Manage.getGame(code).addTeam(label);
    res.status(200);
    res.json({ message: 'You have join the game '+code+'.', code: code });
};

leave = function (req,res) {
    let label = req.body.label;
    let code = req.body.code;
    let expulsion = req.body.expulsion;
    let game = Manage.getGame(code);
    
    game.delTeam(label);

    res.status(200);

    res.json({
        message: expulsion ? 
                    "You have exclude "+label+" from the game "+code+"." : 
                    "You have leave the game "+code+"."
    });
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

module.exports = {
    create,
    join,
    leave,
    sentence,
    getgame,
    getgames
};