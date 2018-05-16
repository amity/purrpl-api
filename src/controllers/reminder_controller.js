import Reminder from './../models/reminder_model'

export const newReminder = (req, res) => {
  const userId = req.body.userId
  const type = req.body.type
  const frequency = req.body.type
  const time = req.body.time
  const toggle = true

  if (!userId || !type) {
    return res.status(422).send('A user and type must be attached')
  }

  // checks to see if reminder already exists
  Reminder.findOne({ userId, type })
    .then((dbReminder) => {
      if (dbReminder) res.status(409).send('Reminder already exists')

      const reminder = new Reminder({
        userId,
        type,
        frequency,
        time,
        toggle,
      })
      reminder.save()
        .then((result) => {
          return res.send({ reminder })
        })
    })
}

export const updateReminder = (req, res) => {
  Reminder.findById(req.body.id)
    .then((reminder) => {
      reminder.set({ frequency: req.body.frequency })
      reminder.set({ time: req.body.time })
      reminder.set({ toggle: req.body.toggle })
      reminder.save().then((result) => {
        res.json({ message: 'reminder updated' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

