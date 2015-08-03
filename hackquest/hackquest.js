Characters = new Mongo.Collection('characters');
Monsters = new Mongo.Collection('monsters');
Games = new Mongo.Collection('games');


if (Meteor.isClient) {
  // Login requires username instead of e-mail address for easier testing.
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
  // Renders the login panel as uncollapsed on login_page template.
  Template.loginScreen.rendered = function() {
    Accounts._loginButtonsSession.set('dropdownVisible', true);
  };

  Template.main.events({
    'click .newGame': function(){
      // grab id's from the characters and monsters documents
      var team = Characters.find().map(function(c){
        return {
          id: c._id,
          name: c.name,
          icon: c.icon,
          stam: c.stam
        };
      });
      var monsters = Monsters.find().map(function(m){
        return {
          id: m._id,
          name: m.name,
          icon: m.icon,
          stam: m.stam,
          level: m.level
        };
      });
      // find and delete user's existing game if one exists
      var currenGame = Games.findOne({userId: Meteor.userId()});
      if (currenGame){
        var gameId = currenGame._id;
        Games.remove({_id: gameId});
      }
      // create a new game save for the new user
      Games.insert({
        userId: Meteor.userId(),
        level: 0,
        characters: team.slice(0,4),
        monsters: monsters,
        messages: [
          "You've created a new game!"
        ]
      });
    }
  });

  Template.gameScreen.helpers({
    messages: function(){
      return Games.findOne({userId: Meteor.userId()}).messages;
    },
    monsters: function(){
      console.log(Games.findOne({userId: Meteor.userId()}).monsters);
      return Games.findOne({userId: Meteor.userId()}).monsters;
    }
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
