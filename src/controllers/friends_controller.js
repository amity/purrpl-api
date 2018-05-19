import User from './../models/user_model'

export const createFriend = (req, res) => {
  const userId = req.params.id
  const friendUsername = req.body.username

  // finding the main user
  User.findById(userId)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // searching for user in database
      User.findOne({ username: friendUsername })
        .exec((err1, friend) => {
          if (err1) res.status(500).json({ err })
          const friendIds = user.friends.map((friendId) => { return friendId.toString() })
          if (!friendIds.includes(friend.id.toString())) {
            user.friends.push(friend.id)
            user.save().then((result) => {
              res.send(result)
            }).catch((error) => {
              res.status(500).json({ err })
            })
          }
        })
    })
}

export const getFriends = (req, res) => {
  // finds main user
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // searches database for all friends
      const friendPromises = user.friends.map((friendId) => {
        return User.findById(friendId)
      })

      Promise.all(friendPromises).then((values) => {
        res.send(values.map((item) => { return { id: item._id, name: item.name, username: item.username } }))
      })
    })
}

export const deleteFriend = (req, res) => {
  // finds main user
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // finds the friend to delete
      User.findOne({ username: req.body.username })
        .exec((err1, friend) => {
          user.set({ friends: user.friends.filter((item) => { return item !== friend.id }) })
        })
    })
}

export const sendAction = (req, res) => {
  // finds the user to send action to
  User.findOne({ username: req.body.username })
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // updates destination user's notifications list
      user.notifications.push(req.body.action)
      user.set({ notifications: user.notifications })
      user.save()
        .then((result) => {
          res.json(result)
        })
        .catch((error) => {
          res.status(500).json({ error })
        })
    })
}
