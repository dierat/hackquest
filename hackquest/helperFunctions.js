// these methods are globally defined so they can be used across files


findGame = function(){
  // returns the player's game document from the Games collection
  if (Games){
    return Games.findOne({ userId: Meteor.userId() });
  }
};

play = function(){
  console.log("play calling!");
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