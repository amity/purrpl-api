import Avatar from './../models/avatar_model'

const fetchAvatar = (req, res) => {
  Avatar.findOne({ userId: req.params.id })
    .then((avatar) => {
      res.send(avatar)
    }).catch((error) => {
      res.status(500).json(error)
    })
}

export default fetchAvatar
