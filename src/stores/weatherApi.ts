import { defineStore } from "pinia";
import axios from "axios";
import type { Coords, WeatherData } from "@/types/data.js";

export const useWeatherApiStore = defineStore({
  id: "weatherApi",

  state: () => ({
    weatherData: [] as WeatherData[] ,
    windDirection: '' as string,
    settingsOpened: false as boolean
  }),

  actions: {
    API_REQUEST(coords: Coords, city: string | null):void {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=924bdba454482fce947584b28d955c30`)
        .then(response => {
    // Adding new city all main data of the weather
          this.weatherData.push({
            id: new Date().toISOString(),
            temp: Math.ceil(response.data.main.temp - 273.15),
            feels_like: Math.ceil(response.data.main.feels_like - 273.15),
            icon: response.data.weather[0].icon,
            iconDesc: response.data.weather[0].main,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            visibility: (response.data.visibility / 1000).toFixed(1) + 'km',
            description: response.data.weather[0].description,
            wind: response.data.wind.speed.toFixed(1) + 'm/s',
            windDegs: response.data.wind.deg,
            city: city ? city : response.data.name,
            cityCountry: response.data.sys.country,
          })

          window.localStorage.setItem('weather_data', JSON.stringify(this.weatherData))
        })
        .catch(err => console.log(err))
    },

    CITY_COORDS_REQUEST(city: string) {
      axios
        .get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=924bdba454482fce947584b28d955c30`)
        .then(response => {
          this.API_REQUEST({lat: response.data[0].lat, lon: response.data[0].lon}, city);
        })
        .catch(err => console.log(err))
    },

    DELETE_CITY(city: string) {
      const cityObj = this.weatherData.find(item => item.city === city),
        i = cityObj ? this.weatherData.indexOf(cityObj) : null;

      if (i !== null) {
        this.weatherData.splice(i, 1);
        window.localStorage.setItem('weather_data', JSON.stringify(this.weatherData))
      }
    },

    UPDATE_LOCAL_LIST() {
      window.localStorage.setItem('weather_data', JSON.stringify(this.weatherData))
    }
  }
})