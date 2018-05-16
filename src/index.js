import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import mongoose from 'mongoose'
import apiRouter from './router'

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/purple-gorilla'
mongoose.connect(mongoURI)
mongoose.Promise = global.Promise

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(express.static('static'))
app.set('views', path.join(__dirname, '../src/views'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.send('hi')
})

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090
app.listen(port)

console.log(`listening on: ${port}`)
