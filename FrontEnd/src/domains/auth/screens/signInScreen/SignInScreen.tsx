import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CInput from '../../../../components/CInput';
import CButton from '../../../../components/CButton';
import { useSingInOtpMutation } from '../../api/authSignInOtp';
import { textVariants } from '../../../../theme/StyleVarients';

interface SignInScreenProps { }

interface ValidationError {
  message: string;
}

const phoneNumberValidationSchema = yup.object().shape({
  phoneNumber: yup.string()
    .required('Phone Number is required')
    .matches(/^\d+$/, 'Contact must be a number')
    .min(10, 'Contact must be at least 10 digits')
    .max(10, 'Contact should only 10 digits'),
});




const SignInScreen: React.FC<SignInScreenProps> = () => {
  const navigation = useNavigation<any>();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [signInOtpMutation, { isLoading, error, isError }] = useSingInOtpMutation();
  const [validationError, setValidationError] = useState<ValidationError>({ message: '' });

  const handleOtp = async () => {
    try {
      await phoneNumberValidationSchema.validate({ phoneNumber });
      setValidationError({ message: '' });
      await AsyncStorage.setItem('userPhoneNumber', JSON.stringify(phoneNumber));
      const response = await signInOtpMutation({ phoneNumber: parseInt(phoneNumber, 10) }).unwrap();
      // console.log(phoneNumber)
      // console.log(response);
      navigation.navigate("Otp", { source: "SignIn" });
      setPhoneNumber('');
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        setValidationError({ message: err.message });
      } else {
        console.error("Error sending OTP: ", err);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ margin: moderateScale(20) }}>
          <CInput
            mode="flat"
            label="Phone Number"
            type="text"
            keyboardType="number-pad"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
          {validationError.message ? (
            <Text style={styles.errorText}>{validationError.message}</Text>
          ) : null}
        </View>

        <View style={{ margin: moderateScale(20) }}>
          <CButton label='Get OTP' mode='contained' onPress={handleOtp} />
          {isLoading && (<Text style={textVariants.bigheading}>Loading.......</Text>)}
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
    marginStart: moderateScale(10),
  },
});

export default SignInScreen;
