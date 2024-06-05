import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import dimensions from '../../../../theme/Dimensions';
import { Colors } from '../../../../theme/Colors';

const RunningOrders = () => {

  const runningOrders = [
    { id: 1, imageSource: require('../../../../../assets/images/AabGosh.png'), title: 'Aab Gosh', price: '₹399', quantity: "Half", },
    { id: 2, imageSource: require('../../../../../assets/images/AabGosh.png'), title: 'Rista', price: '₹199', quantity: "Full", },
    { id: 3, imageSource: require('../../../../../assets/images/AabGosh.png'), title: 'Gushtaba', price: '₹200', quantity: "One Piece", },

  ];

  const Item = ({ item }) => (
    <View style={{ flexDirection: 'row', marginVertical: 6, }}>
      <Image source={item.imageSource}
        style={{
          width: dimensions.vw * 17.5, height: dimensions.vw * 17.5, marginRight: 10, borderRadius: 10
        }} />

      <View style={{ flex: 1, justifyContent: 'center' }}>

        <View style={{ justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6.6 }}>
          <Text style={[textVariants.buttonTextHeading, { color: Colors.black }]}>{item.title}</Text>
          <Text style={[textVariants.buttonTextHeading, { color: Colors.primary, textAlignVertical: 'auto' }]}>{item.quantity}</Text>
        </View>

        <Text style={[textVariants.buttonTextHeading, { color: Colors.gray }]}>{item.price}</Text>

      </View>
    </View>
  );
  return (
    <FlatList
      data={runningOrders}
      renderItem={({ item }) => <Item item={item} />}
      keyExtractor={item => item.id.toString()}
    />
  );
}

export default RunningOrders

const styles = StyleSheet.create({})