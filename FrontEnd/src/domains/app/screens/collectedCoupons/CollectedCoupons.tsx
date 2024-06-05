import React from 'react';
import { Image, ImageBackground, FlatList, StyleSheet, Text, View } from 'react-native';
import { textVariants } from '../../../../theme/StyleVarients';
import LinearHeader from '../../../../components/LinearHeader';
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';
import CCard from '../../../../components/CCard';
import { useAppSelector } from '../../../../store/hooks';
import CButton from '../../../../components/CButton';
import { useGetAvailableCouponsQuery } from '../cart/api/availableCoupons';

interface CouponItemProps {
  // data: AvailableCoupon;
}

// const demoCoupons = [
//   { id: 1, title: "10% off", description: "Nothing", code: "A#PBLDLX" },
//   { id: 2, title: "20% off", description: "Heloo sir  ", code: "A#PBLDLX" },
//   { id: 3, title: "30% off", description: "Don't Worry Just Get Your Discount ", code: "A#PBLDLX" },
//   { id: 4, title: "30% off", description: "Get the most out of it and offer is valid only for 3 days , to get this offer apply now other wise you will not be able to do that ", code: "A#PBLDLX" },
//   { id: 5, title: "30% off", description: "Don't Worry Just Get Your Discount ", code: "A#PBLDLX" },
//   { id: 6, title: "30% off", description: "Don't Worry Just Get Your Discount ", code: "A#PBLDLX" },
// ]

const CouponItem: React.FC<any> = ({ data }) => (
  <CCard style={{ marginHorizontal: 0, marginTop: 16, }}>
    <View style={{ flexDirection: 'row', }}>

      <Image
        source={require('../../../../../assets/images/cashIcon.png')}
        style={{ height: 30, width: 30, margin: 10 }}
        resizeMode='contain'
      />
      <View style={{ marginTop: 12, }}>
        <Text style={styles.heading}>{data.title}</Text>
        <Text style={[styles.subHeading, { paddingTop: 5, width: dimensions.vw * 75, }]}>{data.description}</Text>
        <View style={{ borderColor: Colors.gray, borderWidth: 1, borderRadius: 4, marginVertical: 10, alignItems: 'center', width: dimensions.vw * 40 }}>
          <Text style={[styles.subHeading, { color: Colors.gray, padding: 5 }]}>{data.code}</Text>
        </View>

      </View>
    </View>
    <View style={{ borderTopWidth: 1, borderStyle: 'dashed', borderColor: Colors.grayDim }} />
    <CButton label='TAP To APPLY' mode='text' onPress={() => console.log("Nothing")} />
  </CCard>
);

const CollectedCoupons: React.FC = () => {
  const background = require("../../../../../assets/images/fullbackground.png");
  const cartImage = require("../../../../../assets/images/emptyCouponsIcon.png");

  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;
  const { data: coupons, error, isLoading } = useGetAvailableCouponsQuery({ userId });


  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.logoBackground}
    >
      <LinearHeader />
      <View style={{ flex: 1, marginBottom: 15 }}>
        {coupons?.length ? (
          <View style={{ flex: 1, marginTop: 30, marginHorizontal: 18 }}>
            <Text style={[textVariants.SecondaryHeading, { color: Colors.gray }]}>Best Offers For You</Text>
            <FlatList
              data={coupons}
              // keyExtractor={(item) => item._id}
              renderItem={({ item }) => <CouponItem data={item} />}
            />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={cartImage} style={styles.logo} resizeMode="contain" />
            <Text style={styles.noOrderText}>No Coupons Yet!</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default CollectedCoupons;

const styles = StyleSheet.create({
  logoBackground: {
    flex: 1,
  },
  logo: {
    width: dimensions.vw * 28,
    height: dimensions.vw * 32,
    margin: 40,
  },
  noOrderText: {
    fontSize: dimensions.vw * 5.6,
    color: Colors.grayDim,
    fontFamily: 'Montserrat SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },
  heading: {
    fontSize: dimensions.vw * 3.8,
    // fontSize: 16,
    color: Colors.black,
    fontFamily: "Montserrat Bold",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: dimensions.vw * 3.3,
    // fontSize: 14,
    color: Colors.primary,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
  },
});
