import User from './../models/user_model'
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

export const getProgress = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      Progress.findById(user.progress)
        .then((progress) => {
          res.send(progress)
        }).catch((error) => {
          res.status(500).json(error)
        })
    })
}

export const addFeelingToday = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      Progress.findById(user.progress)
        .then((progress) => {
          progress.set({ feelingToday: [...progress.feelingToday, req.body.feelingToday] })
          progress.save().then((result) => {
            res.json(result)
          })
        }).catch((error) => {
          res.status(500).send(error)
        })
    }).catch((error) => {
      res.status(500).send(error)
    })
}

export const updateFeelingToday = (req, res) => {
  Progress.findById(req.params.id)
    .then((progress) => {
      progress.update({ feelingToday: req.body.feelingToday })
      progress.save().then((result) => {
        res.json(result)
      }).catch((err) => {
        res.status(500).json({ err })
      })
    })
}

const generateMessage = (value) => {
  switch (value) {
    case 0:
      return 'You didn\'t have a good week :('
    case 1:
      return 'You had a pretty rough week'
    case 2:
      return 'This week was sort of tough'
    case 3:
      return 'There were definitely some ups and downs'
    case 4:
      return 'Nice, you had a pretty solid week!'
    case 5:
      return 'Wow, this was a great week for you!'
    default:
      return 'There\'s not enough data to chart!'
  }
}

export const getFeelingToday = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      Progress.findById(user.progress)
        .then((progress) => {
          let averageValue = 0
          const dailyFeelings = progress.feelingToday.map((today) => {
            averageValue += today.value
            return today.value
          })
          averageValue = dailyFeelings.length >= 7 ? Math.round(averageValue / dailyFeelings.length) : -1
          res.json({ feelingToday: dailyFeelings, summary: generateMessage(averageValue) })
        }).catch((error) => {
          res.status(500).send(error)
        })
    }).catch((error) => {
      res.status(500).send(error)
    })
}

export const addDailyCompletion = (req, res) => {
  Progress.findById(req.params.id)
    .then((progress) => {
      progress.set({ dailyReminderCompletion: [...progress.dailyReminderCompletion, req.body.dailyReminderCompletion] })
      progress.save().then((result) => {
        res.json(result)
      })
    })
}

export const updateProgress = (req, res) => {
  Progress.findById(req.params.id)
    .then((progress) => {
      progress.set({ feelingToday: req.body.feelingToday })
      progress.set({ dailyReminderCompletion: req.body.dailyReminderCompletion })
      progress.save().then((result) => {
        res.json(result)
      })
    })
    .catch((err) => {
      res.status(500).json({ err })
    })
}

export const getDailyCompletion = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      Progress.findById(user.progress)
        .then((progress) => {
          res.send(progress.dailyReminderCompletion)
        }).catch((error) => {
          res.status(500).json(error)
        })
    })
}
