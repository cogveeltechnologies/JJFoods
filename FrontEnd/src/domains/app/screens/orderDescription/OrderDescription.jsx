import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearHeader from '../../../../components/LinearHeader'
import { ActivityIndicator, Avatar, Icon, IconButton } from 'react-native-paper'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import CButton from '../../../../components/CButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import dimensions from '../../../../theme/Dimensions'
import { useAddCartMutation } from '../../../api/addCart'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message';
import { useAddToWishlistMutation } from '../wishList/apis/addToWishlist'
import { useProductDetailsMutation } from './apis/productDetails'
import { useUpdateWishlistMutation } from '../wishList/apis/updateWishlist'




const OrderDescription = () => {
  const background = require("../../../../../assets/images/fullbackground.png")
  const productImage = require("../../../../../assets/images/soanPlateImage.png")
  const minusIcon = require('../../../../../assets/images/minusIcon.png')
  const addIcon = require('../../../../../assets/images/addProductIcon.png')
  const route = useRoute();
  const { item } = route.params;
  const navigation = useNavigation()
  const [quantity, setQuantity] = useState(1);
  const [addCart, { isLoading, isError, isSuccess, isUninitialized }] = useAddCartMutation();
  const [addToWishlist, { isLoading: wishlistLoading, isSuccess: iswishlistSuccess, isError: iswishlistError, error: wishlistError }] = useAddToWishlistMutation();
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const isGuest = useAppSelector((state) => state.persistedReducer.authSlice.isGuest)
  const [isPressed, setIsPressed] = useState(allProductDetails?.isWishlist);
  const [allProductDetails, setAllProductDetails] = useState([])


  const [productDetails, { data, error: isProductError, isLoading: isProductDetailsLoading, refetch: refetchProducts }] = useProductDetailsMutation();
  const [removeFromWishlist, { isLoading: removeWishlistLoading, isError: removeWishlistIsError, isSuccess: removeWishlistSuccess, error: removeFromWishlistError }] = useUpdateWishlistMutation()

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await productDetails({ userId: userDetails?._id, itemId: item.itemId }).unwrap();
        // console.log(response, "==========================");
        setAllProductDetails(response)
        // console.log(allProductDetails, "+++++++++++++++++++++++++");
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      }
    };

    if (userDetails?._id && item?.itemId) {
      fetchProductDetails();
    }
  }, [userDetails?._id, item?.itemId, productDetails,]);





  const handleWishListButton = async () => {
    if (isGuest) {
      navigation.navigate('AuthTabNavigator');
    } else {
      // if (!isPressed) {
      try {
        if (allProductDetails.isWishlist) {
          // Remove from wishlist
          const response = await removeFromWishlist({ userId: userDetails?._id, itemId: item.itemId }).unwrap();
          setAllProductDetails(response)
          // setIsPressed(false);
          Toast.show({
            type: 'error',
            text1: 'Removed',
            text2: 'Removed from WishList 👋',
          });
        } else {
          // Add to wishlist
          const response = await addToWishlist({ userId: userDetails?._id, itemId: item.itemId }).unwrap();
          setAllProductDetails(response)
          // setIsPressed(true);
          Toast.show({
            type: 'success',
            text1: 'Added',
            text2: 'Added to WishList 👋',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Failed to ${allProductDetails.isWishlist ? 'remove from' : 'add to'} wishlist 👋`,
        });
      }
      // }
    }
  };


  const handleAddToCart = async () => {
    try {
      if (isGuest) {
        // Guest Cart 
        const guestCart = await AsyncStorage.getItem('guestCart');
        let cartItems = guestCart ? JSON.parse(guestCart) : [];
        const existingItemIndex = cartItems?.findIndex((cartItem) => cartItem.itemId === item.itemId);
        if (existingItemIndex > -1) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          const modifiedItem = { ...item, itemname: item.name, price: parseFloat(item.price) };
          cartItems.push({ ...modifiedItem, quantity });
        }
        await AsyncStorage.setItem('guestCart', JSON.stringify(cartItems));
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'Added To Cart 👋',
        });

        // LogedIn User Cart
      } else {
        const response = await addCart({
          product: { itemId: item.itemId },
          userId: userDetails?._id,
          quantity: quantity,
        }).unwrap();
        // console.log('Response Is:', response);
        Toast.show({
          type: 'success',
          text1: 'Added',
          text2: 'Added To Cart 👋',
        });
      }
      navigation.navigate('Home');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  if (isProductDetailsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={Colors.primary} size={50} />
      </View>
    )
  }

  if (isProductError) {
    console.log(isProductError);
    let errorMessage = 'An error occurred while fetching the cart items.';

    if (isProductError.status === 'FETCH_ERROR') {
      errorMessage = 'Network error: Please check your internet connection.';
    } else if (isProductError.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (isProductError.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (isProductError.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{isProductError.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20 }]}>{isProductError}</Text>
        <CButton label='Reload' mode='contained' onPress={refetchProducts} />
      </View>
    )
  }


  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      <View style={{ flex: 1, }}>

        {/* Image  */}
        <View style={styles.productImage}>
          <Avatar.Image
            size={dimensions.vw * 55}
            source={productImage} />
          <View style={{ flexDirection: "row", alignItems: 'flex-start', marginHorizontal: 10, }}>
            <Text style={[textVariants.textHeading2, { textAlign: 'center', width: dimensions.vw * 60, }]}>{allProductDetails?.itemname}</Text>

            {allProductDetails.feedback > 0 &&
              <View style={{ flexDirection: 'row' }}>
                <Text style={[textVariants.textMainHeading, {}]}> {Number(allProductDetails.feedback).toFixed(1)}</Text>
                <StarRatingDisplay
                  maxStars={1}
                  rating={1}
                  starSize={dimensions.vw * 6}
                  color='#EFB23D'
                />
              </View>
            }

            <View style={{ borderStartWidth: 2, borderColor: Colors.gray }}>
              <IconButton
                icon={allProductDetails.isWishlist ? require('../../../../../assets/images/heart.png') : require('../../../../../assets/images/wishlistIcon2.png')}
                iconColor={allProductDetails.isWishlist ? '#E34F4F' : Colors.gray}
                size={allProductDetails.isWishlist ? dimensions.vw * 6 : dimensions.vw * 5.5}
                onPress={handleWishListButton}
                style={{ margin: -4, }}
              />
            </View>

          </View>
          <Text style={[textVariants.textHeading, { fontFamily: "Montserrat Bold", }]}>₹ {allProductDetails.price}</Text>
        </View>

        {/*  Description  */}
        <View style={styles.description}>
          <View>
            <Text style={[textVariants.textHeading, { fontSize: dimensions.vw * 4.2 }]} >Description</Text>
            <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 4, marginTop: 6.7 }]}>
              {allProductDetails?.itemdescription}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <View style={styles.addMinusIcon}>
              <IconButton
                icon={minusIcon}
                size={dimensions.vw * 4.3}
                iconColor={Colors.primary}
                onPress={() => setQuantity(quantity - 1)}
                disabled={quantity === 1}
              />
              <Text style={[textVariants.textMainHeading, { color: Colors.gray }]}>{quantity}</Text>
              <IconButton
                icon={addIcon}
                size={dimensions.vw * 4.3}
                iconColor={Colors.primary}
                onPress={() => setQuantity(quantity + 1)}
              />
            </View>
            <CButton
              label='Add To Cart'
              mode='contained'
              onPress={handleAddToCart}
              disabled={isLoading === true}
            />
            {isLoading ? (
              <View style={{ position: 'absolute', left: 215 }}>
                <ActivityIndicator animating={true} color={Colors.primary} size={'large'} />
              </View>) : null}

          </View>
        </View>

      </View>

    </ImageBackground>
  )
}

export default OrderDescription

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  productImage: {
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 33,
    flex: 1,
    borderBottomColor: Colors.grayDim,
    borderBottomWidth: 1,
    marginHorizontal: 20
  },
  description: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 30,
    justifyContent: 'space-between'
  },
  addMinusIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: Colors.primary
  },
  buttonsContainer: {
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-evenly'
  }

})