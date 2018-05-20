import jwt from 'jwt-simple'
import dotenv from 'dotenv'
import User from './../models/user_model'

dotenv.config({ silent: true })

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user._id, iat: timestamp }, process.env.AUTH_SECRET)
}

export const getUsers = (req, res) => {
  const userId = req.params.id
  const searchTerm = req.params.search
  // searching for all users
  User.find({})
    .exec((err, users) => {
      if (err) res.status(500).json({ err })
      // searching for the main user
      User.findById(userId)
        .exec((err1, masterUser) => {
          if (err1) res.status(500).json({ err })
          // creating a list of all users that start with searchTerm
          const foundUsers = users.filter((user) => {
            return user.username.substring(0, searchTerm.length) === searchTerm && user._id.toString() !== userId.toString()
          })
          res.json(foundUsers.map((item) => {
            const friendIds = masterUser.friends.map((friendId) => { return friendId.toString() })
            let isFriend = false
            if (friendIds.includes(item._id.toString())) {
              isFriend = true
            }
            return {
              id: item._id,
              name: item.name,
              username: item.username,
              key: item._id,
              isFriend,
            }
          }))
        })
    })
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) })
}

export const signup = (req, res, next) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(422).send('You must provide name, username, and password');
  }

  User.findOne({ username })
    .then((data) => {
      if (data == null) {
        const user = new User();
        user.name = name;
        user.username = username;
        user.password = password;
        user.save()
          .then((response) => {
            res.send({
              token: tokenForUser(user),
              id: response.id,
              name: response.name,
              username: response.username,
            });
          })
          .catch((err) => {
            if (err) {
              res.sendStatus(500);
            }
          });
      } else {
        res.status(422).send('User already exists');
      }
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500);
    });

  return next;
}
