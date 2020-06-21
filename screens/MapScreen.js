import React, { useState, useEffect } from "react";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import haversine from "haversine";

const LATITUDE = 1.7;
const LONGITUDE = -130;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;
const Map = () => {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [prevLatLng, setPrevLatLng] = useState({});

  const getCurrentPosition = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          setRegion(region);
        },
        (error) => {
          //TODO: better design
          switch (error.code) {
            case 1:
              if (Platform.OS === "ios") {
                Alert.alert("", "iOS location settings not toggled error");
              } else {
                Alert.alert("", "Android location settings not toggled error");
              }
              break;
            default:
              Alert.alert("", "Could not detect location");
          }
        }
      );
    } catch (e) {
      alert(e.message || "");
    }
  };

  useEffect(() => {
    getCurrentPosition();

    // will need to add support for Android
    // https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };
        setLatitude(latitude);
        setLongitude(longitude);
        setRouteCoordinates(routeCoordinates.concat([newCoordinate]));
        setDistanceTravelled(
          distanceTravelled + this.calcDistance(newCoordinate)
        );
        setPrevLatLng(newCoordinate);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );
    navigator.geolocation.clearWatch(watchID);
  });

  calcDistance = (newLatLng) => {
    return haversine(prevLatLng, newLatLng) || 0;
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.bubble, styles.button]}>
          <Text>{parseFloat(distanceTravelled).toFixed(2)} km</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

export default Map;
