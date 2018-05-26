import User from './../models/user_model'
import Reminder from './../models/reminder_model'

export const createReminder = (req, res) => {
  const reminder = new Reminder();
  reminder.user = req.body.user // user id
  reminder.type = req.body.type // string of type
  reminder.frequency = req.body.frequency // frequency int
  reminder.times = req.body.times // dictionary maps times:done
  reminder.toggle = req.body.toggle // on or off boolean

  reminder.save()
    .then((result) => {
      res.json({ message: 'reminder created!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

// get all reminders of this user
export const getReminders = (req, res) => {
  Reminder.find({ user: req.body.user })
    .exec((err, rems) => {
      if (err) {
        res.status(500).json({ err });
      }
      res.send(rems);
    });
};

// get a single reminder by id
export const getReminder = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      Reminder.findOne({ userId: user._id, type: req.params.type })
        .then((reminder) => {
          res.send({
            id: reminder._id,
            type: reminder.type,
            times: reminder.times,
            active: reminder.active,
          })
        })
        .catch((error) => {
          res.status(500).json(error)
        })
    })
}

const generateMessage = (type) => {
  switch (type) {
    case 'water':
      return 'Drink some water'
    case 'sunscreen':
      return 'Apply sunscreen'
    case 'food':
      return 'Eat some food'
    case 'medicine':
      return 'Take your medication'
    case 'sleep':
      return 'Get some rest'
    default:
      return ''
  }
}

export const dailyReminders = (req, res) => {
  Reminder.find({ userId: req.params.id, 'times.0': { $exists: true }, active: { $eq: true } })
    .then((reminders) => {
      const individualReminders = []
      reminders.forEach((reminder) => {
        reminder.times.forEach((time) => {
          individualReminders.push({
            id: reminder._id,
            key: reminder._id,
            type: reminder.type,
            time,
            message: generateMessage(reminder.type),
          })
        })
      })
      const sortedIndividualReminders = individualReminders.sort((a, b) => {
        if (a.time.value < b.time.value) {
          return -1
        } else {
          return 1
        }
      })
      res.send(sortedIndividualReminders)
    }).catch((error) => {
      res.status(500).json(error)
    })
}

export const updateActive = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.set({ active: req.body.active })
      reminder.save().then((result) => {
        res.send(result)
      })
    }).catch((error) => {
      res.status(500).json(error)
    })
}

export const updateTimes = (req, res) => {
  Reminder.findOneAndUpdate({ _id: req.params.id }, { $set: { times: req.body.times } }, { multi: true })
    .then((reminder) => {
      res.send(reminder.times)
    }).catch((error) => {
      res.status(500).json(error)
    })
}

export const toggleCompletion = (req, res) => {
  let foundDate = false
  let foundHour = false
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.completion.forEach((item) => {
        if (item.date === req.body.date) {
          foundDate = true
          item.completed.forEach((completedHour) => {
            if (completedHour.hour === req.body.hour) {
              foundHour = true
              completedHour.completion = req.body.completion
            }
          })
          // checks to see if the hour was ever set for specific date
          if (!foundHour) {
            item.completed.push({ hour: req.body.hour, completion: req.body.completion })
          }
        }
      })
      // checks to see if date was ever set in reminder
      if (!foundDate) {
        reminder.completion.push({ date: req.body.date, completed: [{ hour: req.body.hour, completion: req.body.completion }] })
      }
      reminder.save().then((result) => {
        res.send(result)
      }).catch((error) => {
        res.status(500).json(error)
      })
    })
}

export const getDateReminder = (req, res) => {
  Reminder.findOne({ userId: req.params.id, type: req.params.type })
    .then((reminder) => {
      let dateAndTimeReminder = {}
      reminder.completion.forEach((item) => {
        if (item.date === req.params.date) {
          item.completed.forEach((completedHour) => {
            if (completedHour.hour.toString() === req.params.hour) {
              dateAndTimeReminder = completedHour
            }
          })
        }
      })
      res.send(dateAndTimeReminder)
    }).catch((error) => {
      res.status(500).json(error)
    })
}
