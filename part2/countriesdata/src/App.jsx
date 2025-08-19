import { useState, useEffect } from 'react'

import axios from 'axios'

const CountryData = ({ country }) => { 
  const [weatherData, setWeatherData] = useState(null)
  
  useEffect(() => {
    if (country) {
      setWeatherData(null) // Reset weather data for new country
      
      const apiKey = import.meta.env.VITE_WEATHER_KEY
      
      if (!apiKey) {
        console.error('Weather API key not found. Please set VITE_WEATHER_KEY in your .env file')
        return
      }

      const city = country.capital[0] // capital is an array
      const coordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

      console.log('Fetching weather for:', city)
      
      axios.get(coordsUrl)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0]
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

            return axios.get(weatherUrl)
          } else {
            throw new Error('No coordinates found for city')
          }
        })
        .then((response) => {
          console.log('Weather data received:', response.data)
          setWeatherData(response.data)
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error)
          setWeatherData(null)
        })
    }
  }, [country]) // Only country is needed - setWeatherData is stable

  if (!country) return null

  return (
    <div>
      <h1>{country.name.common}</h1>
      Capital: {country.capital[0]}<br></br>
      Area: {country.area}<br></br>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language, i) => (
          <li key={i}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />

      <h2>Weather in {country.capital[0]}</h2>
      {weatherData ? (
        <div>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>Wind: {weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  )
}

const Result = ({ countries, filter }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  
  if (!countries) return null

  if (filter === '') return <>Update the filter to search</>

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  const len = filteredCountries.length

  if (len > 10) { 
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  if (len > 1) {
    return (
      <div>
        {filteredCountries.map(country => (
          <div key={country.cca2}>
            {country.name.common} <button onClick={
              () => {
                // Toggle selected country
                setSelectedCountry(country)
              }
            }>show</button>
          </div>
        ))}

        {selectedCountry && <CountryData country={selectedCountry} />}
      </div>
    )
  }

  if (len === 1) return <CountryData country={filteredCountries[0]} />

  return <>No country matches the filter</>
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      setCountries(response.data)
    })
  }, [])

  return (
    <div>
      Find countries <input onChange={
        (e) => {
          setFilter(e.target.value)
        }
      }/> <br></br>

      <Result 
        countries={countries} 
        filter={filter}
      />
    </div>
  )
}

export default App
