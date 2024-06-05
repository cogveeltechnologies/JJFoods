import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import dimensions from '../../../../theme/Dimensions';

interface OrderStatusProps {
  OrderStatus: 'processing' | 'ready' | 'onTheWay';
}

const OrderStatus: React.FC<OrderStatusProps> = ({ OrderStatus }) => {

  const getStatusColor = (targetStatus: string) => {
    if (OrderStatus === 'onTheWay') {
      return Colors.primary;
    } else {
      if (OrderStatus === 'processing' && targetStatus === 'processing') {
        return Colors.primary;
      } else if (OrderStatus === 'ready' && targetStatus !== 'onTheWay') {
        return Colors.primary;
      } else {
        return Colors.grayDim;
      }
    }
  };

  const renderStatusText = (displayText: string, active: boolean) => (
    <Text style={[styles.statusText, { color: active ? Colors.black : Colors.grayDim }]}>
      {displayText}
    </Text>
  );

  return (
    <View style={styles.outercontainer}>

      <View style={styles.container}>

        {/* first dot */}
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getStatusColor('processing') }]} />
        </View>

        {/* first line */}
        <View style={[styles.line, { borderTopColor: getStatusColor('readyLine') }]} />

        {/* second dot */}
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getStatusColor('ready') }]} />
        </View>

        {/* second line */}
        <View style={[styles.line, { borderTopColor: getStatusColor('onTheWay') }]} />

        {/* third dot */}
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { backgroundColor: getStatusColor('onTheWay') }]} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {renderStatusText('Processing', OrderStatus === 'processing')}
        {renderStatusText('Ready', OrderStatus === 'ready')}
        {renderStatusText('On the way', OrderStatus === 'onTheWay')}

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  outercontainer: {

  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 20,
    marginHorizontal: dimensions.vw * 5.5,
    marginTop: 24,
  },
  dotContainer: {
    alignItems: 'center',
  },
  dot: {
    // width: 20,
    width: dimensions.vw * 5,
    height: dimensions.vw * 5,
    borderRadius: 50,
    backgroundColor: Colors.grayDim,
    marginHorizontal: 5,
    borderWidth: dimensions.vw * 0.5,
    borderColor: Colors.grayDim
  },
  line: {
    flex: 1,
    borderStyle: 'dashed',
    borderTopWidth: dimensions.vw * 0.6,
  },
  statusText: {
    marginTop: 6,
    fontSize: dimensions.vw * 3.3,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
});

export default OrderStatus;
