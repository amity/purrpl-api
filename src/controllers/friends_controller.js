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
      res.send(user.friends)
    })
}

export const deleteFriend = (req, res) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) res.status(500).json({ err })
      
    })
}
