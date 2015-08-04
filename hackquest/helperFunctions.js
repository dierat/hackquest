// these methods are globally defined so they can be used across files


findGame = function(){
  // returns the player's game document from the Games collection
  if (Games){
    return Games.findOne({ userId: Meteor.userId() });
  }
};

play = function(){
  var gameId = findGame()._id;
  var activeEntity = findGame().characters[0];
  setTimeout(function(){
    Games.update({_id: gameId}, {$set: 
      {
        activeEntity: activeEntity,
        messages: ['It is now ' + activeEntity.name + "'s turn!"],
        playerTurn: true
      }
    });
  }, 1500);
};

monsterTurn = function(){
  var gameId = findGame()._id;
  var monster = findGame().monster;
  var team = findGame().characters;
  Games.update({_id: gameId}, {$set: {
    playerTurn: false,
    activeEntity: null
  }});
  // figure out if it's a hit
  var hit = Math.random() > 0.15;
  if (hit){
    // pick a random character
    var ranIndex = Math.floor(Math.random() * team.length);
    var target = team[ranIndex];
    // figure out how much damage it does
    var damage = Math.floor(Math.random() * 30);
    // update target's stam
    target.stam -= damage;
    setTimeout(function(){
      Games.update({_id: gameId}, {$set: {
        messages: [ monster.name + " did " + damage + " damage to " + target.name + "'s stamina!" ]
      }});
    }, 1500);

    // if target is still in the game
    if (target.stam > 0){
      team[ranIndex] = target;
      setTimeout(function(){
        Games.update({_id: gameId}, {$set: {
          characters: team
        }});
      }, 1500);
    // if the target has fallen
    } else {
      var fallen = target.name;
      team.splice(ranIndex, 1)
      setTimeout(function(){
        Games.update({_id: gameId}, {$set: {
          characters: team
        }});
        Games.update({_id: gameId}, {$addToSet: {
          messages: fallen + " has been overcome by exhaustion!"
        }});
        // if the team has been defeated
        if (!team.length){
          Games.update({_id: gameId}, {$addToSet: {
            messages: [
              ["Your team has fallen to the toils of web development!"],
              ["Hit 'New Game' to try again!"]
            ],
          }});
        }
      }, 1500);
    }
  // if monster missed
  } else {
    setTimeout(function(){
      Games.update({_id: gameId},{$addToSet: {
        messages: monster.name + " is stunned by your awesomeness!"
      }});
      play();
    }, 1500);
  }
  // pass execution back to player
  setTimeout(function(){
    play();
  }, 1500);
};