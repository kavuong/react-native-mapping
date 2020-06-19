import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
const axios = require("axios").default;

const Result = (props) => {
  const [currentTime, setCurrentTime] = useState(1);
  useEffect(() => {
    axios
      .get("/time")
      .then((res) => res.data)
      .then((data) => setCurrentTime(data.time));
  }, []);

  const eanInput = props.navigation.getParam("ean13");

  return (
    <View style={styles.container}>
      <Text>Hello Results</Text>
      <Text>Input EAN is {eanInput}</Text>
      <Text>Time is {currentTime}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Result;
