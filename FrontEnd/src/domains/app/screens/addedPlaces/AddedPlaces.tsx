import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import DemoImage from '../../../../components/DemoImage'
import CCard from '../../../../components/CCard'
import { Colors } from '../../../../theme/Colors'
import dimensions from '../../../../theme/Dimensions'
import { ActivityIndicator, Icon } from 'react-native-paper'
import AddedPlacesCard from './AddedPlacesCard'
import { useNavigation } from '@react-navigation/native'
import { useGetAllAddedPlacesQuery } from './apis/getAllAddedPlaces'
import { useAppSelector } from '../../../../store/hooks'

const AddedPlaces = () => {
  const background = require("../../../../../assets/images/fullbackground.png")
  const navigation = useNavigation<any>()

  const handleSelect = (item: any) => {
    console.log('Selected Address:', item);
  };

  const handleAddAddress = () => {
    navigation.navigate('AddressDetails')
  }



  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />

      <View style={{ marginTop: 28, marginHorizontal: 16, marginBottom: 145 }}>
        {/* Add Address button */}
        <CCard style={{ marginHorizontal: 0, marginTop: 5 }}>
          <TouchableOpacity
            style={styles.buttonstyle}
            onPress={handleAddAddress}
          >
            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4, color: Colors.primary, padding: 12 }]}>Add Address</Text>
            <View style={{ paddingEnd: 10 }}>
              <Icon
                source={require("../../../../../assets/images/rightArrow.png")}
                color={Colors.primary}
                size={dimensions.vw * 3.5}
              />
            </View>
          </TouchableOpacity>
        </CCard>
        <>
          <Text
            style={[textVariants.textSubHeading,
            { paddingVertical: 16, marginHorizontal: 8 }]}>Saved Addresses</Text>
          <AddedPlacesCard
            handleSelect={handleSelect}
          />
        </>

      </View>
    </ImageBackground>
  )
}

export default AddedPlaces

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


})