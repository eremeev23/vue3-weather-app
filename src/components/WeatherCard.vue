<script setup lang="ts">
  import { computed } from "vue";
  import { useWeatherApiStore } from "@/stores/weatherApi";

  const props = defineProps({
    weather: {type: Object, required: true}
  });
  const weatherApi = useWeatherApiStore();

  // Convert wind direction from degrees to compass direction
  const windDirections = computed(():string => {
    let direction = '';
    if (props.weather) {
      switch (true) {
        case props.weather.windDegs > 0 && props.weather.windDegs < 90:
          return direction = 'NNE';
        case props.weather.windDegs > 90 && props.weather.windDegs < 180:
          return direction = 'SSE';
        case props.weather.windDegs > 180 && props.weather.windDegs < 270:
          return direction = 'SSW';
        case props.weather.windDegs > 270 && props.weather.windDegs < 360:
          return direction = 'NNW';
        case props.weather.windDegs === 0:
          return direction = 'N';
        case props.weather.windDegs === 90:
          return direction = 'E';
        case props.weather.windDegs === 180:
          return direction = 'S';
        case props.weather.windDegs === 270:
          return direction = 'W';
      }
    }
    return direction;
  })

  const weatherDescription = computed(():string => {
    return props.weather ? props.weather.description.charAt(0).toUpperCase() + props.weather.description.substr(1) : ''
  })

  const openSetting = ():void => {
    weatherApi.$patch({
      settingsOpened: true
    })
  }

</script>

<template>
  <div class="weather-card card" v-if="!weatherApi.settingsOpened">
    <div class="weather-card__header">
      <p class="weather-card__header-city">
        {{ weather.city }}, {{ weather.cityCountry }}
      </p>

      <button
          class="weather-card__header-settings"
          @click="openSetting"
      >
        <img src="/src/assets/svg/icon-settings.svg" alt="">
      </button>
    </div>
    <div class="weather-card__main">
      <img
          class="weather-card__main_img"
          :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          :alt="weather.iconDesc"
      >
      <span class="weather-card__main_temp">
        {{ weather.temp }}°C
      </span>
    </div>

    <div class="weather-card__info">
      <p class="weather-card__info-feels-like">
        Feels like {{ weather.feels_like }}°C. {{ weatherDescription }}.
      </p>

      <div class="weather-card__info-secondary">
        <div class="weather-card__info-secondary_item wind">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.41382 3.83869C6.41384 3.8387 6.41379 3.83868 6.41382 3.83869L25.8168 11.1148C26.1986 11.2594 26.527 11.5174 26.7579 11.8542C26.9888 12.1909 27.1111 12.5902 27.1084 12.9985C27.1057 13.4068 26.9781 13.8045 26.7427 14.1381C26.5073 14.4717 26.1755 14.7253 25.7918 14.8648L17.7834 17.7758C17.7832 17.7759 17.7835 17.7758 17.7834 17.7758C17.7818 17.7765 17.78 17.7775 17.7788 17.7787C17.7777 17.7799 17.7767 17.7813 17.7761 17.7828C17.7761 17.783 17.7762 17.7827 17.7761 17.7828L14.865 25.7916C14.7255 26.1753 14.4718 26.5072 14.1382 26.7426C13.8046 26.9779 13.4069 27.1056 12.9986 27.1083C12.5903 27.111 12.191 26.9887 11.8543 26.7578C11.5175 26.5269 11.2595 26.1985 11.1149 25.8167L11.1138 25.8136L3.83882 6.41369C3.83881 6.41367 3.83883 6.41372 3.83882 6.41369C3.70397 6.05414 3.67545 5.66329 3.75673 5.28797C3.83802 4.91264 4.02565 4.56864 4.2972 4.29708C4.56876 4.02552 4.91276 3.83789 5.2881 3.75661C5.66341 3.67533 6.05426 3.70384 6.41382 3.83869ZM5.71145 5.71137L12.9853 25.1084L15.8978 17.0959L15.8993 17.0918C16 16.8185 16.1587 16.5704 16.3646 16.3645C16.5705 16.1586 16.8186 15.9998 17.0919 15.8992L17.096 15.8976L25.1085 12.9852L5.71145 5.71137Z" stroke="black" fill="black"/>
          </svg>

          <span>
            {{ weather.wind }} {{ windDirections }}
          </span>
        </div>

        <div class="weather-card__info-secondary_item pressure">
          <span>
            {{ weather.pressure }} hPa
          </span>
        </div>
        <div class="weather-card__info-secondary_item pressure">
          <span>
            Humidity: {{ weather.humidity }}%
          </span>
        </div>

        <div class="weather-card__info-secondary_item pressure">
          <span>
            Dew point: 0°C
          </span>
        </div>

        <div class="weather-card__info-secondary_item pressure">
          <span>
            Visibility: {{ weather.visibility }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
