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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getLocationData, getWeatherData } from './src/components/location_check';
import { weatherCodes, weatherGroups } from './src/components/Weather_codes';
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
  const [weatherCondition, setWeatherCondition] = useState('');
  const [weatherGroup, setWeatherGroup] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [funFact, setFunFact] = useState('');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  

  const toggleDarkMode = () => {
    setDarkModeEnabled(previousState => !previousState);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(previousState => !previousState);
  };

  const convertToFahrenheit = (celsius: number): number => {
    return (celsius * 9 / 5) + 32;
  };

  const getDeviceLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log(location);
        setCity('Your Location');
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        fetchWeatherData(location.latitude, location.longitude);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };

  useEffect(() => {
    getDeviceLocation();
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    const weather = await getWeatherData(lat, lon);
    const weatherDescription = weatherCodes[weather[3]] || 'Unknown';
    const weatherGroup = weatherGroups[weatherDescription] || 'Unknown';
    console.log('Weather Code:', weather[3]);
    console.log('Weather Description:', weatherDescription);
    console.log('Weather Group:', weatherGroup);

    setTemperature(weather[0]);
    setWeatherCondition(weatherDescription);
    setWeatherGroup(weatherGroup);
  };

  const handlePress = async () => {
    try {
      const locationData = await getLocationData(inputCity);
      if (locationData.length === 0) {
        Alert.alert('Error', 'Unknown location. Please enter a valid city name.');
        return;
      }
      setLatitude(locationData[0]);
      setLongitude(locationData[1]);
      setCountry(locationData[2]);
      setCity(inputCity);
      await fetchWeatherData(locationData[0], locationData[1]);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location data. Please try again.');
      console.error('Error fetching location data:', error);
    }
  };

  const handleInputCityChange = (event: any) => {
    setInputCity(event.nativeEvent.text);
  };

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

  const getFunFactBasedOnTemperature = (temperature: number) => {
    for (let fact of funFacts) {
      if (fact.temperature === Math.round(temperature)) {
        return fact.fun_fact;
      }
    }
    return 'No fun fact available for this temperature.';
  };

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0) {
      const fetchWeatherData = async () => {
        const weather = await getWeatherData(latitude, longitude);
        const weatherDescription = weatherCodes[weather[3]] || 'Unknown';
        const weatherGroup = weatherGroups[weatherDescription] || 'Unknown';
        console.log('Weather Code:', weather[3]);
        console.log('Weather Description:', weatherDescription);
        console.log('Weather Group:', weatherGroup);

        setTemperature(weather[0]);
        setWeatherCondition(weatherDescription);
        setWeatherGroup(weatherGroup);
        const currentFunFact = getFunFactBasedOnTemperature(weather[0]);
        setFunFact(currentFunFact);
      };

      fetchWeatherData();
    }
  }, [latitude, longitude]);

  const getWeatherImage = () => {
    switch (weatherGroup) {
      case 'Clear':
        return require('./src/assets/clear.png');
      case 'Cloudy':
        return require('./src/assets/cloudy.png');
      case 'Rain':
        return require('./src/assets/rain.png');
      case 'Snow':
        return require('./src/assets/snow.png');
      default:
        return null;
    }
  };

  const displayTemperature = isCelsius ? temperature : convertToFahrenheit(temperature);

  return (
    <View style={[styles.container, dynamicStyles]}>
      <TouchableOpacity style={styles.darkModeButton} onPress={toggleDarkMode}>
        <Text style={styles.darkModeButtonText}>{darkModeEnabled ? 'Light Mode' : 'Dark Mode'}</Text>
      </TouchableOpacity>
      <Text style={styles.cityName}>{city}</Text>
      <Text style={styles.temperature}>{displayTemperature.toFixed(1)}{isCelsius ? ' C°' : ' F°'}</Text>
      <Text style={styles.weatherDescription}>{weatherCondition}</Text>
      <View style={styles.weatherIconContainer}>
        {getWeatherImage() && (
          <Image source={getWeatherImage()} style={styles.weatherIcon} />
        )}
        <TouchableOpacity style={styles.unitButton} onPress={toggleTemperatureUnit}>
          <Text style={styles.unitButtonText}>{isCelsius ? 'F°' : 'C°'}</Text>
        </TouchableOpacity>
      </View>
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
  darkModeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
  },
  darkModeButtonText: {
    fontSize: 16,
    color: '#000000',
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
  weatherIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  unitButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  unitButtonText: {
    fontSize: 20,
    color: '#000000',
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
  lightMode: {
    backgroundColor: '#87CEEB',
  },
  darkMode: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
});

export default App;
