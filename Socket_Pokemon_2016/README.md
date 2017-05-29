# IEEE_RasberryPi_Socket_Pokemon

The 2016 IEEE Fall Mini-Project Repo. All information is broken into 3 main folders with details below. Any questions please contact Spencer at sjfricke.at.wisc.edu

# Folder Breakdown

- **MainServer** all the backend server code and front end graphic code
- **Pi** all the Raspberry Pi socket server code
- **Tutorial** guides used for teaching and setting up

## MainSever Folder Breakdown

- **server.js** main file, where server kicks off and all codes starts from
  - to run type ```node server.js```
- **Database_Import/** holds default database data to import to your own mongoDB database
- **helperFunctions/** helper functions used in server code
- **public/** where all the front-end client code lives
- **views/** HTML files that use ejs (Embedded JavaScript) to load front client pages with server data
- **routes/** API for making changes to server mongo database
- **setup/** Way to reset server to start a new game
- **package.json** where all the module dependencies are listed
  - to install them type ```npm install``` in this folder
- **sockets.js** creates an instants for socket.io

## Pi Folder Breakdown

- **socket/** Socket server code to turn your Pi into a server
- **database/** Manages all the ugly BSON to JSON and other MongoDB code
- **client/** Files that when executables are ran send HTTP request messages to Main Server
- **Makefile** the make file that compiles C code

# Things that are set and DO NOT CHANGE
Please, feel free to mess with the code and make your changes, but here are the things TO NOT alter unless full changes are made

- Port the Pi and Main server run on
  - I have the code hardcoded to look for port 5000 on the Pi and port 8000 on the Main server
- Database scheme
  - the names are uses as is so its easier to just add a new field instead of deleting one
- URL paths for HTTP request
  - The server expects the PI to have certain URL routes avaiable and same for the Main server
