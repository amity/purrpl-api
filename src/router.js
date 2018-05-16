import { Router } from 'express'
// import * as User from './controllers/user_controller'
// import * as Post from './controllers/post_controller'
// import { requireAuth, requireSignin } from './services/passport'

const router = Router()

router.get('/', (req, res) => {
  console.log('ok')
  res.json({ message: 'welcome to our blog api' })
})

// router.route('/posts')
//   .get((req, res) => {
//     Post.getPosts(req, res)
//   })
//   .post(requireAuth, Post.createPost)

// router.route('/posts/:id')
//   .get((req, res) => {
//     Post.getPost(req, res)
//   })
//   .put(requireAuth, Post.updatePost)
//   .delete(requireAuth, Post.deletePost)

// router.post('/signin', User.signin)
// router.post('/signup', User.signup)

// router.route('/comments/:id')
//   .get((req, res) => {
//     Post.getPost(req, res)
//   })
//   .post((req, res) => {
//     Post.createComment(req, res)
//   })

export default router
