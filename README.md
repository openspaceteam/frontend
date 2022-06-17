# OpenSpaceTeam Game
OpenSpaceTeam is an open source implementation of a 
[Spaceteam](http://spaceteam.ca/)-like game, playable through the 
browser. This is a fork from [OpenSpaceTeam's](https://github.com/openspaceteam) [frontend](https://github.com/openspaceteam/frontend), which referenced a separate [backend repo](https://github.com/openspaceteam/backend). As the original author is no longer active, I've forked both and updated them to work in 2022. As the base engine is quite flexible, I may push this in a new direction if I have the time.

## Changelog
1. [30/05/22] Updated packages and fixed related bugs.

## Requirements
- node.js
- npm

## Installing
```
$ git clone https://github.com/nat-foo/openspaceteam-game.git
$ cd openspaceteam-game
$ npm i
$ npm start

Run localhost on 0.0.0.0:8080.
```

## Configuring
[There's a sample nginx config in openspaceteam.nginx.conf](https://github.com/nat-foo/openspaceteam-game/blob/master/openspaceteam.nginx.conf).  

## License
This project is licensed under the GNU AGPL 3 License. See the "LICENSE" file for more information.
