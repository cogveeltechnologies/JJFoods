import React, { useEffect, useId, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CButton from '../../../../components/CButton';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { useGetAvailableCouponsQuery } from './api/availableCoupons';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useApplyCouponMutation } from './api/applyCoupon';
import { setCartItems } from './slices/cartItemsSlice';



const renderItem = ({ item, handleApplyCoupon }) => {
  console.log("Rendering item:", item); // Debugging line
  return (
    <View style={{ marginHorizontal: 8, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ marginTop: 8, marginBottom: 16, width: dimensions.vw * 58 }}>
        <Text style={[styles.HeadingText, { marginBottom: 6 }]}>{item.code}</Text>
        <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.5 }]}>{item.description}</Text>
      </View>
      <CButton label='Apply' mode="text" onPress={() => handleApplyCoupon(item)} />
    </View>
  );
};


const Coupons = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);
  const userId = userDetails?._id;

  const { data: coupons, error, isLoading, refetch } = useGetAvailableCouponsQuery({ userId });


  // useEffect(() => {
  //   // console.log(data, '==================================data')
  //   // console.log(cartItems, '++++++++++++++++++++++++++++++++++++CartItems')
  // }, [cartItems])

  useEffect(() => {
    refetch();
  }, [userId, refetch, cartItems]);

  const [availableCoupons, setAvailableCoupons] = useState(coupons?.slice(0, 2));


  useEffect(() => {
    if (coupons) {
      setAvailableCoupons(coupons.slice(0, 2));
    }
  }, [coupons]);

  // useEffect(() => {

  //   console.log(globalCartItems, "**********************************************")
  //   const totalprice = globalCartItems.reduce((total, item) => { return total + item.totalPrice }, 0)
  //   console.log(totalprice)
  // }, globalCartItems)

  const [applyCoupon, { isLoading: isapplyCouponLoading, error: isapplyCouponError, data }] = useApplyCouponMutation();

  const handleApplyCoupon = async (coupon) => {
    // console.warn("Applying coupon:", coupon);
    try {
      // console.log(totalCartPrice)
      const response = await applyCoupon({ userId, couponId: coupon._id, price: cartItems.itemsTotal }).unwrap();
      console.log(cartItems, "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEeee")
      dispatch(setCartItems(response))
      console.log(response, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRrrrrrrrrrrrrrrrrr");
    } catch (error) {
      console.error("Failed to apply coupon:", error.message);
    }
  }

  return (
    <FlatList
      data={availableCoupons}
      renderItem={({ item }) => renderItem({ item, handleApplyCoupon })}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

export default Coupons;

const styles = StyleSheet.create({
  HeadingText: {
    fontSize: dimensions.vw * 4.3,
    color: Colors.primary,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
  },
});
