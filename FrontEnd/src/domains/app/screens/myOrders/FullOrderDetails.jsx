import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import dimensions from '../../../../theme/Dimensions'
import { Icon } from 'react-native-paper'
import { Colors } from '../../../../theme/Colors'
import { textVariants } from '../../../../theme/StyleVarients'
import RunningOrders from './RunningOrders'
import BillStatement from '../cart/BillStatement'
import OrderStatus from './OrderStatus'
import CButton from '../../../../components/CButton'

const FullOrderDetails = ({ route }) => {
  const background = require("../../../../../assets/images/fullbackground.png");
  const { item } = route.params;

  // useEffect(() => {
  //   console.log(item, "iiiiiiiiiiiiiiiiiiiiiiiiii")
  // }, [item])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, marginVertical: dimensions.vh * 5 }}>

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
              <RunningOrders data={item} />
            </View>

            <View style={styles.dashedLine} />
            {/* Bill Statement  */}
            <View style={styles.billStatementContainer}>
              <BillStatement
                data={{
                  cgst: item?.cgst,
                  sgst: item?.sgst,
                  itemsTotal: item?.itemsTotal,
                  deliveryFee: item?.deliveryFee,
                  platformFee: item?.platformFee,
                  discount: item?.discount.discount,
                  grandTotal: item?.grandTotal
                }}
              />
            </View>

            {/* Order Tracking or Order Status */}
            <View style={{ marginHorizontal: 12, marginVertical: 18 }}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.black, }]}>Your Order Status</Text>
              <OrderStatus OrderStatus={item?.state} />
            </View>
          </View>

          {/* Tracking Button */}
          <View style={{ marginHorizontal: 26, marginTop: dimensions.vw * 5 }}>
            <CButton
              label='Track Order'
              mode='contained'
              disabled={item?.grandTotal !== 'onTheWay'}
            // onPress={gotoMapScreen}
            />
          </View>

        </View>
      </ImageBackground>
    </ScrollView>
  )
}

export default FullOrderDetails

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
})