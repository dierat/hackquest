#Hack Quest

A turn-based battle rpg where the valiant students at Hack Reacor battle the malevolent technologies of web development.

Most basic features needed for version 1.0:
(Would love to have all this done by the end of day 1)
<ul>
  <li><strike>add user accounts</strike></li>
  <li><strike>add a login page that appears instead of main page if user is not logged in</strike></li>
  <li><strike>have a header with login buttons</strike></li>
  <li><strike>list of all potential team members in a collection</strike></li>
  <li><strike>list of all potential monsters in a collection</strike></li>
  <li>have a saved games collection to hold users current team, monsters, and level</li>
  <li>on user creation, add new document to saved games for that user with 4 randomly selected team members</li>
  <li>list current team members on screen (name, photo, and stamina)</li>
  <li>on startup, copy ids of first level monsters into user's current monster's collection</li>
  <li>list of current monsters in a collection and shown on screen (icon + name?)</li>
  <li>monsters should have an ability that reduces a characters' stamina</li>
  <li>characters should have an ability that reduces a monster's health</li>
  <li>the user should be able to choose which monster each of the current characters (each in order until the end of the list)</li>
  <li>if a monster's health is reduced to 0, it is removed from the current game</li>
  <li>if no monsters are currently in the game, the player wins</li>
  <li>when the player has finished choosing the actions of the characters, each monster should attack a random character</li>
  <li>if a character's stamina is reduced to 0, s/he is removed from the current team</li>
  <li>if there are no current team members, the player loses</li>
  <li>after a game ends, show a win or lose message and then start a new game</li>
</ul>

Additional features for version 1.1:
<ul>
  <li>have styling for which entity is current choosing/performing an action</li>
  <li>track which level user is on, starting at 0</li>
  <li>when all current monsters have been defeated, increase the user's level and (if they were not on the last level) copy the ids of the next level's monsters into their current monster collection (otherwise show win message and start new game)</li>
  <li>have a button for starting a new game</li>
  <li>add more abilities to characters for the user to choose from</li>
  <li>add more abilities to monsters that the program chooses randomly</li>
  <li>add animations for who is acting and who is being acted upon</li>
  <li>add sound effects</li>
  <li>add music</li>
  <li>ability to choose team members when starting a new game</li>
</ul>

Pie in the sky goals for version 1.2:
<ul>
  <li>refactor UI to use React instead of Blaze</li>
</ul>
