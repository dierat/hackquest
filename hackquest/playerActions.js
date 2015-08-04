


if (Meteor.isClient){  
  Template.gameScreen.events({

    'click .code': function(){
      var gameId = findGame()._id;
      var hit = Math.random() > 0.15;

      // if the action was successful
      if (hit){
        // figure out how much code was written and what the monster has left
        var code = Math.floor(Math.random() * 15) + 5;
        var monsterStam = findGame().monster.stam - code;

        // if the monster is still alive
        if (monsterStam > 0){
          // update monster with new health
          var newMonster = {
            _id: findGame().monster._id,
            name: findGame().monster.name,
            stam: monsterStam,
            icon: findGame().monster.icon
          };
          Games.update(
            {_id: gameId},
            {$set: 
              {monster: newMonster, 
              messages: [ findGame().activeEntity.name + " wrote " + code + " lines of code!" ]}
            }
          );
          console.log(findGame().monster.name + " now has " + monsterStam + "stamina!");

        // if the monster is dead
        } else {
          // look for next monster
          var currentLevel = findGame().level;
          var nextMonster = Monsters.findOne({level: currentLevel + 1});

          // if there is a next monster
          if (nextMonster){
            // update monster to be next monster
            var newMonster = {
              name: nextMonster.name,
              stam: nextMonster.stam,
              icon: nextMonster.icon
            };
            Games.update({_id: gameId}, {$set: {
              monster: newMonster,
              level: currentLevel + 1
            }});

          // if that was the last monster
          } else {
            // update game with win message
            Games.update({_id: gameId}, {$set: {
              messages: ["You won! Please hit the 'New Game' button to play again!"],
              playerTurn: false
            }});          
          }
        }


      // if the action was not successful
      } else {
        Games.update(
          {_id: gameId},
          {$set: 
            {messages: [ "You didn't write a single line!" ]}
          }
        );
      }
      // figure out if that was the last character in the team
      // if not
        // update active entity to be next character
      // else
        // activate monsters' turn
    },

    'click .giphy': function(){
      Games.update(
        {_id: findGame()._id},
        {$set: 
          // update messages with last activity
          {messages: [ "giphy fail! Everyone laughed at " + findGame().activeEntity.name + "!" ]}
        }
      );
    }

  });
}
