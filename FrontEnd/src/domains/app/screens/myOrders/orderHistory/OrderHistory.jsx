import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Colors } from '../../../../../theme/Colors'
import CButton from '../../../../../components/CButton'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import dimensions from '../../../../../theme/Dimensions'
import OrderedProductList from './OrderedProductList'
import { useAllRunningOrdersMutation } from './apis/allRunningOrders'
import { useAppSelector } from '../../../../../store/hooks'

const background = require("../../../../../../assets/images/fullbackground.png")

const OrderHistory = () => {

  const [allRunningOrders, { data, error, isLoading, refetch }] = useAllRunningOrdersMutation();
  const state = 'history'
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id
  const [orderDetails, setOrderDetails] = useState([])

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



  const fetchOrders = async () => {
    console.log(userId);
    try {
      const response = await allRunningOrders({ userId, state });
      setOrderDetails(response.data);
      // console.log(response.data, "RRRRRRRRRRRRRRRRRRRrrr");
      console.log(orderDetails, "RRRRRRRRRRRRRRRRRRRrrr");
    } catch (err) {
      console.error('Failed to fetch running orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, state, allRunningOrders]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );



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