#Importing Sample Data

This folder is used to hold the MongoDB data I used for my game. Feel free once you import this data to alter it to your liking

## How to import

- Make sure you have MongoDB installed on your machine, if you dont check the "Setting Up Main Server" in the tutorial section
- Start your MongoDB instant with the ```mongod``` service
- Get these files in the directory on your local machine in via command line type
-- ```mongoimport --db IEEE --collection Models --file path/to/Models.js``` 
-- ```mongoimport --db IEEE --collection Players --file path/to/Players.js```


## For Windows Users

note that all instances of ```mongoimport``` should be the path the the mongoimport.exe file. For me it is ```"C:\Program Files\MongoDB\Server\3.2\bin\mongoimport.exe"```

To save yourself the headache fin the ```"C:\Program Files\MongoDB\Server\3.2\bin\``` folder where all the .exe files are and set that to your enviroment variable path

-Find the "Edit the system environment variables" in control panel (or start search it with window key)
-Click "Envionment Variables" which is towards the bottom right
-In the system variable box (should be bottom one) find "Path" and click "Edit"
-Click "New"
-Add the file path to that folder and hit "Ok" 
-You will need to restart any command prompt session currently for it to take in effect
-You can now just type ```mongod``` to start your MongoDB!

