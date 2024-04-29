/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from '@react-native-community/geolocation';
import { getPositionbtCity, getWeather } from './Global';
import Loader from './screens/Loader';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setisLoading] = useState(false)
  const [city, setcity] = useState(false)
  const [currentData, setcurrentData] = useState([])
  const [forcastHour, setforcastHour] = useState([])
  const [forcastData, setforcastData] = useState([])
  const [forcastHistory, setforcastHistory] = useState([])
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setisLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      const forecast = await getWeather(latitude.toString(), longitude.toString(), "forecast");
      setcity(forecast.location?.name)
      setcurrentData(forecast);
      setforcastHour(forecast.forecast.forecastday[0].hour);
      setforcastData(forecast.forecast.forecastday);

      const History = await getWeather(latitude.toString(), longitude.toString(), "history");
      setforcastHistory(History.forecast.forecastday)

      setisLoading(false);
    } catch (error) {
      console.log("Error", error);
      setisLoading(false);
    }
  };


  const getWeatherbyCity = async (cityname) => {
    setisLoading(true)
    try {
      const Data = await getPositionbtCity(cityname);

      const forecast = await getWeather(Data[0].lat.toString(), Data[0].lon.toString(), "forecast");
      setcity(forecast.location?.name)
      setcurrentData(forecast);
      setforcastHour(forecast.forecast.forecastday[0].hour);
      setforcastData(forecast.forecast.forecastday);

      const History = await getWeather(Data[0].lat.toString(), Data[0].lon.toString(), "history");
      setforcastHistory(History.forecast.forecastday)

      setisLoading(false);

    } catch (error) {
      console.error("Error occurred:", error);
      setisLoading(false);
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            padding: 20,
            justifyContent: 'center'
          }}>
          <Loader visible={isLoading} />
          <TextInput
            value={city}
            placeholder='Enter City'
            style={{ borderColor: "#000", borderWidth: 1, marginVertical: 10 }}
            onChangeText={(text) => setcity(text)}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ minWidth: "49%", backgroundColor: "#d6d6d6" }} onPress={() => getCurrentLocation()}><Text style={{ textAlign: 'center', padding: 5, color: "#000" }}>Current Location</Text></TouchableOpacity>
            <TouchableOpacity style={{ minWidth: "49%", backgroundColor: "#d6d6d6" }} onPress={() => getWeatherbyCity(city)}><Text style={{ textAlign: 'center', padding: 5, color: "#000" }}>Change City</Text></TouchableOpacity>
          </View>
          <View>
            <Text style={{ textAlign: 'center', fontSize: 18, color: "#000" }}>My Location</Text>
            <Text style={{ textAlign: 'center', fontSize: 15, color: "#000" }}>{currentData?.location?.name} , {currentData?.location?.country}</Text>
            <Text style={{ textAlign: 'center', fontSize: 55, color: "#000" }}>{currentData?.current?.temp_c}°C</Text>
            <Text style={{ textAlign: 'center', fontSize: 15, color: "#000" }}>{currentData?.current?.condition.text}</Text>
            <Text style={{ textAlign: 'center', fontSize: 15, color: "#000" }}>Humidity : {currentData?.current?.humidity}</Text>
          </View>
          <View style={{ backgroundColor: "#d6d6d6", marginVertical: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 15, color: "#000" }}>Sunny Condition will continue all day</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 5, width: "90%", alignSelf: 'center' }} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={forcastHour}
              horizontal={true}
              keyExtractor={(item) => {
                return item.time
              }}
              renderItem={(renderItem) => {
                const item = renderItem.item
                const index = renderItem.index

                const hour = new Date(item.time).getHours()

                return (
                  <View style={{ padding: 10, alignItems: 'center' }}>
                    <Text style={{ color: "#000" }}>{hour}</Text>
                    <Image source={{ uri: "https://" + item.condition.icon.split("//")[1] }} style={{ width: "100%", height: 30 }} />
                    <Text style={{ color: "#000" }}>{item.temp_c}</Text>
                  </View>
                )
              }}
            />
          </View>
          <View style={{ backgroundColor: "#d6d6d6", marginVertical: 10 }}>
            <Text style={{ textAlign: 'center', fontSize: 15, color: "#000" }}>14-Days Forcast</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 5, width: "90%", alignSelf: 'center' }} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={forcastData}
              keyExtractor={(item) => {
                return item.date
              }}
              renderItem={(renderItem) => {
                const item = renderItem.item
                const index = renderItem.index

                return (
                  <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: "#000" }}>{item.date}</Text>
                    <Image source={{ uri: "https://" + item.day.condition.icon.split("//")[1] }} style={{ width: 15, height: 30 }} />
                    <Text style={{ color: "#000", width: "25%" }} numberOfLines={1}>{item.day.condition.text}</Text>
                    <Text style={{ color: "#000" }} numberOfLines={1}>{item.day.mintemp_c} - {item.day.maxtemp_c}</Text>
                  </View>
                )
              }}
            />
          </View>
          <View style={{ backgroundColor: "#d6d6d6", marginVertical: 10 }}>
            <Text style={{ textAlign: 'center', fontSize: 15, color: "#000" }}>Forcast History for Last Few Days</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 5, width: "90%", alignSelf: 'center' }} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={forcastHistory}
              keyExtractor={(item) => {
                return item.date
              }}
              renderItem={(renderItem) => {
                const item = renderItem.item
                const index = renderItem.index
                return (
                  <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: "#000" }}>{item.date}</Text>
                    <Image source={{ uri: "https://" + item.day.condition.icon.split("//")[1] }} style={{ width: 15, height: 30 }} />
                    <Text style={{ color: "#000", width: "25%" }} numberOfLines={1}>{item.day.condition.text}</Text>
                    <Text style={{ color: "#000" }} numberOfLines={1}>{item.day.mintemp_c} - {item.day.maxtemp_c}</Text>
                  </View>
                )
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
