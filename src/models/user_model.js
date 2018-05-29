import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  visible: { type: String, default: 'Everyone' },
  notifications: {
    active: { type: Boolean, default: true },
    notifs: [{
      senderId: Schema.Types.ObjectId,
      action: String,
      time: Date,
    }],
  },
  avatar: { type: Schema.Types.ObjectId, ref: 'Avatar' },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  progress: { type: Schema.Types.ObjectId, ref: 'Progress' },
  reminders: [{ type: Schema.Types.ObjectId, ref: 'Reminder' }],
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

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  // also used bcrypt.js docs for this function: https://github.com/kelektiv/node.bcrypt.js
  bcrypt.compare(candidatePassword, this.password, (err, res) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, res);
    }
  });
};

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
