import { FlatList, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Avatar, Icon, Searchbar, } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { textVariants } from '../../../../theme/StyleVarients'
import { Colors } from '../../../../theme/Colors'
import LinearHeader from '../../../../components/LinearHeader'
import { CravingsCard } from './CravingsCard'
import SpecialThaliCard from './SpecialThaliCard'
import AdditionalThaliCard from './AdditionalThaliCard'
import dimensions from '../../../../theme/Dimensions'
import { useAppSelector } from '../../../../store/hooks'
import { useLoginUserMutation } from '../../../auth/api/authlogin'
import { useTextResponseQuery } from './text'
import { useGetMenuItemsQuery } from '../../../api/menu'
import CsmallButton from '../../../../components/CsmallButton'
import CButton from '../../../../components/CButton'

const HomeScreen = () => {
  const background = require("../../../../../assets/images/fullbackground.png")
  const demoprofilePic = require("../../../../../assets/images/advisoryicon.png")
  // const menuItems = useAppSelector((state) => state.persistedReducer.menuSlice.menuItems);
  const userDetails = useAppSelector((state) => state.persistedReducer.userDetailsSlice.userDetails);
  const { isAuthenticated, isGuest } = useAppSelector((store) => store.persistedReducer.authSlice);
  const [specialThaliItems, setpecialThaliItems] = useState([]);
  const [additionalDishes, setadditionalDishes] = useState([]);
  const [dessertsdata, setdessertsData] = useState([]);

  // Text api Call *Temporary Code*
  // const { data: test, error, isLoading } = useTextResponseQuery();
  const { data: menuItems, isLoading: isMenuLoading, isSuccess, isError, isFetching, error, refetch } = useGetMenuItemsQuery({}, {
    refetchOnMountOrArgChange: true, // Automatically refetch on component mount or when arguments change
    refetchOnReconnect: true, // Automatically refetch on reconnect
    refetchOnFocus: true, // Automatically refetch on focus
  });



  // Special Thali Data
  useEffect(() => {
    if (menuItems && menuItems.items) {
      const extractedItems = menuItems.items.slice(0, 15).map((item) => ({
        itemId: item.itemid,
        name: item.itemname,
        price: item.price,
        description: item.itemdescription,
        image: item.item_image_url,
        category: item.item_categoryid,
      }));
      setpecialThaliItems(extractedItems);
      // console.log('Special Thali Items:', specialThaliItems);
    } else {
      console.log('No items found in menuItems or menuItems does not exist.');
    }
  }, [menuItems]);

  // Additional Dishes data
  useEffect(() => {
    if (menuItems && menuItems.items) {
      const extractedItems = menuItems.items.slice(16, 30).map((item) => ({
        itemId: item.itemid,
        name: item.itemname,
        price: item.price,
        description: item.itemdescription,
        image: item.item_image_url,
        category: item.item_categoryid,
      }));
      setadditionalDishes(extractedItems);
      // console.log('Additional dishes :', additionalDishes);
    } else {
      console.log('No items found in menuItems or menuItems does not exist.');
    }
  }, [menuItems]);

  // Desserts Data 
  useEffect(() => {
    if (menuItems && menuItems.items) {
      const extractedItems = menuItems.items.slice(31, 45).map((item) => ({
        itemId: item.itemid,
        name: item.itemname,
        price: item.price,
        description: item.itemdescription,
        image: item.item_image_url,
        category: item.item_categoryid,
      }));
      setdessertsData(extractedItems);
      // console.log('Special Thali Items:', dessertsdata);
    } else {
      console.log('No items found in menuItems or menuItems does not exist.');
    }
  }, [menuItems]);



  const navigation = useNavigation()
  const MenuScreenNavigation = () => {
    navigation.navigate('MenuScreen');
  };

  const handleProductPress = (item) => {
    // console.log(item)
    navigation.navigate('OrderDescription', { item });
  };


  // const [selectedValue, setSelectedValue] = useState('');
  // const handleDropdownChange = (value) => {
  //   setSelectedValue(value);
  // };
  const [searchQuery, setSearchQuery] = useState('');
  const cravingrenderItem = ({ item }) => {
    if (!item?.name) {
      return <View style={{ flex: 1 }} />;
    }
    const cardProps = {
      title: item.name,
      description: item.description,
      price: item.price,
      // imageSource: item.imageSource,
      imageSource: require('../../../../../assets/images/wanzwanThali.png'),
      onPress: () => handleProductPress(item),
      index: item.id,
      padding: 20,
      marginBottom: 30,
      style: {}
    };
    return (<CravingsCard  {...cardProps} />);
  };

  const specialTramiRender = ({ item }) => {
    if (!item?.name) {
      return <View style={{ flex: 1, }} />;
    }
    return (
      <SpecialThaliCard
        onPress={() => handleProductPress(item)}
        title={item.name}
        price={item.price}
        // imageSource={item.imageSource}
        imageSource={require('../../../../../assets/images/soanPlateImage.png')}

      />);
  };

  const additionalPropularDishesRender = ({ item }) => {
    if (!item?.name) {
      return <View style={{ flex: 1 }} />;
    }
    return (
      <AdditionalThaliCard
        onPress={() => handleProductPress(item)}
        title={item.name}
        quantity={item.quantity}
        price={item.price}
        // imageSource={item.imageSource}
        imageSource={require('../../../../../assets/images/rista.png')}
      />);
  };

  // For Text Purpose
  const handleText = () => {
    console.log(test)
  }


  if (isMenuLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <ActivityIndicator animating={true} color={Colors.primary} size={50} />
      </View>
    )
  }


  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={textVariants.bigheading}>Fetching Your Data</Text>
      </View>
    )
  }

  if (isError) {
    console.log(error);
    let errorMessage = 'An error occurred while fetching the menu items.';

    if (error.status === 'FETCH_ERROR') {
      errorMessage = 'Network error: Please check your internet connection.';
    } else if (error.status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing server response.';
    } else if (error.originalStatus === 404) {
      errorMessage = 'Menu items not found.';
    } else if (error.originalStatus === 500) {
      errorMessage = 'Server error: Please try again later.';
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[textVariants.textHeading, { paddingBottom: 20 }]}>{error.status}</Text>
        <Text style={[textVariants.headingSecondary, { paddingBottom: 20 }]}>{errorMessage}</Text>
        <CButton label='Reload' mode='contained' onPress={refetch} />
      </View>
    )
  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.logoBackground}
      >
        <LinearHeader />

        {/* Main View of Whole page  */}
        <View style={{ marginHorizontal: 16 }}>

          {/* DropDown for Location and Profile Pic */}
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            {isGuest ?
              (
                <TouchableOpacity onPress={() => console.warn("hello")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    source={require('../../../../../assets/images/loctionPin.png')}
                    size={dimensions.vw * 4}
                  />
                  <Text style={[textVariants.headingSecondary, { fontSize: dimensions.vw * 4.8, paddingStart: 5 }]}>Location</Text>
                </TouchableOpacity>)
              :
              (<View>
                <TouchableOpacity onPress={() => console.warn("hello")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    source={require('../../../../../assets/images/loctionPin.png')}
                    size={dimensions.vw * 4}
                  />
                  <Text style={[textVariants.headingSecondary, { fontSize: dimensions.vw * 4.8, paddingStart: 5 }]}>Location</Text>
                </TouchableOpacity>
                <Text style={[textVariants.textSubHeading, { fontSize: dimensions.vw * 3.9, color: Colors.grayDim }]}>Rajori kadal , Srinagar 190006</Text>
              </View>)}

            <Pressable onPress={MenuScreenNavigation}>
              <Avatar.Image
                source={userDetails?.imageUrl ? { uri: userDetails.imageUrl } : demoprofilePic}
                // size={46}
                size={dimensions.vw * 10}
              />
            </Pressable>
          </View>

          {/* Search Bar On Top */}
          <View >
            <Searchbar
              placeholder="Search for ‘Wazwan’"
              onChangeText={setSearchQuery}
              value={searchQuery}
              iconColor={Colors.gray}
              rippleColor={Colors.primary}
              traileringIcon={require('../../../../../assets/images/micIcon.png')}
              traileringIconColor={Colors.primary}
              style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.grayDim, marginTop: 25, }}
              placeholderTextColor={Colors.gray}
              onTraileringIconPress={handleText}
              inputStyle={{ color: Colors.gray, }}
            // icon={() => <></>}
            />
          </View>

          {/* Welcome Offer */}
          <View style={{ marginTop: 30, borderBottomWidth: 1, borderBottomColor: Colors.grayDim }}>
            <Text style={textVariants.headingSecondary}>Welcome Offer</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
              <Text style={[textVariants.bigheading, { marginTop: 5, width: dimensions.vw * 70, }]}>Get 25% Off & free delivery</Text>
              <Image source={require('../../../../../assets/images/giftBox.png')}
                style={{
                  height: dimensions.vh * 9.5,
                  width: dimensions.vw * 18
                }}
              />

            </View>
            <Text style={[textVariants.textSubHeading, { marginBottom: 20 }]}>on your first order on JJ Foods!</Text>
          </View>

          {/* What are you craving for ? */}
          <Text style={[textVariants.textHeading, { marginTop: 24, }]}>What are you craving for?</Text>
          <View style={{
            height: 314,
            // height: dimensions.vh * 36,
            borderBottomWidth: 1, borderBottomColor: Colors.grayDim
          }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={additionalDishes}
              renderItem={cravingrenderItem}
              keyExtractor={(item) => item.itemId}
            />
          </View>

          {/* Special Thali */}
          <Text style={[textVariants.textHeading, { marginTop: 24, }]}>Special Thali’s</Text>
          <View style={{ height: 311, marginTop: 11, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              // data={specialTramidata}
              data={specialThaliItems}
              renderItem={specialTramiRender}
              keyExtractor={(item) => item.itemId}
            />
          </View>

          {/* Additional Popular Dishes */}
          <Text style={[textVariants.textHeading, { marginTop: 27, }]}>Additional-Popular Dishes</Text>
          <View style={{ marginTop: 7, borderBottomWidth: 1, borderBottomColor: Colors.grayDim, }} >
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              // data={additionalPropularDishes}
              data={additionalDishes}
              renderItem={additionalPropularDishesRender}
              keyExtractor={(item) => item.itemId}
            />
          </View>

          {/* Desserts */}
          <Text style={[textVariants.textHeading, { marginTop: 24, }]}>Desserts</Text>
          <View style={{ marginTop: 11, }} >
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              // data={Desserts}
              data={dessertsdata}
              renderItem={additionalPropularDishesRender}
              keyExtractor={(item) => item.itemId}
            />
          </View>
        </View>

      </ImageBackground>
    </ScrollView >
  )
}

export default HomeScreen

const styles = StyleSheet.create({

  logoBackground: {
    flex: 1,
  },
})