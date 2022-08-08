<script setup lang="ts">
  import Draggable from "vuedraggable";
  import { useWeatherApiStore } from "@/stores/weatherApi";
  import { ref } from "vue";
  import type { WeatherData } from "@/types/data.js";
  // ref variables
  const input = ref(''),
      error = ref(false),
      enabled = ref(true),
      dragging = ref(false),
      list = ref([] as WeatherData[]);
  // Data from the store
  const weatherApi = useWeatherApiStore();
  list.value = [...weatherApi.weatherData];

  // Methods
  const endDrag = () => {
    dragging.value = false;

    weatherApi.$patch({
      weatherData: list.value
    })

    window.localStorage.setItem('weather_data', JSON.stringify(weatherApi.weatherData))
  }

  const closeSettings = ():void => {
    weatherApi.$patch({
      settingsOpened: false
    })

    window.localStorage.setItem('weather_data', JSON.stringify(weatherApi.weatherData))
  }

  const deleteCity = (city:string):void => {
    weatherApi.DELETE_CITY(city);
    list.value = [...weatherApi.weatherData];
  }

  const addCity = () => {
    if (!input.value.trim().length) {
      error.value = true;
    } else {
      error.value = false;
      weatherApi.CITY_COORDS_REQUEST(input.value);
      input.value = '';
      setTimeout(() => list.value = [...weatherApi.weatherData], 800)
    }
  }
</script>

<template>
  <div class="setting-card card">
    <div class="setting-card__header">
      <span>
        Setting
      </span>
      <button v-if="weatherApi.weatherData.length" @click="closeSettings">
        <img src="/src/assets/svg/icon-close.svg" alt="">
      </button>
    </div>

    <draggable
        :list="list"
        :disabled="!enabled"
        item-key="name"
        class="setting-card__cities"
        ghost-class="ghost"
        @start="dragging = true"
        @end="endDrag"
    >
      <template #item="{ element }">
        <div class="setting-card__cities-item" :class="{ 'not-draggable': !enabled }">
          <div>
            <button class="drag-button">
              <span></span>
            </button>

            {{ element.city }}
          </div>

          <button
              @click="deleteCity(element.city)"
              class="setting-card__cities-item_delete"
          >
            <img src="/src/assets/svg/icon-trash.svg" alt="">
          </button>
        </div>
      </template>
    </draggable>

    <div class="setting-card__add-new">
      <p class="setting-card__add-new_title">
        Add location:
      </p>

      <form
          class="setting-card__add-new_form add-city-form"
          @submit.prevent="addCity"
          novalidate
      >
        <input
            :class="error ? 'add-city-form__input error' : 'add-city-form__input'"
            @focus="error = false"
            @input="error = false"
            type="text"
            v-model="input"
            placeholder="City"
        >

        <span v-if="error" class="add-city-form__error">
          Type city
        </span>

        <button
            type="submit"
            class="add-city-form__submit"
        >
          <img src="/src/assets/svg/icon-add.svg" alt="">
        </button>
      </form>
    </div>
  </div>
</template>