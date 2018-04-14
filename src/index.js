import $ from 'jquery'
import './style.scss'

let second = 0

setInterval(() => {
  second += 1
  $('#main').html(`You have been here for ${second} seconds`)
}, 1000)

