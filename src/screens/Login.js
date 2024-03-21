import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginUsers = () => {
    firestore()
      .collection('Users')
      .where('email', '==', email)
      .get()
      .then(snapShot => {
        if (snapShot.docs != []) {
          if (snapShot.docs[0].data().password == password) {
            nextScreen(snapShot.docs[0].data());
          }
        }
      });
  };
  const nextScreen = async data => {
    await AsyncStorage.setItem('NAME', data.name);
    await AsyncStorage.setItem('EMAIL', data.email);
    await AsyncStorage.setItem('PHONE', data.phone);
    await AsyncStorage.setItem('USERID', data.userId);
    navigation.navigate('Main');
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/banner.jpg')}
        style={styles.banner}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <CustomTextInput
          placeholder={'Enter Email'}
          value={email}
          onChangeText={txt => setEmail(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Password'}
          value={password}
          onChangeText={txt => setPassword(txt)}
        />
        <CustomButton
          title={'Login'}
          onClick={() => {
            loginUsers();
          }}
        />
        <View style={styles.row}>
          <Text>{"Don't have Account?"}</Text>
          <Text
            style={{
              marginLeft: 10,
              color: 'black',
              fontWeight: '600',
            }}
            onPress={() => navigation.navigate('Signup')}>
            {'Create Account'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 230,
  },
  card: {
    width: '95%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: 170,
    elevation: 5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 25,
    color: 'black',
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
});
