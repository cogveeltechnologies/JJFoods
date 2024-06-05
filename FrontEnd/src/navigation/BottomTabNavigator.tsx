import { StyleSheet, Image } from 'react-native'
import React from 'react'
import WishList from '../domains/app/screens/wishList/WishList'
import HomeScreen from '../domains/app/screens/home/HomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from '../theme/Colors'
import Locationscreen from '../domains/app/screens/map/LocationScreen'
import OrdersNavigator from './OrdersNavigator'
import MyCart from '../domains/app/screens/cart/MyCart'
import { useAppSelector } from '../store/hooks'


const BottomTabNavigator = () => {
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  const BottomTabs = createBottomTabNavigator()
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        headerTransparent: true,
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconImage;
          switch (route.name) {
            case 'Home':
              iconImage = require('../../assets/images/deliveryIcon.png');
              break;
            case 'MyCart':
              iconImage = require('../../assets/images/cartIcon2.png');
              break;
            case 'WishList':
              iconImage = require('../../assets/images/wishListIcon.png');
              break;
            case 'OrdersNavigator':
              iconImage = require('../../assets/images/DeliveredIcon.png');
              break;
            case 'LocationScreen':
              iconImage = require('../../assets/images/addProductIcon.png');
              break;
          }

          return <Image source={iconImage} style={{ width: size, height: size, tintColor: focused ? Colors.primary : Colors.gray }} />;
        },

      })}
    >
      <BottomTabs.Screen
        name='Home'
        component={HomeScreen}
      // options={{ headerShown: false, }}
      />
      <BottomTabs.Screen
        name='MyCart'
        component={MyCart}
      />
      {/* {!isGuest && <BottomTabs.Screen
        name='LocationScreen'
        component={Locationscreen}
      // options={{ headerShown: false, }}
      />} */}
      <BottomTabs.Screen
        name='WishList'
        component={WishList}
      />
      {!isGuest &&
        <BottomTabs.Screen
          name='OrdersNavigator'
          component={OrdersNavigator}
        />}

    </BottomTabs.Navigator>
  )
}

export default BottomTabNavigator

const styles = StyleSheet.create({})
