import { Router } from 'express'
import * as UserController from './controllers/user_controller';
import * as Reminders from './controllers/reminder_controller';
import * as Friends from './controllers/friends_controller';
import * as Progress from './controllers/progress_controller';
import getWeather from './controllers/weather_controller';
import { requireSignin } from './services/passport';

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api' })
})

// TODO: requireAuth, add secret key .env

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.route('/notifcations/:id')
  .get((req, res) => {
    // get the user's notifications
    .get(UserController.fetchNotifications(req, res))
  }

router.route('/weather/:lat&:long')
  .get((req, res) => {
    // get user's local temperature
    getWeather(req, res)
  })

router.route('/friends/:id')
  .get((req, res) => {
    // get user's friends
    Friends.getFriends(req, res)
  })
  .post((req, res) => {
    // add a new friend
    Friends.createFriend(req, res)
  })
  .put((req, res) => {
    // sends new notification
    Friends.sendAction(req, res)
  })
router.route('/friends/:id&:username')
  .delete((req, res) => {
    // delete a certain friend
    Friends.deleteFriend(req, res)
  })

router.route('/users/:id&:search')
  .get((req, res) => {
    // get all users
    UserController.getUsers(req, res)
  })

router.route('/user/:id')
  .get((req, res) => {
    // get user object
    res.send({ message: 'get user object' })
  })
  .put((req, res) => {
    // update the user
    res.send({ message: 'update the user' })
  })

router.route('/randomUser')
  .get((req, res) => {
    // get random user object
    UserController.randomUser(req, res)
  })

router.route('/reminders')
  .post(Reminders.createReminder) // create reminder, pass in info
  .get(Reminders.getReminders); // get all of user's reminders, pass in user

router.route('/reminders/:id')
  .get(Reminders.getReminder) // get a single reminder using id
  .put(Reminders.updateReminder) // update a single reminder using id and fields

router.route('/progress/:id')
  .get((req, res) => {
    // get user's progress
    // res.send({ message: 'get user\'s progress' })
    Progress.getProgress(req, res)
  })

router.route('/progress/feeling/:id')
  .get((req, res) => {
    // gets all feeling today information
    Progress.getFeelingToday(req, res)
  })
  .post((req, res) => {
    // adds a new feeling today value
    res.send({ message: 'how are you feeling?' })
  })

router.route('/progress/completion/:id')
  .get((req, res) => {
    // gets all completion information
    res.send({ message: 'here is how you have been completing your reminders' })
  })
  .post((req, res) => {
    // adds a new completion object
    res.send({ message: 'have you completed all your reminders?' })
  })

export default router
