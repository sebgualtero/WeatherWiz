import {Text} from 'react-native';

export async function getLocationData(location : string) {
  const urlString = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`;
  
  const response = await fetch(urlString);
  const results = await response.json();
  
  const coordinates = [
    results.results[0].latitude,
    results.results[0].longitude,
    results.results[0].country,
  ];

  // console.log(coordinates);
  return coordinates;
}

 //load current device location coordinates into the app
export async function getWeatherData(latitude : number, longitude : number) {
  const urlString = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,weather_code&daily=weather_code`;
  
  const response = await fetch(urlString);
  const results = await response.json();
  
  const weatherData = [
    results.current.temperature_2m,
    results.current.apparent_temperature,
    results.current.is_day,
    results.current.weather_code,
  ];

  return weatherData;
}