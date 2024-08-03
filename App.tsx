'use client';

import React, { useEffect, useState } from 'react';
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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getLocationData, getWeatherData } from './src/components/location_check';
import GetLocation from 'react-native-get-location';
import funFacts from './src/res/facts.json';

function ListItemRender({ dataItem }: any) {
  return <Text>{dataItem.text}</Text>;
}




function App(): React.JSX.Element {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [inputCity, setInputCity] = useState('');
  const [funFact, setFunFact] = useState('');

  //getDeviceLocation(); breaks as it will keep calling the function - unkonwn cause

  

  const getDeviceLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log(location);
        setLatitude(location.latitude);
        setLongitude(location.longitude);

        let weather = getWeatherData(latitude, longitude);

      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };

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
    <View style={{ ...dynamicStyles, ...styles.container }}>
      <Text style={styles.cityName}>{city}</Text>
      <Text style={styles.temperature}>{temperature}°</Text>
      <Text style={styles.weatherDescription}>Sunny</Text>
      <Image
        style={styles.weatherIcon}
        source={require('./src/assets/clear.png')}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          onChange={handleInputCityChange}
          value={inputCity}
          placeholder="Enter city"
        />
        <Button title="Search" onPress={handlePress} />
      </View>
      <View style={styles.weatherDetailsContainer}>
        <Text style={styles.weatherDetails}>Country: {country}</Text>
        <Text style={styles.weatherDetails}>Latitude: {latitude}</Text>
        <Text style={styles.weatherDetails}>Longitude: {longitude}</Text>
      </View>
      <View style={styles.funFactContainer}>
        <Text style={styles.funFactTitle}>Fun Fact</Text>
        <Text style={styles.funFact}>{funFact}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#87CEEB',
    padding: 20,
  },
  cityName: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 50,
  },
  temperature: {
    fontSize: 80,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBox: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    width: 200,
    padding: 10,
    marginRight: 10,
  },
  weatherDetailsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  weatherDetails: {
    fontSize: 18,
    color: '#333333',
  },
  funFactContainer: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  funFactTitle: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  funFact: {
    fontSize: 18,
    color: '#333333',
  },
});

export default App;
