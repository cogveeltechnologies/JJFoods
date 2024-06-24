
import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BottomTabNavigator from './BottomTabNavigator'
import OrderDescription from '../domains/app/screens/orderDescription/OrderDescription'
import { IconButton } from 'react-native-paper'
import { Colors } from '../theme/Colors'
import MenuScreen from '../domains/app/screens/menu/MenuScreen'
import OrdersNavigator from './OrdersNavigator'
import dimensions from '../theme/Dimensions'
import Locationscreen from '../domains/app/screens/map/LocationScreen'
import AddedPlaces from '../domains/app/screens/addedPlaces/AddedPlaces'
import Feedback from '../domains/app/screens/feedback/Feedback'
import AccountSetting from '../domains/app/screens/accountSetting/AccountSetting'
import CollectedCoupons from '../domains/app/screens/collectedCoupons/CollectedCoupons'
import ManualLocationScreen from '../domains/app/screens/manualLocation/ManualLocationScreen'
import AddressDetails from '../domains/app/screens/addressDetails/AddressDetails'
import MyProfile from '../domains/app/screens/profile/MyProfile'
import OtpScreen from '../domains/auth/screens/otpScreen/OtpScreen'
import AuthTabNavigator from './AuthTabNavigator'
import SignUpScreen from '../domains/auth/screens/singUpScreen/SignUpScreen'
import UpdateAddress from '../domains/app/screens/addressDetails/UpdateAddress'
import FullOrderDetails from '../domains/app/screens/myOrders/FullOrderDetails'

const AppNavigator = () => {

  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
        // headerStyle: { backgroundColor: '' },
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name='HomeNavigator'
        component={BottomTabNavigator}
        options={{ headerShown: false, }} />

      <Stack.Screen
        name='MyProfile'
        component={MyProfile} />

      <Stack.Screen
        name='OrderDescription'
        component={OrderDescription}
        options={{ headerTitle: '' }}
      // options={{
      //   headerTitle: '',
      //   headerRight: () => (
      //     <IconButton
      //       icon={isPressed ? require('../../assets/images/heart.png') : require('../../assets/images/wishlistIcon2.png')}
      //       iconColor={isPressed ? 'red' : Colors.gray}
      //       size={dimensions.vw * 5}
      //       onPress={handlePress}
      //     />
      //   ),
      // }}
      />

      <Stack.Screen
        name='MenuScreen'
        component={MenuScreen}
        options={{ headerTitle: '' }}
      />

      <Stack.Screen
        name='MyOrders'
        component={OrdersNavigator}
      />
      <Stack.Screen
        name='Locationscreen'
        component={Locationscreen}
      />
      <Stack.Screen
        name='AddedPlaces'
        component={AddedPlaces}
        options={{ headerTitle: 'Added Places ' }}
      />
      <Stack.Screen
        name='Feedback'
        component={Feedback}
      />
      <Stack.Screen
        name='AccountSetting'
        component={AccountSetting}
        options={{ headerTitle: 'Account Setting' }}
      />
      <Stack.Screen
        name='CollectedCoupons'
        component={CollectedCoupons}
        options={{ headerTitle: 'Collected Coupons' }}
      />
      <Stack.Screen
        name='ManualLocationScreen'
        component={ManualLocationScreen}
        options={{ headerTitle: 'Location' }}
      />

      <Stack.Screen
        name='AddressDetails'
        component={AddressDetails}
        options={{ headerTitle: 'Address Details' }}
      />

      <Stack.Screen
        name='UpdateAddress'
        component={UpdateAddress}
        options={{ headerTitle: 'Update Address' }}
      />
      <Stack.Screen
        name='FullOrderDetails'
        component={FullOrderDetails}
        options={{ headerTitle: '' }}
      />

      {/* <Stack.Screen
        name='AuthTabNavigator'
        component={AuthTabNavigator}
        options={{ headerTitle: '' }}
      /> */}

      {/* <Stack.Screen
        name='SignUpScreen'
        component={SignUpScreen}
      // options={{ headerTitle: 'Address Details' }}
      /> */}
      {/* <Stack.Screen
        name='OtpScreen'
        component={OtpScreen}
      // options={{ headerTitle: 'Address Details' }}
      /> */}

    </Stack.Navigator>

  )

}

export default AppNavigator