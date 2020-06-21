import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapView, { Marker } from "react-native-maps";

const LATITUDE = 37.7749;
const LONGITUDE = -122.4194;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

const LOCATION_SETTINGS = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 5000,
  distanceInterval: 20000,
};

export default function App() {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  //   const getCurrentPosition = () => {
  //     try {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const region = {
  //             latitude: position.oords.latitude,
  //             longitude: position.coords.longitude,
  //             latitudeDelta: LATITUDE_DELTA,
  //             longitudeDelta: LONGITUDE_DELTA,
  //           };
  //           setRegion(region);
  //         },
  //         (error) => {
  //           //TODO: better design
  //           switch (error.code) {
  //             case 1:
  //               if (Platform.OS === "ios") {
  //                 Alert.alert("", "iOS location settings not toggled error");
  //               } else {
  //                 Alert.alert("", "Android location settings not toggled error");
  //               }
  //               break;
  //             default:
  //               Alert.alert("", "Could not detect location");
  //           }
  //         }
  //       );
  //     } catch (e) {
  //       alert(e.message || "");
  //     }
  //   };

  //   getCurrentPosition();

  // TO DO: set location in initial state before proceeding

  const getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 200,
          timeInterval: 1000,
        },
        (newLocation) => {
          let coords = newLocation.coords;
          // this.props.getMyLocation sets my reducer state my_location
          const newRegion = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          setRegion(() => newRegion);
          let newLoc = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          setRouteCoordinates((oldCoordinates) => [...oldCoordinates, newLoc]);
        },
        (error) => console.log(error)
      );
    } else {
      setErrorMsg("Location services needed");
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  const mapMarkers = () => {
    return routeCoordinates.map((loc, index) => {
      return (
        <Marker
          key={index}
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
        ></Marker>
      );
    });
  };

  return errorMsg ? (
    <Text>{errorMsg}</Text>
  ) : (
    <MapView style={styles.map} region={region}>
      {mapMarkers()}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
