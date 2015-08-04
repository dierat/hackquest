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
      var gameId = findGame()._id;
      // figure out damage done
      var code = Math.floor(Math.random() * 10) + 2;
      Games.update({_id: gameId}, {$set: {
        messages: [ findGame().activeEntity.name + " wrote " + code + " lines of code!" ]
      }});

      // find out new monster stam and if it's still alive
      var monsterStam = findGame().monster.stam - code;
      var newMonster = {};
      // if the monster is still alive
      if (monsterStam > 0){
        // reconstruct monster object
        newMonster = {
          _id: findGame().monster._id,
          name: findGame().monster.name,
          stam: monsterStam,
          icon: findGame().monster.icon
        };
        // update monster with new object
        Games.update({_id: gameId},{$set: {monster: newMonster}});
        console.log(findGame().monster.name + " now has " + monsterStam + "stamina!");
      } else {
        console.log("monster has been killed!");
        // find next monster, if there is one
        var currentLevel = findGame().level;
        console.log("currentLevel = ", currentLevel);
        var nextMonster = Monsters.findOne({level: currentLevel + 1});
        console.log("nextMonster = ", nextMonster);
        if (nextMonster){
          var newMonster = {
            name: nextMonster.name,
            stam: nextMonster.stam,
            icon: nextMonster.icon
          };
          console.log("nextMonster = ", newMonster);
          Games.update({_id: gameId}, {$set: {
            monster: newMonster,
            level: currentLevel + 1
          }});
        } else {
          Games.update({_id: gameId}, {$set: {
            messages: ["You won! Please hit the 'New Game' button to play again!"],
            playerTurn: false
          }});          
        }
      }
    },
    'click .google': function(){
      var hit = Math.random() > 0.35;
      var gameId = findGame()._id;
      if (hit){
        console.log("it's a hit!");
        var code = Math.floor(Math.random() * 15) + 15;
        console.log("You wrote " + code + " lines of code!");
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
      } else {
        console.log("No useful results!");
        Games.update(
          {_id: gameId},
          {$set: 
            // update messages with last activity
            {messages: [ "No useful results!" ]}
          }
        );
      }
    },
    'click .giphy': function(){
      Games.update(
        {_id: findGame()._id},
        {$set: 
          // update messages with last activity
          {messages: [ "giphy fail! Everyone laughed at " + findGame().activeEntity.name + "!" ]}
        }
      );
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
