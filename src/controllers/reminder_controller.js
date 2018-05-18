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
  Reminder.findById(req.params.id)
    .then((rem) => {
      res.send(rem);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// update single reminder by id
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
};

// // just pass in reminder
// export const toggleActive = (req, res) => {
//   Reminder.findById(req.params.id)
//     .then((reminder) => {
//       reminder.set({ toggle: !reminder.body.toggle })
//       reminder.save().then((result) => {
//         res.json({ message: 'toggled' })
//       })
//     })
//     .catch((err) => {
//       res.status(500).json({ err })
//     })
// }
//
// // require dictionary of modified times to be passed in
// export const updateTimes = (req, res) => {
//   Reminder.findById(req.params.id)
//     .then((reminder) => {
//       reminder.set({ times: req.body.times })
//       // reminder.body.times.sort((a, b) => { return a.getTime() - b.getTime() })
//       reminder.save().then((result) => {
//         res.json({ message: 'modified time' })
//       })
//     })
//     .catch((err) => {
//       res.status(500).json({ err })
//     })
// }
//
// // pass in time, reflect dictionary?
// export const toggleCompletion = (req, res) => {
//   Reminder.findById(req.params.id)
//     .then((reminder) => {
//       const i = reminder.body.times.indexOf(req.body.time)
//       reminder.body.completion[i] = !reminder.body.completion[i]
//       reminder.save().then((result) => {
//         res.json({ message: 'toggled time' })
//       })
//     })
//     .catch((err) => {
//       res.status(500).json({ err })
//     })
// }
