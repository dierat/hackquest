Characters = new Mongo.Collection('characters');
Monsters = new Mongo.Collection('monsters');


if (Meteor.isClient) {
  // Login requires username instead of e-mail address for easier testing.
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
  // Renders the login panel as uncollapsed on login_page template.
  Template.loginScreen.rendered = function() {
    Accounts._loginButtonsSession.set('dropdownVisible', true);
  };
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
      techs.forEach(function(tech){
        Monsters.insert({
          tech: tech[0],
          icon: tech[0] + '.png',
          stam: tech[1]
        });
      });
    }
  });
}
