import {Text} from 'react-native';

async function getLocationData(location: string) {
  let urlString =
    'https://geocoding-api.open-meteo.com/v1/search?name=' +
    location +
    '&count=10&language=en&format=json';

  let response = await fetch(urlString);
  let results = await response.json();

  let latitude = results[0].lat;
}

export default getLocationData;
