import Reminder from './../models/reminder_model'

export const newReminder = (req, res) => {
  const user = req.body.userId
  const type = req.body.type
  const frequency = req.body.frequency
  const times = req.body.times
  const toggle = true
  const completion = req.body.completion

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
        completion,
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

// TODO: no same times
// require time to be passed in
export const addTime = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.body.times.push(req.body.time)
      reminder.body.times.sort((a, b) => { return a.getTime() - b.getTime() })
      reminder.save().then((result) => {
        res.json({ message: 'added time' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

// require time to be passed in
export const deleteTime = (req, res) => {
  Reminder.findById(req.params.id)
    .then((reminder) => {
      reminder.body.times.pop(req.body.time)
      reminder.save().then((result) => {
        res.json({ message: 'deleted time' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

// pass in time
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
