import { Alert, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CCard from '../../../../components/CCard'
import { Avatar, Text } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import CButton from '../../../../components/CButton'
import LinearHeader from '../../../../components/LinearHeader'
import { useNavigation } from '@react-navigation/native'
import ButtonList from './ButtonList'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setToken } from '../../../auth/slices/authSlice';
import dimensions from '../../../../theme/Dimensions'
import { Colors } from '../../../../theme/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setuserDetailsSlice } from '../../../auth/slices/userDetailsSlice'
import { setCartItems } from '../cart/slices/cartItemsSlice'


const MenuScreen = () => {
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  const background = require("../../../../../assets/images/fullbackground.png")
  const navigation = useNavigation()

  const handleEdit = () => {
    navigation.navigate('MyProfile');
  }
  const handleLogin = () => {
    // dispatch(setToken({
    //   token: '',
    //   isAuthenticated: true,
    //   isGuest: false
    // }));
    // AsyncStorage.setItem('guestCart', JSON.stringify([])).then(() => {
    navigation.navigate("AuthTabNavigator")
    // }).catch((err) => {
    // console.error('Error setting guestCart in AsyncStorage:', err);
    // })

  }

  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);

  const showAlert = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: handleLogout }
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userDetails');
      dispatch(setuserDetailsSlice(null));
      dispatch(setCartItems([]));
      dispatch(setToken({
        token: '',
        isAuthenticated: false,
        // isGuest: true
      }));

    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const data = [
    { id: 1, title: 'Places You’ve Added', screen: 'AddedPlaces' },
    { id: 2, title: 'Collected Coupons', screen: 'CollectedCoupons' },
    { id: 3, title: 'Live Chat', screen: 'LiveChat' },
    { id: 4, title: 'Account Settings', screen: 'AccountSetting' },
    { id: 5, title: 'Send Feedback', screen: 'Feedback' },
    { id: 6, title: 'About Us', screen: 'AboutUs' },
    { id: 7, title: 'Terms & Conditions', screen: 'TermsandConditions' },
    { id: 8, title: 'Privacy Policy', screen: 'PrivacyPolicy' },
  ];

  const guestList = [
    { id: 1, title: 'About Us', screen: 'AboutUs' },
    { id: 2, title: 'Terms & Conditions', screen: 'TermsandConditions' },
    { id: 3, title: 'Privacy Policy', screen: 'PrivacyPolicy' },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <ImageBackground
        source={background}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <LinearHeader />
        <View style={{ flex: 1, marginHorizontal: 16.5, marginTop: 24 }}>

          {/* Profile Card and Edit-Button */}
          <CCard style={{ marginHorizontal: 0 }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between', marginHorizontal: 20 }}>

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Image
                  size={dimensions.vw * 13}
                  source={userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic}
                  style={{ marginEnd: 18 }} />

                {isGuest ? (<View>
                  <Text style={[textVariants.textMainHeading, { width: dimensions.vw * 40 }]}>Guest User</Text>
                  <Text style={[textVariants.textSubHeading,]}>Login to get all features</Text>
                </View>) : (<View>
                  <Text style={[textVariants.textMainHeading, { width: dimensions.vw * 40 }]}>{userDetails?.name}</Text>
                  <Text style={textVariants.textSubHeading}>{userDetails?.phoneNumber}</Text>
                </View>)}

              </View>

              {!isGuest ? (<TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={handleEdit}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>) : null
              }


            </View>
          </CCard>

          {/* Other Options */}


          <CCard style={{ marginHorizontal: 0 }}>
            {isGuest ? (<View >
              <ButtonList data={guestList} />
              <CButton
                onPress={handleLogin}
                label='LogIn'
                mode='text'
                fontsize={20}
                style={{ alignSelf: 'flex-start', marginStart: 25, marginTop: 15 }} />
            </View>) :
              (<View >
                <ButtonList data={data} />
                <CButton
                  onPress={showAlert}
                  label='LogOut'
                  mode='text'
                  fontsize={20}
                  style={{ alignSelf: 'flex-start', marginStart: 25, marginTop: 15 }} />
              </View>)}
          </CCard>
        </View>
      </ImageBackground>
    </ScrollView>

  )
}

export default MenuScreen
const styles = StyleSheet.create({
  editButton: {
    color: Colors.primary,
    fontSize: dimensions.vw * 3.5,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  }
})

