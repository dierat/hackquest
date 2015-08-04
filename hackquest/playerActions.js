if (Meteor.isClient){  
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
