import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapView, { Marker } from "react-native-maps";
import haversine from "haversine";

const LATITUDE = 37.7749;
const LONGITUDE = -122.4194;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

export default function App() {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  // variable keeping track of whether we have progressed from the first location or not
  const [before, setBefore] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distTravelled, setDistTravelled] = useState(0);

  const getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 50,
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

  const calcDistance = (prevLatLng, newLatLng) => {
    return haversine(prevLatLng, newLatLng);
  };

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

  // starts tracking async locations whenever before state is changed in onPress
  useEffect(() => {
    getLocationAsync();
  }, [before]);

  useEffect(() => {
    const len = routeCoordinates.length;
    if (len > 1) {
      // updating distance travelled
      const prevLatLng = routeCoordinates[len - 2];
      const currLatLng = routeCoordinates[len - 1];
      const newDist = distTravelled + calcDistance(prevLatLng, currLatLng);
      setDistTravelled(() => newDist);
    }
  }, [routeCoordinates]);

  return errorMsg ? (
    <Text>{errorMsg}</Text>
  ) : (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {before ? null : mapMarkers()}
      </MapView>
      <View style={styles.buttonContainer}>
        {before ? (
          <Button
            title="Start"
            onPress={() => {
              setBefore(false);
            }}
          ></Button>
        ) : null}
        <TouchableOpacity style={[styles.bubble, styles.button]}>
          <Text style={styles.bottomBarContent}>
            {parseFloat(distTravelled).toFixed(2)} km
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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

  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});
