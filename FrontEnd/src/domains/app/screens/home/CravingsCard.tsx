import React from 'react';
import { ImageBackground, Platform, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { textVariants } from '../../../../theme/StyleVarients';
import CsmallButton from '../../../../components/CsmallButton';

type CardProps = {
  data: { id: number, name: string }[];
  title: string;
  description?: string;
  price?: string;
  index: string,
  onPress?: () => void;
  imageSource?: any;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const CravingsCard = ({ title, imageSource, description, onPress, price, style }: CardProps) => {

  const containerStyle = [
    styles.container,
    style,
  ];

  return (
    <ImageBackground source={imageSource} style={containerStyle}>
      <View style={{ flex: 1, justifyContent: "flex-end", }}>
        <View style={{ marginStart: 15.44, marginBottom: 5 }}>
          <Text style={[textVariants.buttonText, { fontSize: 24, width: 236 }]}>{title}</Text>
          <Text style={[textVariants.buttonTextSubHeading, { fontSize: 14, width: 236 }]}>{description}</Text>
        </View>

        <LinearGradient
          colors={['#555555', '#2B2B2D', '#1C1D1F', '#252628', '#4A4A4A']}
          style={styles.linearGradient}>
          <Text style={[textVariants.buttonText, { fontSize: 20 }]}> ₹ {price}</Text>
          <TouchableOpacity onPress={onPress}>
            <CsmallButton label="Add" mode="contained" icon={require('../../../../../assets/images/addIcon.png')} type='rightIcon' />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    // width: '60%',
    marginEnd: 6,
    marginTop: 14,
    marginBottom: 11,
    borderRadius: 25,
    elevation: Platform.OS === 'android' ? 5 : 2,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'android' ? 0.5 : 0.4,
    shadowOffset: Platform.OS === 'android' ? { width: 3, height: 3 } : { width: 0, height: 0 },
    shadowRadius: Platform.OS === 'android' ? 3 : 1,
  },

  linearGradient: {
    flexDirection: 'row',
    justifyContent: "space-around",
    alignItems: 'center',
    borderRadius: 25,
    width: 270,
    height: 50
  },
});
