# purrpl 🐱
API backend for a React Native app for self-care!

![](https://i.imgur.com/b2QqScv.png)

## Architecture 🛠
  ### Models and Controllers:
  * Progress
  * Reminders
  * Users
  
  ### Routes:
  * Sign in
  * Sign up
  * Friends(ID):
    * Get (Get user's friends)
    * Post (Add friend)
    * Delete (Delete friend)
  * User(ID):
    * Get (Get User object)
    * Put (Update User)
  * Reminders: 
    * Post (Create reminder)
    * Get (Get user's reminders)
  * Progress:
    * Get (Get user's progress)
    * Put (Update user's progress)

## Setup 🚀

```bash
git clone https://github.com/dartmouth-cs52-18S/project-api-purple-gorilla.git
cd project-api-purple-gorilla
yarn
yarn dev
```

## Deployment 🛳

Deployed at https://project-api-black-mirror.herokuapp.com/.

Deployment is through 
```
prod: yarn build; node src/server.js
```

## Authors 📝
* Raul Rodgriguez '19
* Ijemma Onwuzulike '19
* Nate Neumann '20
* Amy Guan '20
* Christina Lu '20
* Sofia Stanescu-Bellu '20

## Acknowledgments 🤓
Thanks to Tim!!!!!!!!!!!!!!
Thanks to OpenWeatherMap API for location - weather incorporation.
