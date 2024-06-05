import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { adaptNavigationTheme } from "react-native-paper";
import AppNavigator from "./AppNavigator";
import { StatusBar } from "react-native";
import AuthTabNavigator from "./AuthTabNavigator";
import { useAppSelector } from "../store/hooks";
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });
const Navigation = () => {
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar backgroundColor={'#fdebcf'} barStyle="dark-content" />
      {isAuthenticated ? <AppNavigator /> : <AuthTabNavigator />}
      {/* <AppNavigator /> */}
    </NavigationContainer>
  );
}

export default Navigation;
