import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import dimensions from '../../../../theme/Dimensions'
import { useAppSelector } from '../../../../store/hooks'

const BillStatement = ({ data }) => {

  // const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);

  // useEffect(() => {
  //   console.log(data, "-------------------")
  // }, [data]);

  return (
    <View style={{ marginHorizontal: 15 }}>

      {/* Item Total */}
      <View style={styles.itemTotalView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={[textVariants.buttonTextHeading, { color: Colors.gray }]}>Item Total</Text>
          <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>₹ {data?.itemsTotal}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3 }]}>Delivery Partner fee</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.5, marginEnd: 5, textDecorationLine: 'line-through' }]}>₹ {data?.deliveryFee}</Text>
          </View>
        </View>

        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.3, marginBottom: 18 }]}>FREE Delivery on your order!</Text>
      </View>

      {/* Platform and GST */}
      <View style={styles.plateformView}>
        <View style={styles.totalItemView}>
          <Text style={[textVariants.buttonTextHeading, styles.plateformfeeText]}>Platform fee</Text>
          <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>₹ {data?.platformFee}</Text>
        </View>

        <View style={styles.gstView}>
          <Text style={[textVariants.buttonTextHeading, styles.gstText]}>CGST</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>₹ {data?.cgst?.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.gstView}>
          <Text style={[textVariants.buttonTextHeading, styles.gstText]}>SGST</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>₹ {data?.sgst?.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.totalItemView}>
        <Text style={[textVariants.buttonTextHeading, styles.plateformfeeText]}>Discount</Text>
        <Text style={[textVariants.buttonTextHeading, styles.plateformfeeText]}>₹ {data?.discount?.discount || 0}</Text>
      </View>


      <View style={styles.topayView}>
        <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 4.1 }]}>To Pay</Text>
        <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 3.8 }]}>₹ {data?.grandTotal?.toFixed(2)}</Text>
      </View>

    </View>
  )
}

export default BillStatement

const styles = StyleSheet.create({
  itemTotalView: {
    borderBottomWidth: 0.8,
    borderStyle: 'dashed',
    borderBottomColor: Colors.grayDim
  },
  plateformView: {
    marginTop: 18
  },
  totalItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5.5
  },
  plateformfeeText: {
    color: Colors.gray,
    borderBottomWidth: 0.6,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed'
  },
  gstView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  gstText: {
    color: Colors.gray,
    borderBottomWidth: 0.6,
    borderBottomColor: Colors.grayDim,
    borderStyle: 'dashed'
  },
  topayView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  }
})
