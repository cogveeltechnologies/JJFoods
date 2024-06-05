import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { textVariants } from '../../../../theme/StyleVarients';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearHeader from '../../../../components/LinearHeader';
import { Colors } from '../../../../theme/Colors';
import CCard from '../../../../components/CCard';
import CButton from '../../../../components/CButton';
import OrderPreference from './OrderPreference';
import Coupons from './Coupons';
import BillStatement from './BillStatement';
import OrderDetails from './OrderDetails';
import dimensions from '../../../../theme/Dimensions';
import { useGetCartItemsQuery } from '../../../api/cartItems';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { ActivityIndicator, Icon, Modal, Portal, RadioButton } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { setCartItems } from './slices/cartItemsSlice';
import { useGetAvailableCouponsQuery } from './api/availableCoupons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTotalPriceToPaySlice } from './slices/totalPriceToPay';
import { useCreateOrderMutation } from './api/createOrder';
import LottieView from 'lottie-react-native';
import RazorPay from './RazorPay';

const MyCart = () => {
  const background = require('../../../../../assets/images/fullbackground.png');
  const cartImage = require("../../../../../assets/images/cartIcon.png");
  const addIcon = require('../../../../../assets/images/addProductIcon.png');
  const arrowIcon = require('../../../../../assets/images/rightArrow.png');

  const navigation = useNavigation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const cartItems = useAppSelector((state) => state.persistedReducer.cartItemsSlice.cartItems);
  const deliveryAddressId = useAppSelector((state) => state.persistedReducer.deliveryAddressIdSlice.deliveryAddressId)
  const orderPreference = useAppSelector((state) => state.persistedReducer.orderPreferenceSlice.orderPreference)

  const isGuest = useAppSelector((state) => state.persistedReducer.authSlice.isGuest)
  const dispatch = useAppDispatch();
  const userId = userDetails?._id;
  // const [guestCartItems, setGuestCartItems] = useState([]);

  // const { data, error: cartError, isLoading: cartIsLoading, refetch } = useGetCartItemsQuery({ userId });

  const { data, error: cartError, isLoading: cartIsLoading, refetch } = useGetCartItemsQuery({ userId }, {
    refetchOnMountOrArgChange: true, // Automatically refetch on component mount or when arguments change
    refetchOnReconnect: true, // Automatically refetch on reconnect
    refetchOnFocus: true, // Automatically refetch on focus
  });

  const [createOrder, { isLoading: createOrderLoading, isError: createOrderIsError, isSuccess: createOrderSuccess, error: createOrderError }] = useCreateOrderMutation();

  const [visible, setVisible] = useState(false)


  // useEffect(() => {
  //   // dispatch(setCartItems(data))
  //   console.log(data, "----------------data")
  //   console.log(cartItems, "----------------cartItems")
  // }, [])


  // const getGuestCart = async () => {
  //   try {
  //     const guestCart = await AsyncStorage.getItem('guestCart');
  //     if (guestCart) {
  //       const finalCart = JSON.parse(guestCart);
  //       setGuestCartItems(finalCart);
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving guest cart:', error);
  //   }
  // };

  // const mergeGuestCartWithUserCart = () => {
  //   if (guestCartItems.length > 0) {
  //     const mergedCart = [...guestCartItems]; // Merge guest cart 
  //     dispatch(setCartItems(mergedCart)); // Dispatch action to update cart items in Redux store
  //     AsyncStorage.removeItem('guestCart'); // Remove guest cart from AsyncStorage
  //     setGuestCartItems([]); // Clear guest cart items state
  //   }
  // };

  useEffect(() => {
    if (!isGuest && userId) {
      refetch(); // Fetch cart items only if the user is not a guest and userId is available
    } else if (isGuest) {
      // getGuestCart(); // Fetch guest cart items
    }
  }, [isGuest, userId, refetch]);

  useEffect(() => {
    if (userId && data) {
      dispatch(setCartItems(data));
      // console.log(data, "----------------data")
      // console.log(cartItems, "----------------cartItems")
      // console.log(cartItems.itemsTotal, "----------------cartItems")
    }
  }, [userId, data, cartItems, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetch();
        if (data) {
          dispatch(setCartItems(data));
        }
      } else {
        // getGuestCart();
      }
    }, [userId, refetch, data, cartItems, dispatch,])
  );



  // if (!userId) {
  //   return (
  //     <View style={styles.centeredView}>
  //       <Text style={textVariants.SecondaryHeading}>User ID not available</Text>
  //     </View>
  //   );
  // }



  const handleAddMoreItems = () => {
    navigation.navigate('Home');
  };

  const [checked, setChecked] = useState(false);

  const handleCashOnDeliverButtonPress = () => {
    setChecked(!checked);
  };

  const handlePayNowButtonPress = () => {
    console.warn("Pay Now");
  };

  const handleMoreCouponsButton = () => {
    navigation.navigate('CollectedCoupons');
  }

  if (cartError) {
    console.log(cartError);
    let errorMessage = 'An error occurred while fetching the cart items.';

    if (cartError.status === 'FETCH_ERROR') {
      errorMessage = 'Network error: Please check your internet connection.';
    } else if (cartError.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (cartError.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (cartError.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{cartError.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20 }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }

  const handleProceed = async () => {
    const orderData = {
      userId: userId,
      orderPreference: orderPreference,
      discount: { couponId: '' },
      address: orderPreference === 'Deliver to my Address' ? deliveryAddressId : '',
      payment: {
        paymentId: '',
        paymentMethod: checked ? 'COD' : 'online',
      }
    };

    try {
      const response = await createOrder(orderData).unwrap();
      // console.log('Order created successfully:', response,);
      setChecked(false)
      setVisible(true); // Show success modal on successful order creation
      setTimeout(() => {
        setVisible(false);
        navigation.navigate('OrdersNavigator');
      }, 1500);

    } catch (err) {
      // console.log(orderData, "-----------------------------")
      console.error('Failed to create order:', err);
    }
  };


  if (createOrderLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={Colors.primary} size={50} />
      </View>
    )
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground source={background} resizeMode="cover" style={{ flex: 1 }}>
        <LinearHeader />

        {/* Show loading indicator if fetching cart items for non-guest user */}
        {cartIsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} color={Colors.primary} size={50} />
          </View>
        ) : (
          <View style={styles.mainContainer}>
            {/*  Show empty cart message for guest user if guestCartItems is empty */}
            {/* {(isGuest && guestCartItems.length === 0) || (!isGuest && globalCartItems.length === 0) ? ( */}
            {(cartItems?.itemsTotal === 0) && (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={cartImage} style={styles.logo} resizeMode="contain" />
                  <Text style={styles.noOrderText}>Your Cart is Empty</Text>
                </View>
                <View style={{ margin: moderateScale(20) }}>
                  <CButton label="Start Ordering" mode="contained" onPress={handleAddMoreItems} />
                </View>
              </View>
            )}


            {cartItems &&
              <View style={styles.mainContainer}>
                <Text style={[textVariants.textHeading2, { fontSize: 17, textAlign: 'center' }]}>Yay! You Saved ₹50 with FREE delivery</Text>


                <View style={{ marginTop: 28 }}>
                  <Text style={textVariants.textHeading}>Order Basket</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18 }}>
                    {/* <OrderDetails data={guestCartItems} /> */}
                    <OrderDetails />
                    <CButton
                      label="Add More Items"
                      icon={addIcon}
                      iconSize={dimensions.vw * 4.4}
                      mode="text"
                      labelStyle={[textVariants.textSubHeading, { fontSize: 18 }]}
                      contentStyle={{ flexDirection: 'row-reverse' }}
                      onPress={handleAddMoreItems}
                    />
                  </CCard>
                </View>


                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Offers And Benefits</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 17 }}>
                    <Coupons />
                    <CButton
                      label="View Coupons"
                      icon={arrowIcon}
                      iconSize={dimensions.vw * 4.4}
                      mode="text"
                      labelStyle={[textVariants.textSubHeading, { fontSize: 18 }]}
                      contentStyle={{ flexDirection: 'row-reverse' }}
                      onPress={handleMoreCouponsButton}
                    />
                  </CCard>
                </View>



                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Order Preference</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18 }}>
                    <OrderPreference />
                  </CCard>
                </View>

                <View style={{ marginTop: 36 }}>
                  <Text style={textVariants.textHeading}>Bill Statement</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 18, marginBottom: 20 }}>
                    <BillStatement />
                  </CCard>
                </View>



                <View style={{ marginTop: 10 }}>
                  <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9 }]}>Pay on Delivery</Text>
                  <CCard style={{ marginHorizontal: 0, marginTop: 8, marginBottom: 20 }}>
                    <TouchableOpacity style={styles.itemContainer} onPress={handleCashOnDeliverButtonPress}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginEnd: 15 }}>
                          <Icon
                            source={require('../../../../../assets/images/cashIcon.png')}
                            color={checked ? Colors.primary : Colors.black}
                            size={dimensions.vw * 7}
                          />
                        </View>
                        <Text style={[textVariants.textSubHeading, { color: checked ? Colors.primary : Colors.black }]}>
                          Cash on Delivery
                        </Text>
                      </View>
                      <RadioButton
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={handleCashOnDeliverButtonPress}
                      />
                    </TouchableOpacity>
                  </CCard>
                </View>


                {/* Razor Pay Button  or payment GateWay Button*/}
                <RazorPay />

                {/* Order Button  */}
                <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                  <CButton
                    label={checked ? "Order Now " : "Proceed"}
                    mode="contained"
                    onPress={handleProceed}
                  />
                </View>

                {/* Model for Confirmation of Order */}
                <Portal>
                  <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, width: 200, borderRadius: 20, alignSelf: 'center' }}>
                    <LottieView
                      source={require('../../../../../assets/lottieFiles/success.json')}
                      autoPlay
                      loop={true}
                      style={{ width: 150, height: 150, alignSelf: 'center' }}
                    />
                    <Text style={[textVariants.textSubHeading, { textAlign: 'center' }]}>Order is done!</Text>
                  </Modal>
                </Portal>


              </View>
            }


          </View>
        )}


      </ImageBackground>
    </ScrollView >
  );
};

export default MyCart;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10
  },
  TopText: {
    ...textVariants.SecondaryHeading,
    color: Colors.green,
    marginVertical: moderateScale(20),
  },
  logo: {
    width: dimensions.vw * 20,
    height: dimensions.vw * 20,
  },
  noOrderText: {
    // fontSize: 24,
    fontSize: dimensions.vw * 5.6,
    color: Colors.gray,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600",
    marginTop: 40
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
});
