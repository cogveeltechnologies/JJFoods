import { ImageBackground, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { textVariants } from '../../../../theme/StyleVarients';
import LinearHeader from '../../../../components/LinearHeader';
import CCard from '../../../../components/CCard';
import CButton from '../../../../components/CButton';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from 'react-native-size-matters';
import { SpacedInput } from '../profile/MyProfile';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import dimensions from '../../../../theme/Dimensions';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { useAddNewAddressMutation } from './apis/addNewAddress';
import { useAppSelector } from '../../../../store/hooks';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';


interface FormData {
  name: string;
  phoneNumber: Number;
  address1: string;
  address2: string;
  address3: string;
}

interface Errors {
  name?: string;
  phoneNumber?: string;
  address1?: string;
  address2?: string;
  address3?: string;
}

const AddressDetails: React.FC = () => {
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;
  const background = require("../../../../../assets/images/fullbackground.png");
  const [addNewAddress, { isLoading, isSuccess, isError, error }] = useAddNewAddressMutation();
  const navigation = useNavigation()
  const [selectedType, setSelectedType] = useState<string>('Home');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    address3: ''
  });
  const [errors, setErrors] = useState<Errors>({});

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string()
      .required('Contact is required')
      .matches(/^\d+$/, 'Contact must be a number')
      .min(10, 'Contact must be at least 10 digits')
      .max(10, 'Contact should only 10 digits'),
    address1: Yup.string().required('House No is required'),
    address2: Yup.string().required("Please add address "),
    address3: Yup.string(),
  });

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const addressData = {
        name: formData.name,
        phoneNumber: parseInt(formData.phoneNumber, 10),
        address1: formData.address1,
        address2: formData.address2,
        address3: formData.address3,
        addressType: selectedType,
        user: userId, // replace with actual userId
        isDefault: true, // change based on your requirement
      };
      // console.log(addressData, "dddddddddddddddd")
      const response = await addNewAddress(addressData).unwrap();
      // console.log('Address added successfully:', response);
      Toast.show({
        type: 'success',
        text1: 'Added',
        text2: 'Added Successfully  👋',
      });


      setFormData({
        name: '',
        phoneNumber: '',
        address1: '',
        address2: '',
        address3: ''
      });
      setErrors({});
      navigation.navigate("ManualLocationScreen")

    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors: Errors = {};
        err.inner.forEach(error => {
          if (error.path) {
            validationErrors[error.path as keyof FormData] = error.message;
          }
        });
        setErrors(validationErrors);
      } else if (isError) {
        console.log('Error', err || 'Failed to add address');
      }
    }
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        <LinearHeader />

        <View style={{ flex: 1, marginTop: 35, marginHorizontal: 16, justifyContent: 'space-between' }}>

          <CCard style={{ marginHorizontal: 0, paddingBottom: 50 }}>
            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.5, paddingStart: 15 }]}>Save address as</Text>
            <View style={styles.buttonContainer}>
              {['Home', 'Work', 'Hotel', 'Other'].map(type => (
                <CButton
                  key={type}
                  onPress={() => setSelectedType(type)}
                  label={type}
                  mode='text'
                  labelStyle={{ color: Colors.black, }}
                  style={{ borderBottomWidth: 3, borderBottomColor: selectedType === type ? Colors.primary : 'transparent', marginBottom: 5 }}
                />
              ))}
            </View>

            <View style={{ marginHorizontal: 8 }}>
              <SpacedInput>
                <TextInput
                  outlineColor={Colors.primary}
                  textColor={Colors.black}
                  placeholderTextColor={Colors.primary}
                  theme={{ colors: { onSurfaceVariant: Colors.gray } }}
                  outlineStyle={{ borderColor: Colors.gray, borderRadius: 10 }}
                  style={{ backgroundColor: 'white' }}
                  label="Receiver’s name"
                  mode='outlined'
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  error={!!errors.name}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </SpacedInput>

              <SpacedInput>
                <TextInput
                  outlineColor={Colors.primary}
                  textColor={Colors.black}
                  placeholderTextColor={Colors.primary}
                  theme={{ colors: { onSurfaceVariant: Colors.gray } }}
                  outlineStyle={{ borderColor: Colors.gray, borderRadius: 10 }}
                  label="Receiver’s Contact"
                  mode='outlined'
                  style={{ backgroundColor: 'white' }}
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  keyboardType='number-pad'
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
              </SpacedInput>

              <SpacedInput>
                <TextInput
                  outlineColor={Colors.primary}
                  textColor={Colors.black}
                  placeholderTextColor={Colors.primary}
                  theme={{ colors: { onSurfaceVariant: Colors.gray } }}
                  outlineStyle={{ borderColor: Colors.gray, borderRadius: 10 }}
                  label="Flat / House no / Building / Floor"
                  mode='outlined'
                  style={{ backgroundColor: 'white' }}
                  value={formData.address1}
                  onChangeText={(value) => handleInputChange('address1', value)}
                  keyboardType='name-phone-pad'
                  error={!!errors.address1}
                />
                {errors.address1 && <Text style={styles.errorText}>{errors.address1}</Text>}
              </SpacedInput>

              <SpacedInput>
                <TextInput
                  outlineColor={Colors.primary}
                  textColor={Colors.black}
                  placeholderTextColor={Colors.primary}
                  theme={{ colors: { onSurfaceVariant: Colors.gray } }}
                  outlineStyle={{ borderColor: Colors.gray, borderRadius: 10 }}
                  label="Area / Sector / Locality / Pincode"
                  mode='outlined'
                  style={{ backgroundColor: 'white' }}
                  value={formData.address2}
                  onChangeText={(value) => handleInputChange('address2', value)}
                  error={!!errors.address2}
                />
                {errors.address2 && <Text style={styles.errorText}>{errors.address2}</Text>}
              </SpacedInput>

              <TextInput
                outlineColor={Colors.primary}
                textColor={Colors.black}
                placeholderTextColor={Colors.primary}
                theme={{ colors: { onSurfaceVariant: Colors.gray } }}
                outlineStyle={{ borderColor: Colors.gray, borderRadius: 10 }}
                label="Nearby Landmark (optional)"
                mode='outlined'
                style={{ backgroundColor: 'white' }}
                value={formData.address3}
                onChangeText={(value) => handleInputChange('address3', value)}
                error={!!errors.address3}
              />
              {errors.address3 && <Text style={styles.errorText}>{errors.address3}</Text>}
            </View>

          </CCard>

          <View style={{ margin: moderateScale(20) }}>
            {isLoading ? (
              <ActivityIndicator animating={true} color={Colors.primary} size={50} />
            ) : (
              <CButton label='Save Address' mode='contained' onPress={handleSubmit} />
            )}
          </View>

        </View>

      </ImageBackground>
    </ScrollView>
  )
}

export default AddressDetails

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
});
