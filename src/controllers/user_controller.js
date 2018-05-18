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
  console.log('signing up');

  console.log(req)

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
            res.send({ token: tokenForUser(user) });
          })
          .catch((err) => {
            if (err) {
              console.log(err)
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
