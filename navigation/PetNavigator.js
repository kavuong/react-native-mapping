import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import HomeScreen from "../screens/HomeScreen";
import BarcodeScreen from "../screens/BarcodeScreen";

const PetNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Scan: BarcodeScreen,
});

export default createAppContainer(PetNavigator);
