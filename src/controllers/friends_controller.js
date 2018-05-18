import User from './../models/user_model'

export const createFriend = (req, res) => {
  const userId = req.params.id
  const friendUsername = req.body.friendUsername

  User.findOne({ id: userId })
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      User.findOne({ username: friendUsername })
        .exec((err1, friend) => {
          if (err1) res.status(500).json({ err })
          if (!user.friends.include(friend.id)) {
            user.friends.push(friend.id)
            user.save()
              .then((result) => {
                res.json(result)
              })
              .catch((error) => {
                res.result(500).json({ error })
              })
          }
        })
    })
}

export const getFriends = (req, res) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      const friendPromises = user.friends.map((friendId) => {
        return User.findById(friendId)
      })

      Promise.all(friendPromises).then((values) => {
        res.send(values.map((item) => { return { id: item._id, name: item.name, username: item.username } }))
      })
    })
}

export const deleteFriend = (req, res) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })

      User.findOne({ username: req.body.username })
        .exec((err1, friend) => {
          user.set({ friends: user.friends.filter((item) => { return item !== friend.id }) })
        })
    })
}

export const sendAction = (req, res) => {
  User.findOne(req.body.username)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      const newNotifications = [...user.notifications, res.body.action ]
      user.set({ notifications: newNotifications })
      user.save()
        .then((result) => {
          res.json(result)
        })
        .catch((error) => {
          res.result(500).json({ error })
        })
    })
}
