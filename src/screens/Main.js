import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Products from '../tabs/Products';
import Orders from '../tabs/Orders';
import {THEME_COLOR} from '../assets/Colors';
import {useNavigation} from '@react-navigation/native';

const Main = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={styles.container}>
      {selectedTab == 0 ? <Products /> : <Orders />}
      <View style={styles.bottomView}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(0);
          }}>
          <Image
            source={require('../assets/images/products.png')}
            style={[
              styles.icons,
              {tintColor: selectedTab == 0 ? 'black' : 'grey'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddProducts');
          }}>
          <Image
            source={require('../assets/images/add.png')}
            style={styles.add}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(1);
          }}>
          <Image
            source={require('../assets/images/orders.png')}
            style={[
              styles.icons,
              {tintColor: selectedTab == 1 ? 'black' : 'grey'},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 5,
    height: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  icons: {
    width: 35,
    height: 35,
  },
  add: {
    width: 45,
    height: 45,
  },
});
