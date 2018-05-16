import { Router } from 'express'
import * as User from './controllers/user_controller'
// import * as Post from './controllers/post_controller'
// import { requireAuth, requireSignin } from './services/passport'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api' })
})

router.route('/friends/:id')
  .get((req, res) => {
    // get user's friends
  })
  .post((req, res) => {
    // add a new friend
  })
  .delete((req, res) => {
    // delete a certain friend
  })

router.route('/user/:id')
  .get((req, res) => {
    // get user object
  })
  .put((req, res) => {
    // update the user
  })

router.route('/reminders/:id')
  .get((req, res) => {
    // get user's reminders
  })
  .post((req, res) => {
    // create new reminder
  })
  .put((req, res) => {
    // update existing reminders
  })

router.route('/progress/:id')
  .get((req, res) => {
    // get user's progress
  })
  .put((req, res) => {
    // update user's progress
  })

export default router
