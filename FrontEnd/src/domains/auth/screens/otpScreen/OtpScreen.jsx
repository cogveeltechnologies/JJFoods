import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CButton from '../../../../components/CButton';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '../../../../theme/Colors';
import { Text } from 'react-native-paper';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setToken } from '../../slices/authSlice';
import { useSignUpMutation } from '../../api/authSignUp';
import { setuserDetailsSlice } from '../../slices/userDetailsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignInMutation } from '../../api/authSignIn';




const OtpScreen = () => {
  const [otp, setOtp] = useState('')
  const [tempUser, setTempUser] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const navigation = useNavigation()
  const route = useRoute();
  const { source } = route.params || {};
  const dispatch = useAppDispatch();
  const [signUpMutation, { isLoading, isSuccess, isError, error }] = useSignUpMutation();
  const [signInMutation,] = useSignInMutation();
  // const [guestCartItems, setGuestCartItems] = useEffect([])


  const GoBack = () => {
    navigation.navigate(source === "SignUp" ? "SignUp" : "SignIn");
  };

  const handleOtpChange = (text) => {
    setOtp(text);
    console.log(otp)
  };

  // useEffect(() => {
  //   const fetchGuestCart = async () => {
  //     try {
  //       const guestCart = await AsyncStorage.getItem('guestCart');
  //       const parsedGuestCart = JSON.parse(guestCart);
  //       setGuestCartItems(parsedGuestCart)
  //     } catch (err) {
  //       console.error('Error fetching guest cart:', err);
  //       Alert.alert('Error', 'Failed to fetch guest cart.');
  //     }
  //   };
  //   fetchGuestCart();
  // }, []);

  // useEffect(() => {
  //   console.log(guestCartItems)
  // }, [guestCartItems])


  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await AsyncStorage.getItem('userDetails');
      const parsedUser = JSON.parse(user);
      // console.log(parsedUser,)
      setTempUser(parsedUser);
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchUserPhoneNumber = async () => {
      const phoneNumber = await AsyncStorage?.getItem('userPhoneNumber');
      const parsedUser = JSON.parse(phoneNumber);
      setPhoneNumber(parsedUser);
    };
    fetchUserPhoneNumber();
  }, [])

  const handleVerify = async () => {
    if (source === 'SignUp') {
      await handleSignUpVerify();
    } else {
      await handleSignInVerify();
    }
  };


  const handleSignUpVerify = async () => {
    try {
      console.log('SignupCalled ')
      // console.log(tempUser)
      const updatedUserDetails = {
        phoneNumber: parseInt(tempUser.phoneNumber, 10),
        name: tempUser.name,
        emailId: tempUser.emailId,
        otp: parseInt(otp, 10),
      };
      const response = await signUpMutation(updatedUserDetails).unwrap();
      dispatch(setuserDetailsSlice(response));
      dispatch(setToken({
        token: '',
        isAuthenticated: true,
        isGuest: false
      }));
      // console.log('User Details Updated:', response);
    } catch (err) {
      console.error('Error during sign up:', err);
    }
  };

  const handleSignInVerify = async () => {
    try {
      console.log('SignInCalled ')
      // console.log(guestCartItems, "Guest Cart is Here ----------------------")
      const userDetails = {
        phoneNumber: phoneNumber,
        otp: parseInt(otp, 10),
      };
      const response = await signInMutation(userDetails).unwrap();
      dispatch(setuserDetailsSlice(response));
      dispatch(setToken({
        token: '',
        isAuthenticated: true,
        isGuest: false
      }));
      console.log('User Details Updated:', response);
    } catch (err) {
      console.error('Error during sign up:', err);
    }
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', }}>
        <View style={{ paddingHorizontal: moderateScale(18), marginTop: 5 }}>
          <Text style={{ fontSize: moderateScale(17), fontFamily: 'Montserrat Medium', color: Colors.gray, paddingBottom: moderateScale(17) }}>Enter OTP</Text>
          <Text style={{ fontSize: moderateScale(15), fontFamily: 'Montserrat Medium', color: Colors.gray, lineHeight: 27, paddingBottom: moderateScale(12), fontWeight: 'normal' }}>We have sent a verification code to {tempUser?.phoneNumber} </Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <OtpInput
            numberOfDigits={5}
            focusColor={Colors.primary}
            focusStickBlinkingDuration={500}
            onTextChange={handleOtpChange}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              containerStyle: {},
              inputsContainerStyle: { paddingHorizontal: moderateScale(20) },
              pinCodeContainerStyle: { borderColor: Colors.ternary, width: scale(40), height: verticalScale(39), marginBottom: 0 },
              pinCodeTextStyle: { color: Colors.primary }
            }}
          />
        </View>
        <View style={{ paddingStart: moderateScale(20), paddingEnd: moderateScale(8), flexDirection: 'row', justifyContent: 'space-between', }}>
          <View>
            <Text style={{ fontSize: moderateScale(13.5), fontFamily: 'Montserrat Medium', color: Colors.gray, paddingTop: moderateScale(8) }}>Didn't get the OTP?</Text>
          </View>
          <View style={{}}>
            <CButton label='Resent it(56s)' mode='text' />
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', paddingEnd: moderateScale(14), margin: 0 }}>
          <CButton label='Go Back' mode='text' style={{ padding: moderateScale(0) }} onPress={GoBack} />
        </View>

        <View style={{ marginTop: verticalScale(92), marginHorizontal: moderateScale(20) }}>
          <CButton
            label='Verify'
            mode='contained'
            onPress={handleVerify}
          />
        </View>
      </View>
    </ScrollView>

  );
};

export default OtpScreen;
