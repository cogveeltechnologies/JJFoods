import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { moderateScale, } from 'react-native-size-matters'
import { Icon, Text } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { useNavigation } from '@react-navigation/native'
import dimensions from '../../../../theme/Dimensions'

import { useUserDetailsQuery } from '../../../auth/api'
import { textVariants } from '../../../../theme/StyleVarients'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { setUserList } from '../../../slices/userSlice'
import RunningOrders from './RunningOrders'
import BillStatement from '../cart/BillStatement'
import OrderStatus from './OrderStatus'


const MyOrders = () => {
  const background = require("../../../../../assets/images/fullbackground.png");
  const cartImage = require("../../../../../assets/images/cartIcon.png");
  const navigation = useNavigation();
  const goToHome = () => {
    navigation.navigate('Home');
  };
  const gotoMapScreen = () => {
    navigation.navigate('Locationscreen');
  };

  // const { data: users, isLoading, isError, error, isSuccess } = useUserDetailsQuery();

  // const dispatch = useAppDispatch(); // Get the dispatch function

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setUserList(users));
  //   }
  // }, [dispatch, isSuccess, users]);

  const orders = [
    { id: 1, title: 'Product 1', price: 10, quantity: 2 },
    { id: 2, title: 'Product 2', price: 15, quantity: 1 },
    { id: 3, title: 'Product 3', price: 20, quantity: 3 }
  ]

  // Mock orderStatus for testing
  const orderStatus = 'ready';

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        {
          orders && orders.length ? (
            <View style={{ marginVertical: dimensions.vw * 5 }}>

              {/* Timer Heading and icon */}
              <View style={{ marginHorizontal: 64, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Icon
                  source={require("../../../../../assets/images/clockicon.png")}
                  color={Colors.primary}
                  size={dimensions.vw * 4.8}
                />
                <Text style={[textVariants.buttonTextHeading, { color: Colors.black, paddingStart: 10 }]}>Your Order will arrive in 30-34 mins</Text>
              </View>

              {/* Main Card */}
              <View style={styles.mainCard}>

                {/* Order list  */}
                <View style={{ marginHorizontal: 12, marginVertical: 12 }}>

                  <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Your Order</Text>
                  <RunningOrders />
                </View>

                <View style={styles.dashedLine} />
                {/* Bill Statement  */}
                <View style={styles.billStatementContainer}>
                  < BillStatement />
                </View>

                {/* Order Tracking or Order Status */}
                <View style={{ marginHorizontal: 12, marginVertical: 18 }}>
                  <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Your Order Status</Text>
                  <OrderStatus OrderStatus={orderStatus} />
                </View>
              </View>

              {/* Tracking Button */}
              <View style={{ marginHorizontal: 26, marginTop: dimensions.vw * 5 }}>
                <CButton
                  label='Track Order'
                  mode='contained'
                  disabled={orderStatus !== 'onTheWay'}
                  onPress={gotoMapScreen}
                />
              </View>

            </View>
          ) : (
            // View for No Order Text 
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={cartImage} style={styles.logo} resizeMode="contain" />
                <Text style={styles.noOrderText}>No orders yet</Text>
              </View>
              <View style={{ margin: moderateScale(20) }}>
                <CButton label="Start Ordering" mode="contained" onPress={goToHome} />
              </View>
            </View>
          )

        }
      </ImageBackground>
    </ScrollView >
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  mainCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayDim,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 24
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed',
  },
  billStatementContainer: {
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed',
  },
  logoBackground: {
    flex: 1,
  },
  logo: {
    width: dimensions.vw * 28,
    height: dimensions.vw * 28,
    margin: 40,
  },
  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: 'Montserrat SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },

});