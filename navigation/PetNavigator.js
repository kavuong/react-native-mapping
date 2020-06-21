import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import { createBottomTabNavigator } from "react-navigation-tabs";

import HomeScreen from "../screens/HomeScreen";
import BarcodeScreen from "../screens/BarcodeScreen";
import ResultScreen from "../screens/ResultScreen";
import MapScreen2 from "../screens/MapScreen2";

const ScanNavigator = createStackNavigator({
  Camera: BarcodeScreen,
  Results: ResultScreen,
});

const PetNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Scan: ScanNavigator,
  Map: MapScreen2,
});

export default createAppContainer(PetNavigator);
