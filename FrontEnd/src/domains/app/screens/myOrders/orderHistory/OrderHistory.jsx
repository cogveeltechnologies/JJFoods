import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Colors } from '../../../../../theme/Colors'
import CButton from '../../../../../components/CButton'
import { useNavigation } from '@react-navigation/native'
import dimensions from '../../../../../theme/Dimensions'
import OrderedProductList from './OrderedProductList'

const background = require("../../../../../../assets/images/fullbackground.png")

const OrderHistory = () => {
  const productData = [
    {
      id: 1,
      imageSource: require('../../../../../../assets/images/chearqorma2.png'),
      name: 'Chicken',
      price: '780',
      quantity: "Half",
      orderDate: 'Today',

    },
    {
      id: 2,
      imageSource: require('../../../../../../assets/images/AabGosh.png'),
      name: 'Gushtaba',
      price: '1500',
      quantity: 'Full',
      orderDate: '2024-05-09',

    },
    {
      id: 3,
      imageSource: require('../../../../../../assets/images/AabGosh.png'),
      name: 'Rista',
      price: '1500',
      quantity: 'Full',
      orderDate: '2024-05-09',

    },


  ];
  const navigation = useNavigation()
  const goToHome = () => {
    navigation.navigate('Home')
  }



  return (

    // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      {/* <LinearHeader /> */}

      {
        productData && productData.length ?
          (
            <View style={{ flex: 1, marginHorizontal: 16 }}>

              {/* Ordered Product List  */}
              <FlatList
                data={productData}
                renderItem={({ item }) => (
                  <OrderedProductList item={item} />
                )}
                keyExtractor={(item) => item.id.toString()}
              />
              {/* Start ordering button */}
              <View style={{ marginVertical: moderateScale(20) }}>
                <CButton
                  label='Start Ordering'
                  mode='contained'
                  onPress={goToHome}
                />
              </View>

            </View>

          ) : (
            // Empty Orders View 
            <View style={{ flex: 1 }}>
              <View style={styles.noOrderView} >
                <Text style={styles.noOrderText}>No Orders Yet</Text>
              </View>
              {/* Start ordering button */}
              <View style={{ margin: moderateScale(20) }}>
                <CButton
                  label='Start Ordering'
                  mode='contained'
                  onPress={goToHome}
                />
              </View>
            </View>)
      }
    </ImageBackground>

    // </ScrollView>
  )
}

export default OrderHistory

const styles = StyleSheet.create({

  logoBackground: {
    flex: 1,
  },
  noOrderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600",
    textAlign: 'center'

  }
})