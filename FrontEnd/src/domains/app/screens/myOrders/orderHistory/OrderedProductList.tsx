import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import CCard from '../../../../../components/CCard';
import { textVariants } from '../../../../../theme/StyleVarients';
import { Colors } from '../../../../../theme/Colors';
import CButton from '../../../../../components/CButton';
import dimensions from '../../../../../theme/Dimensions';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useNavigation } from '@react-navigation/native';

const OrderedProductList = ({ item }: any) => {
  const { imageSource, name, price, quantity, orderDate, } = item;
  const [isVisible, setIsVisible] = useState(false)
  const [isRated, setIsRated] = useState(false)
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const navigation = useNavigation<any>()

  const goToCart = () => {
    navigation.navigate('MyCart')
  }
  const handleSubmit = () => {
    if (isVisible) {
      // console.warn("User Feeback :", feedback, "Rating Given :", rating)
      setFeedback('')
      setIsRated(true)
    }
    setIsVisible(!isVisible)
  }



  useEffect(() => {
    console.log(item, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiitem')

  }, [])





  return (
    <CCard style={{ marginHorizontal: 0, padding: 0 }}>
      <View >

        {/* Card with Image and details of item */}
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Image source={imageSource} style={styles.image} />

          <View style={{ flex: 1, marginEnd: 20 }}>

            <View style={styles.detailsView}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.black, paddingBottom: 6 }]}>{name}</Text>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.gray, paddingBottom: 6 }]}>{orderDate}</Text>

            </View>

            <View style={styles.detailsView}>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.gray, }]}> ₹ {price}</Text>
              <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>{quantity}</Text>
            </View>

          </View>

        </View>

        {/* Rating  */}
        {isRated ? (
          <View style={{ marginHorizontal: 26, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[textVariants.buttonTextHeading, { color: Colors.primary }]}>You rated</Text>

            <View style={{ flexDirection: 'row', borderRadius: 10, marginStart: 8, backgroundColor: Colors.primary2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[textVariants.buttonTextHeading, { paddingStart: 10 }]}>{rating}</Text>
              <StarRatingDisplay
                rating={rating}
                maxStars={1}
                color={Colors.white}
                starSize={dimensions.vw * 4.5}
                style={{ padding: 3 }}
              />
            </View>

          </View>) : (<View style={styles.ratingView}>
            <StarRating
              onChange={(rating) => {
                setRating(rating);
                console.log('User rated:', rating);
              }}
              maxStars={5}
              starSize={dimensions.vw * 7}
              rating={rating}
              color='#EFB23D'
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit} >
              <Text style={styles.buttonText}>{isVisible ? "Send Feedback" : "Write Feedback"}</Text>
            </TouchableOpacity>
          </View>)}


        {isVisible ?
          (<View style={{ marginHorizontal: 11, marginBottom: 16 }}>
            <TextInput
              style={styles.input}
              placeholder="Write Feedback"
              placeholderTextColor="gray"
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => { setFeedback(text) }}
              value={feedback}
            />

          </View>) : null}

        <CButton
          label='Order Again'
          mode='text'
          labelStyle={{ color: Colors.gray }}
          style={styles.orderAgainButton}
          onPress={goToCart}
        />

      </View>
    </CCard>
  );
};

export default OrderedProductList;

const styles = StyleSheet.create({
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ratingView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 20
  },
  orderAgainButton: {
    borderTopWidth: 1.2,
    borderTopColor: Colors.gray,
    borderStyle: 'dashed',
    paddingVertical: 5
  },

  image: {
    width: dimensions.vw * 17.2,
    height: dimensions.vw * 17.2,
    borderRadius: 10,
    margin: 20,
  },

  button: {
    backgroundColor: Colors.secondary2,
    borderColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,

  },
  buttonText: {
    // fontSize: 14,
    fontSize: dimensions.vw * 3.3,
    color: Colors.primary,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
    textAlign: 'center'
  },
  input: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 14,
    textAlignVertical: 'top',
    color: Colors.gray,
    fontSize: dimensions.vw * 3.3,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
});

