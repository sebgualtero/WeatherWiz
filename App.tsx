'use client';

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import getLocationData from './src/components/location_check';
import getWeatherData from './src/components/location_check';
import GetLocation from 'react-native-get-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CitiesScreen from './Cities';

function ListItemRender({dataItem}: any) {
  return <Text>{dataItem.text}</Text>;
}

function App(): React.JSX.Element {
  async function getLocationData(location: string) {
    let urlString =
      'https://geocoding-api.open-meteo.com/v1/search?name=' +
      location +
      '&count=10&language=en&format=json';

    let response = await fetch(urlString);
    let results = await response.json();

    let coordinates = [
      results.results[0].latitude,
      results.results[0].longitude,
      results.results[0].country,
    ];

    // console.log(coordinates);
    return coordinates;
  }

  //load current device location coordinates into the app

  async function getWeatherData(latitude: number, longitude: number) {
    let urlString =
      'https://api.open-meteo.com/v1/forecast?latitude=' +
      latitude +
      '&longitude=' +
      longitude +
      '&current=temperature_2m,apparent_temperature,is_day,weather_code&daily=weather_code';

    let response = await fetch(urlString);
    let results = await response.json();

    let weatherData = [
      results.current.temperature_2m,
      results.current.apparent_temperature,
      results.current.is_day,
      results.current.weather_code,
    ];

    return weatherData;
  }

 
  const getDeviceLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
     timeout: 60000,
   })
      .then(location => {

        setLatitude(location.latitude);
        setLongitude(location.longitude);
        
        let weather =  getWeatherData(latitude, longitude);

        

       console.log(location);
      })
     .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
       });



   };

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [inputCity, setInputCity] = useState('');

 
  useEffect(() => {

    getDeviceLocation();
    (async () => {
     
  
        let weather = await getWeatherData(latitude, longitude);
        setTemperature(weather[0]);
        weather = [];
        console.log(`City: ${city}`);
        console.log(`latitude: ${latitude} longitude: ${longitude}`);
      
    })();
  }, [city]);
  const handlePress = () => {
    setCity(inputCity);
  };

  const handleInputCityChange = (event: any) => {
    setInputCity(event.nativeEvent.text);
  };

  let darkModeEnabled = true;

  let dinamicStyles = darkModeEnabled ? styles.darkMode : styles.lightMode;

  useEffect(() => {
    (async () => {
      if (city !== '') {
        let locationData = await getLocationData(city);
        setLatitude(locationData[0]);
        setLongitude(locationData[1]);
        setCountry(locationData[2]);
      }
    })();
  }, [city]);

  useEffect(() => {
    (async () => {
      if (latitude !== 0 && longitude !== 0) {
        let weather = await getWeatherData(latitude, longitude);
        setTemperature(weather[0]);
        weather = [];
        console.log(`City: ${city}`);
        console.log(`latitude: ${latitude} longitude: ${longitude}`);
      }
    })();
  }, [latitude, longitude]);
  const Stack = createNativeStackNavigator();
  
  return (
    <View style={{...dinamicStyles, ...styles.container}}>
      <Text style={styles.myCustomText}>Check the weather!</Text>

      <Image
        style={styles.myCustomImage}
        source={require('./src/assets/clear.png')}
      />
      <Text style={styles.myLabelTest}>Enter city:</Text>
      <TextInput
        style={styles.inputBox}
        onChange={handleInputCityChange} // Update inputCity state
        value={inputCity}
      />
      <Text style={styles.myFecthData}>Country: {country}</Text>
      <Text style={styles.myFecthData}>Latitude: {latitude}</Text>
      <Text style={styles.myFecthData}>Longitude: {longitude}</Text>
      <Text style={styles.inputBox}>Temperature: {temperature}</Text>
      <Button title="Press me" onPress={handlePress} />

      
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myCustomText: {
    fontSize: 30,
    color: '#55AA55',
    // textAlign: 'center',
  },
  darkMode: {
    backgroundColor: '#333333',
  },
  lightMode: {
    backgroundColor: '#DDDDDD',
  },
  myCustomImage: {
    width: 200,
    height: 200,
    alignItems: 'center',
    margin: 10,
  },
  inputBox: {
    borderBlockColor: 'red',
    backgroundColor: 'gray',
    fontSize: 24,
    width: 300,
    padding: 3,
    margin: 12,
  },
  myLabelTest: {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    width: 300,
    alignContent: 'center',
  },
  myFecthData: {
    color: '#FFFFFF',
    backgroundColor: '#000000',
    width: 250,
    alignContent: 'center',
  },
});

export default App;
