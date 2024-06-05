import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton, Icon } from 'react-native-paper';
import { textVariants } from '../../../../theme/StyleVarients';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setOrderPreference } from './slices/orderPreferenceSlice';
import { useNavigation } from '@react-navigation/native';




const OrderPreference = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  // const orderPreference = useAppSelector((state) => state.persistedReducer.orderPreferenceSlice.orderPreference)
  // console.log(orderPreference, "________________________")

  const data = [
    { id: '1', icon: require('../../../../../assets/images/plateIcon.png'), text: 'Eat at Restaurant' },
    { id: '2', icon: require('../../../../../assets/images/pickupIcon.png'), text: 'Pick up from Restaurant' },
    { id: '3', icon: require('../../../../../assets/images/deliveryIcon.png'), text: 'Deliver to my Address' },
  ];

  const [selectedId, setSelectedId] = useState(null);
  const [selectedText, setSelectedText] = useState('');

  const handleRadioButtonPress = (itemId, itemText) => {
    dispatch(setOrderPreference({ id: itemId, orderPreference: itemText }));
    setSelectedId(itemId);
    setSelectedText(itemText);

    if (itemId === '3') {
      navigation.navigate('ManualLocationScreen');
    }
  };

  const renderItem = ({ item }) => {
    const checked = selectedId === item.id;

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleRadioButtonPress(item.id, item.text)}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ marginEnd: 15 }}>
            <Icon
              source={item.icon}
              color={checked ? Colors.primary : Colors.gray}
              size={dimensions.vw * 7}
            />
          </View>
          <Text style={[textVariants.textSubHeading, { color: checked ? Colors.primary : Colors.gray }]}>{item.text}</Text>
        </View>

        <RadioButton
          value={item.id}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonPress(item.id, item.text)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayDim,
  },
});

export default OrderPreference;
