import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/firestore';

const AddProducts = () => {
  const [prodcutName, setProductName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [imageData, setImageData] = useState({
    assets: [
      {
        uri: '',
      },
    ],
  });

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        openGallery();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = async () => {
    
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (!res.didCancel) {
      setImageData(res);
    }
  };

  const saveProduct = async () => {
    const name = await AsyncStorage.getItem('NAME');
    const userId = await AsyncStorage.getItem('USERID');

    const productId = uuid.v4();
    const reference = storage().ref(imageData.assets[0].fileName);

    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log(url);
    firestore()
      .collection('products')
      .doc(productId)
      .set({
        productId: productId,
        userId: userId,
        addedBy: name,
        prodcutName: prodcutName,
        desc: desc,
        price: price,
        discountPrice: discountPrice,
        inStock: inStock,
        productImage: url,
      })
      .then(res => {
        setVisible(false);
      })
      .catch(error => {
        setVisible(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        {imageData.assets[0].uri == '' ? (
          <TouchableOpacity
            onPress={() => {
              requestCameraPermission();
            }}>
            <Image
              source={require('../assets/images/camera.png')}
              style={styles.camera}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.banner}
            onPress={() => {
              requestCameraPermission();
            }}>
            <Image
              source={{uri: imageData.assets[0].uri}}
              style={styles.banner}
            />
          </TouchableOpacity>
        )}
      </View>
      <CustomTextInput
        placeholder={'Product Name'}
        value={prodcutName}
        onChangeText={txt => {
          setProductName(txt);
        }}
      />
      <CustomTextInput
        placeholder={'Description'}
        value={desc}
        onChangeText={txt => {
          setDesc(txt);
        }}
      />
      <CustomTextInput
        placeholder={'Price'}
        type={'number-pad'}
        value={price}
        onChangeText={txt => {
          setPrice(txt);
        }}
      />
      <CustomTextInput
        placeholder={'Discount Price'}
        type={'number-pad'}
        value={discountPrice}
        onChangeText={txt => {
          setDiscountPrice(txt);
        }}
      />
      <View style={styles.stock}>
        <Text>In Stock</Text>
        <Switch
          value={inStock}
          onChange={() => {
            setInStock(!inStock);
          }}
        />
      </View>
      <CustomButton
        title={'Save Product'}
        onClick={() => {
          saveProduct();
        }}
      />
    </View>
  );
};

export default AddProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageView: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stock: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  camera: {
    width: 100,
    height: 100,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
});
