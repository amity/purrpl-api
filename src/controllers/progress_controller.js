import Progress from './../models/progress_model'

export const newProgress = (req, res) => {
  const userId = req.body.userId
  const feelingToday = req.body.feelingToday
  const reminderCompletion = req.body.reminderCompletion

  if (!feelingToday || !reminderCompletion) {
    return res.status(422).send('User feeling and info is necessary')
  }

  Progress.findOne({ userId })
    .then((dbProgress) => {
      if (dbProgress) res.status(409).send('Progress already exists')

      const progress = new Progress({ userId, feelingToday, reminderCompletion })
      progress.save()
        .then((result) => {
          return res.send({ progress })
        })
    })
}

export const updateProgress = (req, res) => {
  Progress.findById(req.body.id)
    .then((progress) => {
      progress.set({ feelingToday: req.body.frequency })
      progress.set({ reminderCompletion: req.body.reminderCompletion })
      progress.save().then((result) => {
        res.json({ message: 'progress updated' })
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}
