import User from './../models/user_model'
import Reminder from './../models/reminder_model'
import Avatar from './../models/avatar_model'

const generateState = (threshold, numerator, denominator) => {
  if (threshold > 0.7 || numerator === denominator) {
    return 'happy'
  } else if (threshold > 0.4) {
    return 'normal'
  } else {
    return 'sad'
  }
}

const generateMessage = (state) => {
  switch (state) {
    case 'happy':
      return 'I\'m feeling great!'
    case 'normal':
      return 'Just chilling'
    case 'sad':
      return 'I\'m not feeling to well'
    default:
      return 'I don\'t have enough information'
  }
}

const fetchAvatar = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      Reminder.find({ userId: user._id })
        .then((reminders) => {
          let numerator = 0
          let denominator = 0
          reminders.forEach((reminder) => {
            denominator += reminder.times.length
            reminder.completion.forEach((completionObject) => {
              completionObject.completed.forEach((item) => {
                if (item.completion) {
                  numerator += 1
                }
              })
            })
          })
          Avatar.findOne({ userId: req.params.id })
            .then((avatar) => {
              if (!denominator) {
                denominator = 1
              }
              const threshold = numerator / denominator
              const state = generateState(threshold, numerator, denominator)
              const message = generateMessage(state)
              avatar.status = state
              avatar.message = message
              avatar.save().then((result) => {
                res.send(result)
              }).catch((error) => {
                res.status(500).json(error)
              })
            })
        })
    })
}


export default fetchAvatar
