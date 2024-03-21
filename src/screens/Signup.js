import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Loader from '../components/Loader';

const Signup = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerUser = () => {
    setVisible(true);
    const userId = uuid.v4();
    firestore()
      .collection('Users')
      .doc(userId)
      .set({
        name: name,
        email: email,
        phone: phone,
        password: password,
        confirmPassword: confirmPassword,
      })
      .then(res => {
        setVisible(false);
        console.log('User Created Succesfully');
        navigation.goBack();
      })
      .catch(error => {
        setVisible(false);
        console.log(error);
      });
  };

  const validate = () => {
    let valid = true;
    if (name == '') {
      valid = false;
    }
    if (email == '') {
      valid = false;
    }
    if (phone == '' || phone.length < 10) {
      valid = false;
    }
    if (password == '') {
      valid = false;
    }
    if (confirmPassword == '') {
      valid = false;
    }
    if (password !== confirmPassword) {
      valid = false;
    }
    return valid;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/banner.jpg')}
        style={styles.banner}
      />
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          navigation.goBack('Login');
        }}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <CustomTextInput
          placeholder={'Enter Name'}
          value={name}
          onChangeText={txt => setName(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Email'}
          value={email}
          onChangeText={txt => setEmail(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Phone'}
          type={'number-pad'}
          value={phone}
          onChangeText={txt => setPhone(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Password'}
          value={password}
          onChangeText={txt => setPassword(txt)}
        />
        <CustomTextInput
          placeholder={'Enter Confirm Password'}
          value={confirmPassword}
          onChangeText={txt => setConfirmPassword(txt)}
        />
        <CustomButton
          title={'Sign Up'}
          onClick={() => {
            if (validate()) {
              registerUser();
            } else {
              Alert.alert('Please Enter your Data');
            }
          }}
        />
      </View>
      <Loader visible={visible} />
    </View>
  );
};

export default Signup;
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
  backBtn: {
    justifyContent: 'center',
    alignContent: 'center',
    position: 'absolute',
    borderRadius: 10,
    top: 20,
    left: 20,
  },
});
