import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import LinearHeader from '../../../../components/LinearHeader'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import dimensions from '../../../../theme/Dimensions'
import { useNavigation } from '@react-navigation/native'

const Locationscreen = () => {
  const background = require("../../../../../assets/images/fullbackground.png")
  const navigation = useNavigation()
  const navigateToManualLocationScreen = () => {
    navigation.navigate("ManualLocationScreen")
  }
  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />

      {/* Main View */}
      <View style={{ marginHorizontal: 42, marginTop: 20 }}>

        <View >
          <Text style={[textVariants.buttonText, { color: Colors.black, paddingBottom: 2 }]}>What is your Location</Text>
          <Text style={[textVariants.textSubHeading, styles.textSubHeading1]}>We need your location to show available delivery </Text>
        </View>

        <View style={{ marginHorizontal: -42 }}>
          <Image source={require("../../../../../assets/images/mapImage.png")} style={{
            // width: "100%",
            width: dimensions.vw * 100,
            // height: 490,
            height: dimensions.vh * 57.7,
          }} resizeMode="contain" />
        </View>

        <View style={{ marginTop: dimensions.vh * 3 }}>
          <View style={{ marginBottom: 24 }}>
            <CButton label='Allow Location Access' mode='contained' onPress={() => console.warn("pressed")} />
          </View>
          <CButton label='Enter Location Manually' mode='outlined' onPress={navigateToManualLocationScreen} />
        </View>

      </View>
    </ImageBackground>
  )
}

export default Locationscreen

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  textSubHeading1: {
    fontFamily: "Montserrat Regular",
    fontWeight: "400",
    marginBottom: 17
  }
})