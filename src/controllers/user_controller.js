import jwt from 'jwt-simple'
import dotenv from 'dotenv'
import User from './../models/user_model'

dotenv.config({ silent: true })

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user._id, iat: timestamp }, process.env.AUTH_SECRET)
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) })
}

export const signup = (req, res, next) => {
  const name = req.body.name
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(422).send('You must provide an email and password')
  }

  // checks to see if user already exists
  User.findOne({ username })
    .then((userEmail) => {
      if (userEmail) res.status(409).send('User already exists')

      const user = new User({ name, username, password })
      user.save()
        .then((result) => {
          return res.send({ token: tokenForUser(user) })
        })
        .catch((error) => {
          res.status(500).json({ error });
        })
    })
}
