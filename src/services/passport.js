import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import User from '../models/user_model'

const localOptions = { usernameField: 'username' }

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
}


const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false)
    } else if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err) }

    if (!user) { return done(null, false) }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err)
      } else if (!isMatch) {
        done(null, false)
      } else {
        done(null, user)
      }
    })
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)


export const requireAuth = passport.authenticate('jwt', { session: false })
export const requireSignin = passport.authenticate('local', { session: false })
