# Earquake Globe Web Application project
## By Jacob Novak, Adam Holbel, and Danny Mendoza

## About
----
This project was developed using docker to containerize a mysql database, a goland backend, and a nextjs frontend.

The goal of creating this full stack web-application was to allow users to view earthquake data across the globe by interacting with a globe.

### How to Run
----
To Run this application clone the repository.


 1. Navigate to the root directory of the project
 2. run the command: npm install -g nodemon
 3. Enter the command: nodemon
 This should in theory start the containers with a watch so that they will be rebuilt every time there is a new update to code.

**This option is old but I am leaving just in case -- If nodemon works, just use that**
Once the repository is stored locally on your machine:
1. Navigate to the root directory of the project
2. run the command ** docker-compose up --build -d **

This will containerize the full stack and will allow you to run the program.


### Note for Dev
If you are just working on front end, you can just run npm dev to get automatic feedback and updates

