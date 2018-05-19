import User from './../models/user_model'

export const createFriend = (req, res) => {
  const userId = req.params.id
  const friendUsername = req.body.friendUsername

  // finding the main user
  User.findOne({ id: userId })
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // searching for user in database
      User.findOne({ username: friendUsername })
        .exec((err1, friend) => {
          if (err1) res.status(500).json({ err })
          // if these two users aren't friends, add each other to friends list
          if (!user.friends.include(friend.id) && friend.friends.include(user.id)) {
            user.friends.push(friend.id)
            friend.friends.push(user.id)
            const users = [user, friend]
            const saveUsersPromises = users.map((item) => {
              item.save()
            })
            Promise.all(saveUsersPromises).then((values) => {
              res.send(values)
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
