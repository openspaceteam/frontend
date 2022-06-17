# OpenSpaceTeam Frontend
OpenSpaceTeam is an open source implementation of a 
[Spaceteam](http://spaceteam.ca/)-like game, playable through the 
browser. This is the frontend's code, written in JavaScript with vue.js as.  
Backend's code is available [here](https://github.com/openspaceteam/backend).

## Current status
This project was made for ISIS Di Maggio's educational guidance (the 
italian high school I'm attending at the time of writing this, in 2018), 
so it's aimed at Italian middle school students. That's why the interface is entirely in Italian. If you are Italian and you wish to translate this project, you're welcome to make a fork and a submit pull request.  
The game is mostly working. It may be a bit unbalanced and there are a 
few unimplemented features, but what's been implemented works quite 
well.  
There are few comments and some stuff is a bit hacky on the frontend-side.  

## Installing (Docker)
Check out the [compose](https://github.com/openspaceteam/compose) repo.

## Requirements for manual installation
- node.js  
- npm  
- nginx (not required but highly recommended)  

## Manual installation
```
$ git clone https://github.com/openspaceteam/frontend.git
$ cd frontend
...
$ npm install
$ npm run build
```

## Configuring
[There's a sample nginx config in openspaceteam.nginx.conf.](https://github.com/openspaceteam/frontend/blob/master/openspaceteam.nginx.conf).  

## License
This project is licensed under the GNU AGPL 3 License.  
See the "LICENSE" file for more information.
