import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import { ActivityIndicator, Icon, } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import CSearchBar from '../../../../components/CSearchBar'
import CCard from '../../../../components/CCard'
import dimensions from '../../../../theme/Dimensions'
import CButton from '../../../../components/CButton'
import AddedPlacesCard from '../addedPlaces/AddedPlacesCard'
import { moderateScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
import { useAppSelector } from '../../../../store/hooks'
import { useGetAllAddedPlacesQuery } from '../addedPlaces/apis/getAllAddedPlaces'


const ManualLocationScreen = () => {
  const background = require("../../../../../assets/images/fullbackground.png")
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigation = useNavigation<any>()

  // const [demoAddresses, setDemoAddresses] = useState([
  //   { id: 1, street: 'Friends lane 1 lalbazar umarcololy ', city: 'Srinagar', pincode: '190001', phoneNumber: '1122334455', type: 'Home' },
  //   { id: 2, street: 'Friends lane 2 lalbazar', city: 'Srinagar', pincode: '190001', phoneNumber: '1425367890', type: 'Work' },
  //   { id: 3, street: 'Friends newYork', city: 'Srinagar', pincode: '191110', phoneNumber: '1425367890', type: 'Work' },
  //   { id: 4, street: 'Friends newYork', city: 'Srinagar', pincode: '191110', phoneNumber: '1425367890', type: 'other' },
  //   { id: 5, street: 'Friends newYork', city: 'Srinagar', pincode: '191110', phoneNumber: '1425367890', type: 'other' },
  // ]);


  const handleSearch = (text: any) => {
    setSearchQuery(text);
  };
  const handleEdit = () => {
    console.log('Edit')
  };

  const handleDelete = () => {
    console.log('Deleted')
  };
  const handleSelect = (item: any) => {
    setSelectedId(item.id)
    setSelectedAddress(item)
  };

  const handleDeliveryButton = () => {
    // console.warn(selectedId, selectedAddress)
    navigation.navigate("MyCart")
  }
  const handleAddaddress = () => {
    navigation.navigate("AddressDetails")
  }


  // if (isLoading) {
  //   return (
  //     <View style={styles.centeredContainer}>
  //       <ActivityIndicator animating={true} color={Colors.primary} size={50} />
  //     </View>
  //   )
  // }

  // if (isError) {
  //   console.log(error)
  //   return (
  //     <View style={styles.centeredContainer}>
  //       <Text style={textVariants.textSubHeading}>Failed to load addresses. Please try again </Text>
  //       <TouchableOpacity onPress={refetch}>
  //         <Text style={styles.retryButton}>Retry</Text>
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }


  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      {/* Main View */}
      <View style={{ flex: 1, marginHorizontal: 16, marginTop: 12 }}>

        <View >
          <CSearchBar
            placeholder="Search for area, street name..."
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </View>

        <CCard style={{ marginHorizontal: 0, marginTop: 24, marginBottom: 16 }}>

          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderStyle: 'dashed', borderColor: Colors.grayDim }}>

            <View style={{ margin: 10, }}>
              <Icon
                source={require('../../../../../assets/images/locationIcon.png')}
                color={Colors.gray}
                // size={16}
                size={dimensions.vw * 3.7}
              />
            </View>

            <View style={{ flex: 1, }}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[textVariants.SecondaryHeading, { width: dimensions.vw * 50, }]}>Device location not
                  enabled</Text>
                <CButton label='Enable' mode='text' onPress={() => console.warn("hello")} />
              </View>


              <Text style={[textVariants.textSubHeading, { width: dimensions.vw * 60, fontSize: dimensions.vw * 3.2, paddingTop: 8, paddingBottom: 16 }]}>
                Tap here to enable your device location
                for a better experience
              </Text>

            </View>

          </View>

          <TouchableOpacity
            style={styles.buttonstyle}
            onPress={handleAddaddress}
          >
            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4, color: Colors.black, padding: 12 }]}>Add Address</Text>
            <View style={{ paddingEnd: 20 }}>
              <Icon
                source={require("../../../../../assets/images/rightArrow.png")}
                color={Colors.primary}
                size={dimensions.vw * 3.5}
              />
            </View>
          </TouchableOpacity>
        </CCard>


        {/* {demoAddresses.length > 0 ? ( */}
        {/* {isSuccess && data.length > 0 && */}
        <>
          <Text
            style={[textVariants.textSubHeading,
            { marginHorizontal: 8, paddingBottom: 16 }]}>Saved Addresses</Text>
          {/* Saved addresses list */}
          <AddedPlacesCard
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleSelect={handleSelect}
          />
          <View style={{ margin: moderateScale(20) }}>
            <CButton
              label='Deliver to this Address'
              mode='contained'
              onPress={handleDeliveryButton}
            />
          </View>
        </>

        {/* } */}

      </View>


    </ImageBackground>
  )
}

export default ManualLocationScreen

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  buttonstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: 30,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    color: Colors.primary,
    marginTop: 10,
  },
})