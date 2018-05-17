import Reminder from './../models/reminder_model'

export const newReminder = (req, res) => {
  const user = req.body.user // user id
  const type = req.body.type // string of type
  const frequency = req.body.frequency // frequency int
  const times = req.body.times // dictionary maps times:done
  const toggle = true // on or off boolean

  if (!user || !type) {
    return res.status(422).send('A user and type must be attached')
  }

  // checks to see if reminder already exists
  Reminder.findOne({ user, type })
    .then((dbReminder) => {
      if (dbReminder) res.status(409).send('Reminder already exists')

      const reminder = new Reminder({
        user,
        type,
        frequency,
        times,
        toggle,
      })
      reminder.save()
        .then((result) => {
          return res.send({ reminder })
        })
    })
}

// unclear if needed?
export const updateReminder = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.set({ frequency: req.body.frequency })
      reminder.set({ times: req.body.times })
      reminder.set({ toggle: req.body.toggle })
      reminder.save().then((result) => {
        res.json({ message: 'reminder updated' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

// just pass in reminder
export const toggleActive = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.set({ toggle: !reminder.body.toggle })
      reminder.save().then((result) => {
        res.json({ message: 'toggled' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

// require dictionary of modified times to be passed in
export const updateTimes = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.set({ times: req.body.times })
      // reminder.body.times.sort((a, b) => { return a.getTime() - b.getTime() })
      reminder.save().then((result) => {
        res.json({ message: 'modified time' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

// pass in time, reflect dictionary?
export const toggleCompletion = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      const i = reminder.body.times.indexOf(req.body.time)
      reminder.body.completion[i] = !reminder.body.completion[i]
      reminder.save().then((result) => {
        res.json({ message: 'toggled time' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}
