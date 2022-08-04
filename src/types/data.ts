export type WeatherData = {
  id: string,
  temp: number,
  feels_like: number,
  icon: string,
  iconDesc: string,
  humidity: number,
  pressure: number,
  visibility: string,
  description: string,
  wind: string,
  windDegs: number,
  city: string,
  cityCountry: string
}

export type Coords = {
  lat: string;
  lon: string;
}