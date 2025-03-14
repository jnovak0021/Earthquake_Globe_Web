# Earthquake  Globe Web Application project
## By Jacob Novak, Adam Holbel, and Danny Mendoza

## About
----
This project was developed using docker to containerize a mysql database, a goland backend, and a nextjs frontend.

The goal of creating this full stack web-application was to allow users to view earthquake data across the globe by interacting with a globe.
### Photos of Project
![Screenshot 2025-03-11 131203](https://github.com/user-attachments/assets/b6d8b648-d65c-4ef2-a3ca-477e88e26878)
![Screenshot 2025-03-11 131327](https://github.com/user-attachments/assets/ec9b8ed7-c980-4a4c-92f5-69a9e7bd1b43)
![Screenshot 2025-03-11 131352](https://github.com/user-attachments/assets/a750298f-24b2-4a31-8920-879f917435b7)
![Screenshot 2025-03-11 131424](https://github.com/user-attachments/assets/31b0273e-396c-46e9-9ad9-c4d5bb4e3240)
![Screenshot 2025-03-11 131441](https://github.com/user-attachments/assets/f20a1731-5897-4acd-a6d2-aac3069540f3)


### Installation
----
Before running this program, please ensure that you have installed:
- Docker Desktop
- Node/npm
- next js

Please run the commands within your front end:

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
npm install --save-dev @types/react


Currently hosted using AWS, Vercel, and Fly.io
