class Team{
    constructor(name, question){
      this.name = name;
      this.resolve = [];
      this.actual = question;
    }
};

class Question{
  constructor(label, type, suggestions, response){
    this.label = label;
    this.type = type;
    this.suggestions = suggestions;
    this.response = response;
  }
}
  
class Game{
    constructor(code, questions){
      this.code = code;
      this.questions = questions;
      this.teams = [];

      this.wait = true;
      this.defineTimeout();
    };

    // Check if the game is using

    defineTimeout = function() {
      if(this.wait) {
        this.wait = false;
        let self = this;
        setTimeout(function() {
          self.defineTimeout();
        }, 10000);
      }
      else {
        console.log("autodestruction")
        Manage.delGame(this.code);
      }
    };

    // Return essential data of a game

    getData = function() {
      return {
        teams : this.teams,
        code : this.code,
        questions : questions
      }
    };

    // Manage Player of a game

    getTeam = function(label) {
      return this.teams.find((team) => { return team.label == label});
    };

    addTeam = function(label) {
      if(!this.getTeam(label)) {
        let team = new Player(label);
        this.teams.push(team);
        return team;
      }
      return false;
    };

    delTeam = function(label) {
      this.teams = this.teams.filter((team) => {
        return team.label !== label
      });
    };
};



const Manage = {
  games: [],

  getGame: function(code) {
    let game = this.games.find((game) => { return game.code === code});
    if(game) {
      game.wait = true;
      return game.getData();
    }
    return false;
  },

  getGames: function() {
    return this.games.map((game) => {
      return game.getData();
    });
  },
  
  addGame: function() {
    let code = this.generateID(this.games);
    let game = new Game(code);
    this.games.push(game);
    return game.getData();
  },

  delGame: function(code) {
    this.games = this.games.filter((game) => {
      return game.code !== code;
    });
  },

  generateID: function(array) {
    let test = true;
    let result = ""; 
    let resultLength = 4;
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
    let length = alphabet.length; 
  
    if(array.length === Math.pow(length, resultLength)) {
      return null;
    }
  
    while(test){
      result = "";
  
      while (result.length < resultLength){ 
       result += alphabet[Math.floor(Math.random() * length)];
      }
  
      test = array.find((el) => {
        return el.code === result;
      });
    }
    return result;
  }
};


module.exports = {
    Player,
    Game,
    Manage
};