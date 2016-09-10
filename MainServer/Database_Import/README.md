#Importing Sample Data

This folder is used to hold the MongoDB data I used for my game. Feel free once you import this data to alter it to your liking

## How to import

	- Make sure you have MongoDB installed on your machine, if you dont check the "Setting Up Main Server" in the tutorial section
	- Start your MongoDB instant with the ```mongod``` service
	- Get these files in the directory on your local machine in via command line type ```mongoimport --db IEEE --collection Models --file path/to/Models.js``` and ```mongoimport --db IEEE --collection Players --file path/to/Players.js```

**For Windows Users** note that all instances of ```mongoimport``` should be the path the the mongoimport.exe file. For me it is ```"C:\Program Files\MongoDB\Server\3.2\bin\mongoimport.exe"```

