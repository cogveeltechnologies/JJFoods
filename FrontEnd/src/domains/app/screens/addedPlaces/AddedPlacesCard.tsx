import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import CCard from '../../../../components/CCard';
import { ActivityIndicator, Icon, IconButton, RadioButton } from 'react-native-paper';
import { Colors } from '../../../../theme/Colors';
import { textVariants } from '../../../../theme/StyleVarients';
import dimensions from '../../../../theme/Dimensions';
import { useDefaultAddedPlaceMutation } from './apis/changeDefaultPlaces';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useGetAllAddedPlacesQuery } from './apis/getAllAddedPlaces';
import { setDeliveryAddressId } from '../cart/slices/deliveryAddressIdSlice';
import { useFocusEffect } from '@react-navigation/native';

interface AddedPlacesCardProps {
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleSelect?: (item: AddressItem) => void;
}

interface AddressItem {
  _id: string;
  addressType: string;
  address1: string;
  address2: string;
  address3: string;
  phoneNumber: number;
  isDefault: boolean;
}

const AddedPlacesCard: React.FC<AddedPlacesCardProps> = ({ handleEdit, handleDelete, handleSelect }) => {
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const userId = userDetails?._id;
  const { data, isLoading, isError, isSuccess, refetch } = useGetAllAddedPlacesQuery({ userId }, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });
  const [mutate, { isLoading: mutateLoading, isError: mutateError, error: mutateErrorData }] = useDefaultAddedPlaceMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<string | null>(null);
  const [savedPlaces, setSavedPlaces] = useState([])
  const dispatch = useAppDispatch()
  const addressIdDelivery = useAppSelector((state) => state.persistedReducer.deliveryAddressIdSlice.deliveryAddressId)

  useEffect(() => {
    if (data) {
      setSavedPlaces(data);
    }
  }, [data,]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    if (savedPlaces.length > 0) {
      const sortedData = [...savedPlaces].sort((a, b) => (b.isDefault ? 1 : -1));
      const defaultAddress = sortedData.find(address => address.isDefault) || sortedData[0];
      setSelectedId(defaultAddress._id);
      setChecked(defaultAddress._id);
      if (handleSelect) handleSelect(defaultAddress);
    }
  }, [savedPlaces, refetch]);


  const handleRadioPress = async (addressId: string) => {
    try {
      // console.log(addressId, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      const response = await mutate({ addressId, userId });
      setSavedPlaces(response.data);
      setSelectedId(addressId);
      setChecked(addressId);
      dispatch(setDeliveryAddressId(addressId));
      // console.log(addressIdDelivery, 'iddddddddddiddddddddddddddddddddddd')
      if (handleSelect) handleSelect(response.data.find(address => address._id === addressId) || null);
    } catch (error) {
      console.error('Error fetching new address details:', error);
    }
  };




  const renderItem = ({ item }: { item: AddressItem }) => {
    let iconSource = '';
    switch (item.addressType?.toLowerCase()) {
      case 'home':
        iconSource = require('../../../../../assets/images/homeAddressIcon.png');
        break;
      case 'work':
        iconSource = require('../../../../../assets/images/workAddressIcon.png');
        break;
      case 'hotel':
        iconSource = require('../../../../../assets/images/hotelIcon.png');
        break;
      case 'other':
        iconSource = require('../../../../../assets/images/otherIcon.png');
        break;
    }

    const isSelected = item._id === selectedId;




    return (
      <CCard
        style={{
          marginHorizontal: 0,
          marginTop: 0,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: isSelected ? Colors.primary : 'transparent'
        }}>
        <TouchableOpacity
        // onPress={() => handleRadioPress(item._id)}
        >
          <View style={{ flexDirection: 'row', flex: 1 }}>

            <View style={{ marginTop: 10, }}>
              <Icon
                source={iconSource}
                color={Colors.gray}
                size={dimensions.vw * 3.5}
              />
            </View>

            <View style={{ flex: 1, marginStart: 14 }}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <Text style={textVariants.SecondaryHeading}>{item.addressType}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon={require('../../../../../assets/images/editIcon.png')}
                    iconColor={Colors.primary}
                    size={dimensions.vw * 3.7}
                    onPress={() => handleEdit(item._id)}
                    style={{ margin: 0 }}
                  />
                  <IconButton
                    icon={require('../../../../../assets/images/deleteIcon.png')}
                    iconColor={Colors.primary}
                    size={dimensions.vw * 3.7}
                    onPress={() => handleDelete(item._id)}
                    style={{ margin: 0 }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <View>
                  <Text style={[textVariants.textSubHeading, { width: dimensions.vw * 60 }]}>
                    {item.address1},
                    {item.address2},
                    {item.address3}
                  </Text>
                  <Text style={[textVariants.buttonTextHeading,
                  { color: Colors.black, paddingVertical: 8 }]}>PhoneNumber: {item.phoneNumber}</Text>
                </View>

                <RadioButton
                  value={item._id}
                  status={checked === item._id ? 'checked' : 'unchecked'}
                  onPress={() => handleRadioPress(item._id)}
                />

              </View>

            </View>
          </View>
        </TouchableOpacity>
      </CCard>
    );
  };



  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator animating={true} color={Colors.primary} size={50} />
        <Text style={textVariants.textSubHeading}>Loading.....</Text>

      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={textVariants.textSubHeading}>Failed to load addresses. Please try again </Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <FlatList
      data={[...savedPlaces].sort((a, b) => (b.isDefault ? 1 : -1))}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

export default AddedPlacesCard;

const styles = StyleSheet.create({
  cardStyle: {},
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    color: Colors.primary,
    marginTop: 10,
  },
});
