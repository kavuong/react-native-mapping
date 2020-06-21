import React, { useState, useEffect } from "react";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { StyleSheet } from "react-native";

const LATITUDE = 37.7;
const LONGITUDE = -130;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;
const Map = () => {
  const mapRegion = {
    latitude: 37.7,
    longitude: -130,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] = useState(LONGITUDE);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [prevLatLng, setPrevLatLng] = useState({});
  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
    })
  );

  useEffect(() => {
    getCurrentPosition();
  });

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

  //   useEffect(() => {
  //     const watchID = navigator.geolocation.watchPosition(
  //       (position) => {
  //         // const { coordinate, routeCoordinates, distanceTravelled } = this.state;
  //         const { latitude, longitude } = position.coords;

  //         const newCoordinate = {
  //           latitude,
  //           longitude,
  //         };
  //         if (Platform.OS === "android") {
  //           if (this.marker) {
  //             this.marker._component.animateMarkerToCoordinate(
  //               newCoordinate,
  //               500
  //             );
  //           }
  //         } else {
  //           coordinate.timing(newCoordinate).start();
  //         }

  //         setLatitude(latitude)
  //         setLongitude(longitude)
  //         setRouteCoordinates(routeCoordinates.concat([newCoordinate]))
  //         setDistanceTravelled(distanceTravelled + this.calcDistance(newCoordinate))
  //         setPrevLatLng(newCoordinate)

  //       },
  //       (error) => console.log(error),
  //       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //     );
  //   });
  return <MapView style={styles.map} region={region} />;
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Map;
