Characters = new Mongo.Collection('characters');
Monsters = new Mongo.Collection('monsters');
Games = new Mongo.Collection('games');


var findGame = function(){
  // returns the player's game document from the Games collection
  if (Games){
    return Games.findOne({ userId: Meteor.userId() });
  }
};


if (Meteor.isClient) {
  // Login requires username instead of e-mail address for easier testing.
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
  // Renders the login panel as uncollapsed on login_page template.
  Template.loginScreen.rendered = function() {
    Accounts._loginButtonsSession.set('dropdownVisible', true);
  };

  var play = function(){
    console.log("play calling!");
    var gameId = findGame()._id;
    var activeEntity = findGame().activeEntity;
    if (findGame().playerTurn){
      Games.update({_id: gameId}, {$set: 
        {
          messages: [
            'It is now ' + activeEntity.name + "' turn!"
          ]
        }
      });
    }
  };

  Template.main.events({
    'click .newGame': function(){
      // grab id's from the characters and monsters documents
      var team = Characters.find().map(function(c){
        return {
          id: c._id,
          name: c.name,
          icon: c.icon,
          stam: c.stam,
        };
      });
      var monsters = Monsters.find().map(function(m){
        return {
          id: m._id,
          name: m.name,
          icon: m.icon,
          stam: m.stam,
        };
      });
      // find and delete user's existing game if one exists
      var currenGame = findGame();
      if (currenGame){
        var gameId = currenGame._id;
        Games.remove({_id: gameId});
      }
      // create a new game save for the new user
      Games.insert({
        userId: Meteor.userId(),
        level: 0,
        characters: team.slice(0,4),
        monster: monsters[0],
        activeEntity: team[0],
        playerTurn: true,
        messages: [
          "You've created a new game!",
          "Are you ready to battle the evil forces of web development?!!"
        ]
      });
      setTimeout(function(){
        play();
      }, 1000);
    }
  });

  Template.gameScreen.helpers({
    messages: function(){
      return findGame().messages;
    },
    monster: function(){
      return findGame().monster;
    },
    characters: function(){
      return findGame().characters;
    },
    playerTurn: function(){
      return findGame().playerTurn;
    }
  });

  Template.gameScreen.events({
    'click .code': function(){
      var code = Math.floor(Math.random() * 10) + 2;
      console.log("You wrote " + code + " lines of code!");
      // reduce stam of first monster in game array
      var gameId = findGame()._id;
      // find out new monster stam and if it's still alive
      var monsterStam = findGame().monster.stam - code;
      var newMonster = {};
      if (monsterStam > 0){
        // reconstruct monster object
        newMonster = {
          _id: findGame().monster._id,
          name: findGame().monster.name,
          stam: monsterStam,
          icon: findGame().monster.icon
        };
        Games.update(
          {_id: gameId},
          {$set: 
            // update monster with new object
            {monster: newMonster, 
            // update messages with last activity
            messages: [ findGame().activeEntity.name + " wrote " + code + " lines of code!" ]}
          }
        );
        console.log(findGame().monster.name + " now has " + monsterStam + "stamina!");
      }

    },
    'click .google': function(){
      // generate random # between 0 and 1
      // if that number is greater than .25, it's a hit
      var hit = Math.random() > 0.45;
      if (hit){
        console.log("it's a hit!");
        var code = Math.floor(Math.random() * 15) + 15;
        console.log("You wrote " + code + " lines of code!");
      } else {
        console.log("No useful results!");
      }
      // reduce stam of first monster in game array
    },
    'click .giphy': function(){
      // generate random # between 0 and 1
      // if that number is greater than .25, it's a hit
      var hit = Math.random() > 0.85;
      if (hit){
        console.log("it's a hit!");
        var buff = Math.floor(Math.random() * 7) + 15;
        console.log("You increase your teammates stamina by " + buff + "!");
      } else {
        console.log("That didn't even make sense!");
      }
      // reduce stam of first monster in game array
    },
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Characters.find().count() === 0){
      var names = ["Alex", "Andrey", "Charles", "Chris", "Cliff", "David", "Diedra", "Derek", "Eric", "Greg", "Hailey", "Jonathan", "Kamerynn", "Kevin", "Ken", "Logan", "Luke", "Marq", "Nate", "Nick", "Owen", "Peter", "Wesley", "Zach", "Syed"];
      names.forEach(function(name){
        Characters.insert({
          name: name,
          icon: name.charAt(0).toLowerCase() + name.slice(1) + '.jpeg',
          stam: 100
        });
      });
    }

    if (Monsters.find().count() === 0){
      var techs = [
        ['javascript', 100],
        ['grunt', 200],
        ['node', 400],
        ['mongodb', 500],
        ['angular', 700],
        ['coffeescript', 900],
        ['backbone', 1000],
      ];
      var count = 0;
      techs.forEach(function(tech){
        Monsters.insert({
          name: tech[0],
          icon: tech[0] + '.png',
          stam: tech[1],
          level: count
        });
        count++;
      });
    }
  });
}
