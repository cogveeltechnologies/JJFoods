import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CInput from '../../../../components/CInput';
import CButton from '../../../../components/CButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSingUpotpMutation } from '../../api/authSignUpOtp';
import * as yup from 'yup';

// Define interfaces for props
interface SpacedInputProps {
  children: React.ReactNode;
}

interface FormData {
  name: string;
  emailId: string;
  phoneNumber: string;
}

interface ValidationErrors {
  name: string;
  emailId: string;
  phoneNumber: string;
}

const phoneNumberValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  emailId: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string()
    .required('Phone Number is required')
    .matches(/^\d+$/, 'phoneNumber must be a number')
    .min(10, 'phoneNumber must be at least 10 digits')
    .max(10, 'phoneNumber should only be 10 digits'),
});

const SpacedInput = ({ children }: SpacedInputProps) => (
  <View style={{ marginBottom: moderateScale(20) }}>{children}</View>
);

const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const [otpMutation, { isLoading, isSuccess, isError, error }] = useSingUpotpMutation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    emailId: '',
    phoneNumber: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: '',
    emailId: '',
    phoneNumber: '',
  });

  const handleSignUp = async () => {
    try {
      await phoneNumberValidationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({ name: '', emailId: '', phoneNumber: '' });
      await AsyncStorage.setItem('userDetails', JSON.stringify(formData));
      const response = await otpMutation({ emailId: formData.emailId, phoneNumber: formData.phoneNumber }).unwrap();
      // console.log(response);
      navigation.navigate('Otp', { source: 'SignUp' });
      setFormData({ name: '', emailId: '', phoneNumber: '' });
    } catch (error: any) { // Explicitly define error as Error type
      if (error.name === 'ValidationError') {
        const errors: Partial<ValidationErrors> = {};
        error.inner.forEach((e: any) => {
          errors[e.path as keyof ValidationErrors] = e.message;
        });
        setValidationErrors(errors as ValidationErrors);
      } else {
        console.error('Error sending OTP: ', error);
      }
    }
  };

  const handleTextChange = (key: keyof FormData, value: string) => {
    const updatedValue = typeof value === 'string' ? (value.trim() !== '' ? value : '') : '';
    setFormData((prevData) => ({
      ...prevData,
      [key]: updatedValue,
    }));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ margin: moderateScale(20) }}>
          <SpacedInput>
            <CInput
              type="text"
              mode="flat"
              keyboardType="default"
              label="Name"
              onChangeText={(text) => handleTextChange('name', text)}
              value={formData.name}
            />
            {validationErrors.name ? (
              <Text style={styles.errorText}>{validationErrors.name}</Text>
            ) : null}
          </SpacedInput>
          <SpacedInput>
            <CInput
              type="text"
              mode="flat"
              keyboardType="email-address"
              label="Email ID"
              onChangeText={(text) => handleTextChange('emailId', text)}
              value={formData.emailId}
            />
            {validationErrors.emailId ? (
              <Text style={styles.errorText}>{validationErrors.emailId}</Text>
            ) : null}
          </SpacedInput>
          <SpacedInput>
            <CInput
              mode="flat"
              label="Phone Number"
              type="text"
              keyboardType="number-pad"
              onChangeText={(text) => handleTextChange('phoneNumber', text)}
              value={formData.phoneNumber}
            />
            {validationErrors.phoneNumber ? (
              <Text style={styles.errorText}>{validationErrors.phoneNumber}</Text>
            ) : null}
          </SpacedInput>
        </View>
        <View style={{ margin: moderateScale(20) }}>
          <CButton label="Sign Up" mode="contained" onPress={handleSignUp} />
          {isLoading && <Text>Loading.......</Text>}
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

export default SignUpScreen;
