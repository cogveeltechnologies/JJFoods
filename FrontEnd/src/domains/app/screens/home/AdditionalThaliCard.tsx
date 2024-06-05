import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { textVariants } from '../../../../theme/StyleVarients'
import CCard from '../../../../components/CCard'
import { ViewStyle } from 'react-native-size-matters'
import CsmallButton from '../../../../components/CsmallButton'

type CardProps = {
  title: string;
  quantity: string;
  price?: string;
  onPress?: () => void;
  imageSource?: any;
  style?: StyleProp<ViewStyle>;
}

const AdditionalThaliCard = ({ title, price, quantity, imageSource, style, onPress }: CardProps) => {
  return (

    <CCard
      onPress={onPress}
      imageBackground={true}
      imageSource={imageSource}
      whiteBackground={false}
      secondaryBackground={false}
      style={{ height: 155, width: 183, backgroundColor: 'transparent', marginBottom: 18, marginHorizontal: 0, marginEnd: 10 }}
    >
      <View style={{ marginTop: 18, }}  >
        <Text style={[textVariants.buttonTextHeading, { fontSize: 15, }]}>{title}</Text>
        <Text style={[textVariants.buttonTextSubHeading, { fontSize: 11, }]}>{quantity}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1, justifyContent: 'space-evenly', }}>
        <View>
          <CsmallButton mode='outlined' label={price} icon={require('../../../../../assets/images/rupeeIcon.png')} />
        </View>
        <View>
          <CsmallButton
            label='Add'
            type='leftIcon'
            mode='contained'
            onPress={onPress}
            icon={require('../../../../../assets/images/addIcon.png')}
          />
        </View>
      </View>

    </CCard>
  )
}

export default AdditionalThaliCard

const styles = StyleSheet.create({})