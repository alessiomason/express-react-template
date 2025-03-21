# Express React template

The repository contains a template for building a web application in its client and server parts. The web application is developed using the Express framework for the server and React for the client.  
Both the client and the server offer few basic functionalities and are merely intended to be a starting point to develop a fully-fledged application.

## Basic features
- Sign up with email and password
- Login
- Page with personal information
- Edit personal information
- Change the password
	

## Technologies used
- Server
	- The server is developed in TypeScript and uses Express as a framework
	- The server relies on a MySQL database
	- The server uses Passport to manage the authentication process

- Client
	- The client is developed in TypeScript using the React library and the Bootstrap framework

## System architecture
The server exposes a set of APIs to operate and serves the client as a set of static files, which in turn uses the APIs exposed by the server.

## Running the software
The template is meant to be deployed in a Heroku container, which runs the two scripts in the main `package.json`. Such scripts can be modified to run the web app elsewhere.  
To manually run the software, it would be advisable to manually run the server and, if not previously built, the client too.

### Running the client
The client can be run executing the `npm start` command in the `client` folder. The client will run on port `3000` and will contact the server on port `3001`. Otherwise, running the `npm run build` command in the same folder will build the client, which will then be served by the server as a set of static files.

### Running the server
The server can be run executing the `npm run dev` command in the `server` folder. This will run the server using _nodemon_, so the server will be restarted at every change. Alternatively, the server can be built by transpiling the TypeScript files (executing the `npm run build` command in the same folder) and then run with `npm start`.  
In any case, the server will be run on port `3001` (if not otherwise specified by the environment variable, see below).

### Testing the server
[![Tests for server](https://github.com/alessiomason/gestionale/actions/workflows/server-tests.yml/badge.svg)](https://github.com/alessiomason/gestionale/actions)  
The tests written for the server part can be run by executing the `npm run test` command in the `server` folder.

### Environment variables
#### Server environment variables
The server requires several environment variables to operate. These are usually included in a `.env` file located inside the `server` folder (file which is obviously not included in the repository for security reasons). These variables are:

- Mandatory
	- `APP_URL`: the URL the client is served from (used for CORS) - for example, it might be `http://localhost:3000` if run locally;
	- `DB_HOST`: the hostname of the database;
	- `DB_PORT`: the port to connect to the database;
	- `DB_USERNAME`: the username for the database;
	- `DB_PASSWORD`: the password for the database;
	- `DB_NAME`: the name of the database;
	- `SESSION_SECRET`: the secret string used to sign the session ID cookie;

- Optional
	- `PORT`: the port on which the server has to be served; defaults to `3001` if absent.

#### Client environment variables
The client too requires an environment variable to specify the URL of the server.  
If the client is run locally, the environment variable can be omitted (as the code defaults to consider the server located at `http://localhost:3000`).  
Otherwise, the `REACT_APP_BASE_URL` environment variable is needed. If the client is served through the server, the environment variable has to be specified amongst the other variables for the server.

### Database
The server is written to be used with a MySQL database, but can be easily adapted to use other databases.

Database tables needed:
- system
	- Used to store information about the server itself and to "ping" the DB
	- Schema:
		- description: varchar(255)
		- value: varchar(255)
	- Values to be inserted:
		- (description, value): ("Ping", "Pong")

- users
	- Stores the users and their authentication information
	- Schema:
		- id: int
		- email: varchar(255)
		- name: varchar(255)
		- surname: varchar(255)
		- username: varchar(255)
		- hashed_password: blob
		- salt: tinyblob
		- registration_date: char(25) (expects an ISO8601-formatted date)

- sessions
	- Do not manually create this table! It will be automatically created by express-session as needed.


### Server APIs
The server exposes several API:

- System
	- `GET /api/system/ping`
		- Used to verify the connection to the server
		- Response code: 200
		- Response body: `"pong"`
	- `GET /api/system/pingDB`
		- Used to verify if the server is connected to the database
		- Response code: 200
		- Response body: `"Pong"` (or the corresponding value in the server)
	
- Sign up
	- `POST /api/signup`
		- Create a new user
		- Request body
			- email: string
			- name: string
			- surname: string
			- username: string
			- password: string
		- Response code: 200

	- `PUT /api/password`
		- Update the user's password
		- Request body
			- oldPassword: string
			- newPassword: string
		- Response code: 200
		- Possible errors:
			- `404 User not found`
			- `422 Wrong password`

- Session
	- `POST /api/sessions`
		- Login
		- Request body
			- email: string
			- password: string
		- Response code: 200
		- Possible errors:
			- `422 Wrong email or password`

	- `GET /api/sessions/current`
		- Check whether the user is logged in or not
		- Response code: 200
		- Possible errors:
			- `401 Non-authenticated user`

	- `DELETE /api/sessions/current`
		- Logout
		- Response code: 200
	
- Users
	- `GET /api/users`
		- Get all users
		- Response code: 200
		- Response body:
			- User[]
	
	- `GET /api/users/:userId`
		- Get user by id
		- Response code: 200
		- Possible errors:
			- `422 User with same username already exists`

	- `GET /api/users/username/:username`
		- Verify the uniqueness of the username
		- Response code: 200
		- Response body:
			- User

	- `PUT /api/users`
		- Update the user
		- Request body
			- email: string | undefined
			- name: string | undefined
			- surname: string | undefined
			- username: string | undefined
		- Response code: 200