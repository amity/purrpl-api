import { Router } from 'express'
import * as UserController from './controllers/user_controller';
import * as Reminders from './controllers/reminder_controller';
import { requireSignin } from './services/passport';

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api' })
})

// TODO: requireAuth, add secret key .env

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.route('/friends/:id')
  .get((req, res) => {
    // get user's friends
    res.send({ message: 'get user\'s friends' })
  })
  .post((req, res) => {
    // add a new friend
    res.send({ message: 'add a new friend' })
  })
  .delete((req, res) => {
    // delete a certain friend
    res.send({ message: 'delete a certain friend' })
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

router.route('/reminders')
  .post(Reminders.createReminder) // create reminder, pass in info
  .get(Reminders.getReminders); // get all of user's reminders, pass in user

router.route('/reminders/:id')
  .get(Reminders.getReminder) // get a single reminder using id
  .put(Reminders.updateReminder) // update a single reminder using id and fields

router.route('/progress/:id')
  .get((req, res) => {
    // get user's progress
    res.send({ message: 'get user\'s progress' })
  })
  .put((req, res) => {
    // update user's progress
    res.send({ message: 'update user\'s progress' })
  })

export default router
