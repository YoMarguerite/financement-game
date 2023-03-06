pseudoEmpty = function(res) {
    res.status(401);
    let message = "Action have failed because the pseudo is empty or null.";
    console.error(message);
    res.json({error: message});
};

pseudoAlreadyUse = function(res) {
    res.status(409);
    let message = "Action have failed because the pseudo is already use.";
    console.error(message);
    res.json({error: message});
};

codeEmpty = function(res) {
    res.status(403);
    let message = "Action have failed because the code is empty or null.";
    console.error(message)
    res.json({error: message});
};

gameNotExist = function(res) {
    res.status(410);
    let message = "The game you are searching doesn't exist.";
    console.error(message);
    res.json({error: message});
}

playerNotIn = function(res) {
    res.status(412);
    let message = "You are excluded from the game.";
    console.error(message);
    res.json({error: message});
}

tooMuchInstances = function(res) {
    res.status(424);
    let message = "Too much instances of games at the same time, sorry please try again later.";
    console.error(message)
    res.json({error: message});
}

voteForYou = function(res) {
    res.status(500);
    let message = "The player you are voting is you, it's forbidden.";
    console.error(message);
    res.json({error: message});
}



module.exports = {
    pseudoEmpty,
    pseudoAlreadyUse,
    codeEmpty,
    gameNotExist,
    tooMuchInstances,
    voteForYou
};