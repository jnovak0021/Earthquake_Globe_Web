# Earquake Globe Web Application project
## By Jacob Novak, Adam Holbel, and Danny Mendoza

## About
----
This project was developed using docker to containerize a mysql database, a goland backend, and a nextjs frontend.

The goal of creating this full stack web-application was to allow users to view earthquake data across the globe by interacting with a globe.

### How to Run
----
To Run this application clone the repository.

Once the repository is stored locally on your machine:
1. Navigate to the root directory of the project
2. run the command **docker-compose up --build -d**



* To verify install run the command: **docker ps**
	* You should see three containers running
	
		CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                               NAMES
		569623aa4f89   nextapp:1.0.0      "docker-entrypoint.s…"   8 minutes ago   Up 8 minutes   0.0.0.0:3000->3000/tcp              nextapp
		55a39ce2d575   sp25_p1_t1-goapp   "./api"                  8 minutes ago   Up 8 minutes   8000/tcp, 0.0.0.0:8080->8080/tcp    goapp
		a9f380572cea   mysql:latest       "docker-entrypoint.s…"   16 hours ago    Up 16 hours    0.0.0.0:3306->3306/tcp, 33060/tcp   db


This will containerize the full stack and will allow you to run the program.
