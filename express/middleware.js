const { pseudoEmpty, codeEmpty, gameNotExist, pseudoAlreadyUse, voteForYou } = require('./error');
const { Manage } = require('./model');


/** 
 * Middleware wich check
 * if pseudo is define and not empty
*/
 const emptyPseudo = function(req, res, next) {
    let pseudo = req.body.pseudo;
    if(pseudo) {
        next();
    }
    else{
        pseudoEmpty(res);
    }
}


/** 
 * Middleware wich check
 * if code is define and not empty
*/
const emptyCode = function(req, res, next) {
    let code = req.body.code;
    if(code) {
        next();
    }
    else{
        codeEmpty(res);
    }
}


/** 
 * Middleware wich check
 * if game is existing
*/
const noGame = function(req, res, next) {
    let code = req.body.code;
    let game = Manage.getGame(code);
    if(game) {
        next();
    }
    else{
        gameNotExist(res);
    }
}


/** 
 * Middleware wich check
 * if player with same pseudo
 * is already playing in this game
*/
const usePlayer = function(req, res, next) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;
    if(!Manage.getGame(code).getPlayer(pseudo)) {
        next();
    }
    else{
        pseudoAlreadyUse(res);
    }
}


/** 
 * Middleware wich check
 * if player is playing in this game
*/
const noPlayer = function(req, res, next) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;
    if(Manage.getGame(code).getPlayer(pseudo)) {
        next();
    }
    else{
        playerNotIn(res);
    }
}

/** 
 * Middleware wich check
 * if vote is valid
*/
const noVote = function(req, res, next) {
    let code = req.body.code;
    let pseudo = req.body.pseudo;
    let vote = req.body.vote;
    if(Manage.getGame(code).getPlayer(vote)) {
        if(vote !== pseudo) {
            next();
        }
        else{
            voteForYou(res);
        }        
    }
    else{
        playerNotIn(res);
    }
}



module.exports = {
    emptyPseudo,
    emptyCode,
    noGame,
    usePlayer,
    noPlayer,
    noVote
}