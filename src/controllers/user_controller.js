import jwt from 'jwt-simple'
import dotenv from 'dotenv'
import User from './../models/user_model'
import Reminder from './../models/reminder_model'
import Progress from './../models/progress_model'


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

export const randomUser = (req, res) => {
  User.findOne({})
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      res.json({
        id: user._id,
        name: user.name,
        username: user.username,
      })
    })
}

export const signin = (req, res, next) => {
  res.send({
    token: tokenForUser(req.user),
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
  })
}

export const signup = (req, res, next) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(422).send('You must provide name, username, and password');
  }

  User.findOne({ username })
    .then((data) => {
      if (data == null) {
        const user = new User({ name, username, password })
        new Progress({ userId: user._id }).save().then((savedProgress) => {
          user.progress = savedProgress._id
          const reminders = ['water', 'sunscreen', 'food', 'medicine', 'sleep']
          const remindersPromises = reminders.map((reminder) => {
            return new Reminder({ userId: user._id, type: reminder }).save()
          })
          Promise.all(remindersPromises).then((results) => {
            user.reminders = results.map((item) => { return item._id })
            user.save()
              .then((response) => {
                res.send({
                  token: tokenForUser(user),
                  id: response.id,
                  name: response.name,
                  username: response.username,
                })
              })
          })
        })
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

// update with friends' avatar?
// sort by date?
const fix = (notifs) => {
  return notifs.map((notif) => {
    return {
      _id: notif._id,
      name: notif.senderId.name,
      username: notif.senderId.username,
      action: notif.action,
      time: notif.time,
    };
  });
};

export const getNotifs = (req, res) => {
  User.findById(req.params.id)
    .populate('notifications.senderId')
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      res.send(fix(user.notifications))
    })
}
