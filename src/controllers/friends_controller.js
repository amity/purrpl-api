import User from './../models/user_model'

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
        res.send(values.map((item) => {
          return {
            id: item._id,
            name: item.name,
            username: item.username,
            key: item._id,
          }
        }))
      })
    })
}

export const deleteFriend = (req, res) => {
  // finds main user
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // finds the friend to delete
      User.findOne({ username: req.params.username })
        .exec((err1, friend) => {
          user.set({ friends: user.friends.filter((item) => { return item.toString() !== friend.id.toString() }) })
          friend.set({ friends: friend.friends.filter((item) => { return item.toString() !== user.id.toString() }) })
          user.save().then((result) => {
            friend.save().then((friendResult) => {
              res.send({
                id: friendResult._id,
                isFriend: false,
                name: friendResult.name,
                username: friendResult.username,
                key: friendResult._id,
              })
            }).catch((err3) => {
              res.status(500).json({ err3 })
            })
          }).catch((err2) => {
            res.status(500).json({ err2 })
          })
        })
    })
}

export const sendAction = (req, res) => {
  // finds the user to send action to
  User.findOne({ username: req.body.username })
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      // updates destination user's notifications list
      if (user.notifications.notifs !== null) {
        user.notifications.notifs.forEach((notification) => {
          if (notification.senderId.toString() === req.params.id.toString() && notification.action === 'friend') {
            res.status(208)
          }
        })

        user.notifications.notifs.push({ senderId: req.params.id, action: req.body.action.action, time: Date.now() })
      }

      user.set({ notifications: user.notifications })
      user.save()
        .then((result) => {
          res.json(result)
        }).catch((error) => {
          res.status(500).json({ error })
        })
    })
}

export const acceptRequest = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      User.findById(req.body.friendId)
        .exec((err1, friend) => {
          if (err1) res.status(500).json({ err1 })
          const friendIds = user.friends.map((friendId) => { return friendId.toString() })
          if (!friendIds.includes(friend.id.toString())) {
            user.friends.push(friend.id)
            user.save().then((result1) => {
              friend.friends.push(user.id)
              friend.save().then((result2) => {
                res.send({
                  id: friend._id,
                  isFriend: true,
                  name: friend.name,
                  username: friend.username,
                  key: friend._id,
                })
              })
            }).catch((error) => {
              res.status(500).json({ error })
            })
          }
        })
    }).catch((error) => {
      res.status(500).json(error)
    })
}
