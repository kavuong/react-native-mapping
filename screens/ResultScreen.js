import React from "react";
import { Text, StyleSheet, View } from "react-native";

const Result = (props) => {
  const eanInput = props.navigation.getParam("ean13");
  return (
    <View style={styles.container}>
      <Text>Hello Results</Text>
      <Text>Input EAN is {eanInput}</Text>
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
