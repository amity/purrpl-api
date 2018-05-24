import axios from 'axios'

const getWeather = (req, res) => {
  const lat = req.params.lat
  const long = req.params.long
  axios.get(`http://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${long}&APPID=${process.env.WEATHER_SECRET}`).then((response) => {
    const packagedWeather = {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      name: response.data.name,
    }
    res.send(packagedWeather)
  }).catch((error) => {
    res.status(500).json({ error })
  })
}

export default getWeather
