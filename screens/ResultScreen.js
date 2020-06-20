import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, Linking } from "react-native";
const axios = require("axios").default;
const UPC_API_URL = "http://192.168.0.20:5000";

const Result = (props) => {
  const [upc, setUpc] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const eanInput = props.navigation.getParam("ean13");
    const url = UPC_API_URL.concat("/upc/".concat(eanInput));
    axios
      .get(url)
      .then((res) => res.data)
      .then((data) => {
        setUpc(data.upc);
        setTitle(data.title);
        setDescription(data.description);
        setImageUrl(data.image);
        setUrl(data.link);
      })
      .catch((e) => {
        console.log(e);
        return e;
      });
  }, []);

  const image = imageUrl ? (
    <Image
      style={styles.tinyLogo}
      source={{
        uri: imageUrl,
      }}
    ></Image>
  ) : null;
  const link = url ? (
    <Text style={{ color: "blue" }} onPress={() => Linking.openURL(url)}>
      Link
    </Text>
  ) : null;

  return (
    <View style={styles.container}>
      <Text>Product: {title}</Text>
      <Text>Description: {description}</Text>
      <Text>UPC: {upc}</Text>
      {image}
      {link}
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
  tinyLogo: {
    width: 250,
    height: 250,
  },
});

export default Result;
