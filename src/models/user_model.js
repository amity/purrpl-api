import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

import Reminder from './reminder_model'

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  // users: [{ type: User }],
  plant: { type: Number },
  // overallProgress: { type: Progress },
  reminders: [{ type: Reminder }],
  receivedAction: { type: Boolean },
})

UserSchema.set('toJSON', {
  virtuals: true,
})


UserSchema.pre('save', function beforeYourModelSave(next) {
  const user = this
  if (!user.isModified('password')) return next()

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(user.password, salt)
  user.password = hash
  return next()
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
