import mongoose from 'mongoose'
import moment from 'moment'
import User from './../models/user_model'
import Progress from './../models/progress_model'
import Reminder from './../models/reminder_model'

const mongoDB = 'mongodb://localhost/blackmirror'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise

/* NOTE
 * To run this script:
 * babel-node generate_users.js
 * Pay attention to the console after the script is done
 */

const users = [
  {
    name: 'Testing1',
    username: 'testing1',
    password: 'password1',
    feelingToday: [
      {
        timestamp: moment('5-1-2018'),
        value: 3,
      },
      {
        timestamp: moment('5-2-2018'),
        value: 4,
      },
      {
        timestamp: moment('5-3-2018'),
        value: 1,
      },
      {
        timestamp: moment('5-4-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-5-2018'),
        value: 5,
      },
      {
        timestamp: moment('5-6-2018'),
        value: 5,
      },
      {
        timestamp: moment('5-6-2018'),
        value: 4,
      },
    ],
  },
  {
    name: 'Testing2',
    username: 'testing2',
    password: 'password2',
    feelingToday: [
      {
        timestamp: moment('5-1-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-2-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-3-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-4-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-5-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-6-2018'),
        value: 0,
      },
      {
        timestamp: moment('5-6-2018'),
        value: 0,
      },
    ],
  },
  {
    name: 'Testing3',
    username: 'testing3',
    password: 'password3',
    feelingToday: [
      {
        timestamp: moment('5-1-2018'),
        value: 3,
      },
      {
        timestamp: moment('5-2-2018'),
        value: 3,
      },
      {
        timestamp: moment('5-3-2018'),
        value: 3,
      },
      {
        timestamp: moment('5-4-2018'),
        value: 1,
      },
      {
        timestamp: moment('5-5-2018'),
        value: 1,
      },
      {
        timestamp: moment('5-6-2018'),
        value: 3,
      },
      {
        timestamp: moment('5-6-2018'),
        value: 4,
      },
    ],
  },
]

const createUsersPromises = users.map((user) => {
  const newUser = new User({ name: user.name, username: user.username, password: user.password })
  new Progress({ userId: newUser._id, feelingToday: user.feelingToday }).save().then((savedProgress) => {
    newUser.progress = savedProgress._id
    new Reminder({ userId: newUser._id, type: 'sleep' }).save().then((savedReminder) => {
      newUser.reminders = [savedReminder]
      return newUser.save()
    })
  })
})

Promise.all(createUsersPromises).then((result) => {
  console.log('REMEMBER TO END THIS SCRIPT: Command ctrl+c')
})

