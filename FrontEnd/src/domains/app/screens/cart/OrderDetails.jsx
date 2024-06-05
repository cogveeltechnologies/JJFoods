import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { useIncreaseCartMutation } from '../../../api/increaseCartItems';
import { useDecreaseCartMutation } from '../../../api/decreaseCartItems';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setCartItems } from './slices/cartItemsSlice';
import { setTotalCartPrice } from './slices/totalCartPriceSlice';
const minusIcon = require('../../../../../assets/images/minusIcon.png');
const deleteIcon = require('../../../../../assets/images/deleteIcon.png')
const addIcon = require('../../../../../assets/images/addProductIcon.png');

const OrderDetails = ({ data }) => {
  const dispatch = useAppDispatch()
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);
  const isGuest = useAppSelector((state) => state.persistedReducer.authSlice.isGuest);

  const [increaseCartMutation, { isLoading: increaseIsLoading, isError: increaseIsError, error: increaseError }] = useIncreaseCartMutation();
  const [decreaseCartMutation, { isLoading: decreaseIsLoading, isError: decreaseIsError, error: decreaseError }] = useDecreaseCartMutation();

  // const initializeData = () => {
  //   return globalCartItmes.map(item => ({
  //     ...item,
  //     unitPrice: item.unitPrice || item.price,
  //     totalPrice: item.quantity * (item.unitPrice || item.price)
  //   }));
  // };

  // const [orderData, setOrderData] = useState(initializeData(globalCartItmes));
  // const [guestCart, setGuestCart] = useState([])



  // useEffect(() => {
  //   setOrderData(initializeData(globalCartItmes));
  // }, [globalCartItmes]);

  // useEffect(() => {
  //   const totalPrice = orderData.reduce((sum, item) => sum + item.totalPrice, 0);
  //   dispatch(setTotalCartPrice({ totalCartPrice: totalPrice })); // Dispatch the action
  // }, [orderData]);

  // useEffect(() => {
  //   if (JSON.stringify(data) !== JSON.stringify(guestCart)) {
  //     setGuestCart(data);
  //   }
  // }, [data, guestCart]);


  useEffect(() => {
    // console.log(data, '==================================data')
    // console.log(cartItems, '++++++++++++++++++++++++++++++++++++CartItems')
  }, [cartItems, data])


  const handleAddPress = async (itemId) => {
    // const updatedData = orderData.map((item) =>
    //   item.itemid === itemId
    //     ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
    //     : item
    // );
    // setOrderData(updatedData);
    try {
      const response = await increaseCartMutation({
        userId: userDetails._id,
        product: { itemId: itemId },
      });

      dispatch(setCartItems(response.data));
      console.log('Increased Item Quantity', response.data)
    } catch (error) {
      console.error('Error increasing cart:', error);
    }
  };

  const handleMinusPress = async (itemId) => {
    try {
      // const updatedData = orderData.map((item) =>
      //   item.itemid === itemId && item.quantity > 0
      //     ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.unitPrice }
      //     : item
      // );
      // setOrderData(updatedData);
      // const itemToRemove = updatedData.find((item) => item.itemid === itemId && item.quantity === 0);

      // if (itemToRemove) {
      //   await decreaseCartMutation({
      //     userId: userDetails._id,
      //     product: { itemId: itemId },
      //   });
      //   // dispatch(setCartItems(updatedData.filter((item) => item.itemid !== itemId)));
      //   console.log('Item Deleted');
      // } else {
      const response = await decreaseCartMutation({
        userId: userDetails._id,
        product: { itemId: itemId },
      });
      dispatch(setCartItems(response.data));
      console.log('Decreased items', response.data);
      // }
    } catch (error) {
      console.error('Error handling minus press:', error);
    }
  };



  const renderItem = ({ item }) => (

    <View style={{ marginHorizontal: 8, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, marginBottom: 12 }}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4.5 }]}>{item.itemname}</Text>
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <View style={styles.addMinusIcon}>

          <IconButton
            icon={item.quantity > 1 ? minusIcon : deleteIcon}
            size={dimensions.vw * 3.5}
            iconColor={Colors.primary}
            onPress={() => handleMinusPress(item.itemid)}
          />

          {(increaseIsLoading || decreaseIsLoading) ? (
            <ActivityIndicator animating={true} color={Colors.primary} size={15} />
          ) :
            (<Text style={[textVariants.textSubHeading, { textAlignVertical: 'center' }]}>{item.quantity}</Text>)}

          <IconButton
            icon={addIcon}
            size={dimensions.vw * 3.5}
            iconColor={Colors.primary}
            onPress={() => handleAddPress(item.itemid)}
          />
        </View>
        <Text style={textVariants.textHeading}>₹ {item.totalCost}</Text>
      </View>
    </View>
  );
  return (

    <>

      <FlatList
        // data={isGuest ? guestCart : orderData}
        data={cartItems?.newData}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemid}
      />

    </>
  )

};

export default OrderDetails;

const styles = StyleSheet.create({
  addMinusIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "#f4dab5",
    height: dimensions.vh * 4,
    marginBottom: 9
  },
});
