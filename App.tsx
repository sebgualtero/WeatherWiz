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
import { getLocationData, getWeatherData } from './src/components/location_check';
import GetLocation from 'react-native-get-location';
import funFacts from './src/res/facts.json';

function ListItemRender({dataItem}: any) {
  return <Text>{dataItem.text}</Text>;
}

  //function can be used to get the device location
  // const getDeviceLocation = () => {
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 60000,
  //   })
  //     .then(location => {
  //       console.log(location);
  //     })
  //     .catch(error => {
  //       const {code, message} = error;
  //       console.warn(code, message);
  //     });
  // };

  function App(): React.JSX.Element {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [inputCity, setInputCity] = useState('');
  const [funFact, setFunFact] = useState('');

  //getDeviceLocation(); breaks as it will keep calling the function - unkonwn cause

  const handlePress = () => {
    setCity(inputCity);
  };

  const handleInputCityChange = (event: any) => {
    setInputCity(event.nativeEvent.text);
  };

  let darkModeEnabled = true;

  let dynamicStyles = darkModeEnabled ? styles.darkMode : styles.lightMode;

  useEffect(() => {
    const fetchLocationData = async () => {
      if (city !== '') {
        const locationData = await getLocationData(city);
        setLatitude(locationData[0]);
        setLongitude(locationData[1]);
        setCountry(locationData[2]);
      }
    };

    fetchLocationData();
  }, [city]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (latitude !== 0 && longitude !== 0) {
        const weather = await getWeatherData(latitude, longitude);
        setTemperature(weather[0]);
        console.log(`City: ${city}`);
        console.log(`latitude: ${latitude} longitude: ${longitude}`);

        // Get the fun fact based on the current temperature
        const currentFunFact = getFunFactBasedOnTemperature(weather[0]);
        setFunFact(currentFunFact);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  const getFunFactBasedOnTemperature = (temperature: number) => {
    for (let fact of funFacts) {
      if (fact.temperature === Math.round(temperature)) {
        return fact.fun_fact;
      }
    }
    return 'No fun fact available for this temperature.';
  };

  return (
    <View style={{...dynamicStyles, ...styles.container}}>
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
      <Text style={styles.myFecthData}>Fun Fact: {funFact}</Text>
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
