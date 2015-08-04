
monsterTurn = function(){
  console.log("inside monsterTurn");
  var gameId = findGame()._id;
  var monster = findGame().monster;
  var team = findGame().characters;
  Games.update({_id: gameId}, {$set: {playerTurn: false}});
  // figure out if it's a hit
  var hit = Math.random() > 0.15;
  if (hit){
    console.log("it's a hit!");
    // pick a random character
    var ranIndex = Math.floor(Math.random() * 4);
    var target = team[ranIndex];
    // figure out how much damage it does
    var damage = Math.floor(Math.random() * 13);
    // update target's stam
    target.stam -= damage;
    team[ranIndex] = target;
    setTimeout(function(){
      Games.update({_id: gameId}, {$set: {
        characters: team,
        messages: [ monster.name + " did " + damage + " damage to " + target.name + "!" ]
      }});
    }, 1500);
  // if monster missed
  } else {
    setTimeout(function(){
      Games.update({_id: gameId},{$addToSet: {
        messages: monster.name + " is stunned by your awesomeness!"
      }});
    }, 1500);
  }
  setTimeout(function(){
    play();
  }, 1500);
};

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
          Games.update(
            {_id: gameId},
            {$addToSet: 
              {messages: findGame().monster.name + " has been defeated!"}
            }
          );
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
            setTimeout(function(){
              Games.update({_id: gameId}, {$set: {
                monster: newMonster,
                level: currentLevel + 1,
                messages: [newMonster.name + " has appeared!"]
              }});
            }, 1500);

          // if that was the last monster
          } else {
            // update game with win message
            setTimeout(function(){
              Games.update({_id: gameId}, {$set: {
                messages: ["You won! Please hit the 'New Game' button to play again!"],
                playerTurn: false
              }});
            }, 1500);    
          }
        }


      // if the action was not successful
      } else {
        Games.update(
          {_id: gameId},
          {$set: 
            {messages: [ findGame().activeEntity.name + " didn't write a single line!" ]}
          }
        );
      }
      // figure out if that was the last character in the team
      var team = findGame().characters;
      var teamIds = findGame().characters.map(function(c){return c.id});
      var activeIndex = teamIds.indexOf(findGame().activeEntity.id);
      // if not
      if ( activeIndex !== (team.length - 1) ){
        // update active entity to be next character
        var nextChar = team[activeIndex + 1];
        setTimeout(function(){
          Games.update({_id: gameId}, {$set: {
            activeEntity: nextChar,
            messages: ["It is now " + nextChar.name + "'s turn!"]
          }});
        }, 1500);
      // else
      } else {
        // activate monsters' turn
        monsterTurn();
      }
    },

    'click .giphy': function(){
      var gameId = findGame()._id;
      Games.update(
        {_id: findGame()._id},
        {$set: 
          // update messages with last activity
          {messages: [ "giphy fail! Everyone laughed at " + findGame().activeEntity.name + "!" ]}
        }
      );
      // figure out if that was the last character in the team
      var team = findGame().characters;
      var teamIds = findGame().characters.map(function(c){return c.id});
      var activeIndex = teamIds.indexOf(findGame().activeEntity.id);
      // if not
      if ( activeIndex !== (team.length - 1) ){
        // update active entity to be next character
        var nextChar = team[activeIndex + 1];
        setTimeout(function(){
          Games.update({_id: gameId}, {$set: {
            activeEntity: nextChar,
            messages: ["It is now " + nextChar.name + "'s turn!"]
          }});
        }, 1500);
      // else
      } else {
        console.log("inside else statement");
        // activate monsters' turn
        monsterTurn();
      }
    }

  });
}
