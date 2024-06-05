import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import CCard from '../../../../components/CCard'
import { ActivityIndicator, Icon } from 'react-native-paper'
import dimensions from '../../../../theme/Dimensions'
import { moderateScale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
import { useAppSelector } from '../../../../store/hooks'
import { useCreateOrderMutation } from './api/createOrder'
import { Colors } from '../../../../theme/Colors'
import RazorpayCheckout from 'react-native-razorpay'


const fetchOrderId = async (amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: 'helloThere'
      }),
    });

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create order');
  }
};

const RazorPay = () => {

  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const orderPreference = useAppSelector((state) => state.persistedReducer.orderPreferenceSlice.orderPreference)
  const userId = userDetails?._id;
  const [createOrder, { isLoading: createOrderLoading, isError: createOrderIsError, isSuccess: createOrderSuccess, error: createOrderError }] = useCreateOrderMutation();

  const handlePayNowButtonPress = async () => {
    const orderData = {
      userId: userId,
      orderPreference: orderPreference,
      discount: { couponId: '' },
      address: orderPreference === 'Deliver to my Address' ? deliveryAddressId : '',
      payment: {
        paymentId: '',
        paymentMethod: 'online',
      }
    };
    try {
      // Creating Order First  
      const response = await createOrder(orderData).unwrap();

      // console.log(response, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRrr")
      // const options = {
      //   description: 'Credits towards consultation',
      //   // image: user?.imageFile,
      //   currency: 'INR',
      //   key: 'rzp_test_gYwgZTvcv9nNAh', // Use your public key ID here
      //   amount: amount * 100, // amount in paise
      //   name: "JJFoods",
      //   order_id: orderId, // use the order ID from your server
      //   prefill: {
      //     email: '',
      //     contact: user?.phoneNumber,
      //     name: user?.name,
      //   },
      //   theme: { color: Colors.primary }
      // };

      const options = { ...response, theme: { color: Colors.primary } }
      console.log(options, 'ooooooooooooooooooooooooooooooooooooooooo')

      RazorpayCheckout.open(options).then(async (data) => {
        console.log(data, "RazorPay ---------------------------------")
        Toast.show({
          type: 'success',
          text1: 'Payment Successful',
          text2: `Payment ID: ${data.razorpay_payment_id}`
        })

      }).catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: `Error: ${error.code} | ${error.description}`
        })
        console.log(error, "razorpay error")
        // setPaymentData(error)
      });
    } catch (error) {
      console.log('Error', error.message);
    }
  };



  if (createOrderLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={Colors.primary} size={50} />
      </View>
    )
  }

  // if (cartError) {
  //   console.log(cartError);
  //   let errorMessage = 'An error occurred while fetching the cart items.';

  //   if (cartError.status === 'FETCH_ERROR') {
  //     errorMessage = 'Network error: Please check your internet connection.';
  //   } else if (cartError.status === 'PARSING_ERROR') {
  //     errorMessage = 'Error parsing server response.';
  //   } else if (cartError.originalStatus === 404) {
  //     errorMessage = 'Menu items not found.';
  //   } else if (cartError.originalStatus === 500) {
  //     errorMessage = 'Server error: Please try again later.';
  //   }

  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{cartError.status}</Text>
  //       <Text style={[textVariants.headingSecondary, { paddingBottom: 20 }]}>{errorMessage}</Text>
  //       <CButton label='Reload' mode='contained' onPress={refetch} />
  //     </View>
  //   )
  // }

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9 }]}>Pay Now</Text>
      <CCard style={{ marginHorizontal: 0, marginTop: 8, marginBottom: 20 }}>
        <TouchableOpacity style={styles.itemContainer} onPress={handlePayNowButtonPress}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginEnd: 15 }}>
              <Icon
                source={require('../../../../../assets/images/rupeeIcon.png')}
                color={Colors.black}
                size={dimensions.vw * 3.8}
              />
            </View>
            <Text style={[textVariants.textSubHeading, { color: Colors.black, width: dimensions.vw * 65, }]}>Pay with UPI, Net Banking, Debit, Credit Card</Text>
          </View>
          <Icon
            source={require('../../../../../assets/images/rightArrow.png')}
            color={Colors.gray}
            size={dimensions.vw * 3.8}
          />
        </TouchableOpacity>
      </CCard>
    </View>
  )
}

export default RazorPay

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
})