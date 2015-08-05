// these methods are globally defined so they can be used across files

// index is the index of this audio file as listed in hackquest.html
playSound = function(index, playFromBeginning){
  var audioElem = document.getElementsByTagName("audio")[index];
  if (playFromBeginning){
    audioElem.currentTime = 0;
  }
  audioElem.play();
  setTimeout(function(){
    audioElem.pause();
  }, 1500);
};

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
