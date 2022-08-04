<script setup lang="ts">
  import { useWeatherApiStore } from "@/stores/weatherApi";
  import WeatherCard from "@/components/WeatherCard.vue";
  import SettingsCard from "@/components/SettingsCard.vue";

  const weatherApi = useWeatherApiStore();

  const getFirstCity = ():void => {
    const geo = navigator.geolocation;
    let lat, lon;

    geo.getCurrentPosition(pos => {
      lat = pos.coords.latitude.toString();
      lon =  pos.coords.longitude.toString();

      weatherApi.API_REQUEST({lat, lon}, null)
    })
  }

  // Checking if the client has his own list already
  const currentList = window.localStorage.getItem('weather_data');

  if (currentList) {
    weatherApi.$patch({
      weatherData: JSON.parse(currentList)
    })
  } else {
    // If not, make this request with the client coords
    getFirstCity()
  }
</script>

<template>
  <div class="app-wrapper">
    <WeatherCard
        v-for="weather in weatherApi.weatherData"
        :key="weather.id"
        :weather="weather"
    />
    <SettingsCard
        v-if="weatherApi.settingsOpened"
    />
  </div>
</template>
