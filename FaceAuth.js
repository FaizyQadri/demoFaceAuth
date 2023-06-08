import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const FaceAuth = () => {
  //   useEffect(() => {
  //     authenticateUser();
  //   }, []);
  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';

  const rnBiometrics = new ReactNativeBiometrics();

  rnBiometrics.isSensorAvailable().then(resultObject => {
    const {available, biometryType} = resultObject;

    if (available && biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported');
    } else if (available && biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported');
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported');
    } else {
      console.log('Biometrics not supported');
    }
  });

  rnBiometrics
    .createSignature({
      promptMessage: 'Sign in',
      payload: payload,
    })
    .then(resultObject => {
      const {success, signature} = resultObject;

      if (success) {
        console.log(signature);
        verifySignatureWithServer(signature, payload);
      }
    });

  rnBiometrics
    .simplePrompt({promptMessage: 'Confirm fingerprint'})
    .then(resultObject => {
      const {success} = resultObject;

      if (success) {
        console.log('successful biometrics provided');
      } else {
        console.log('user cancelled biometric prompt');
      }
    })
    .catch(() => {
      console.log('biometrics failed');
    });

  rnBiometrics.createKeys().then(resultObject => {
    const {publicKey} = resultObject;
    console.log(publicKey);
    sendPublicKeyToServer(publicKey);
  });

  rnBiometrics.deleteKeys().then(resultObject => {
    const {keysDeleted} = resultObject;

    if (keysDeleted) {
      console.log('Successful deletion');
    } else {
      console.log('Unsuccessful deletion because there were no keys to delete');
    }
  });

  rnBiometrics.biometricKeysExist().then(resultObject => {
    const {keysExist} = resultObject;

    if (keysExist) {
      console.log('Keys exist');
    } else {
      console.log('Keys do not exist or were deleted');
    }
  });

  //   const authenticateUser = async () => {
  //     try {
  //       const {available, biometryType} = await Biometrics.isSensorAvailable();

  //       if (!available) {
  //         throw new Error('Face authentication is not available on this device.');
  //       }

  //       const {success} = await Biometrics.simplePrompt(
  //         'Authenticate to access the app.',
  //       );

  //       if (success) {
  //         // Authentication successful
  //         console.log('Authentication successful');
  //         const credentials = {username: 'example', password: '123456'};
  //         await saveCredentials(credentials);
  //         const retrievedCredentials = await getCredentials();
  //         console.log('Retrieved credentials:', retrievedCredentials);
  //       } else {
  //         // Authentication failed
  //         console.log('Authentication failed');
  //       }
  //     } catch (error) {
  //       console.log('Error:', error);
  //     }
  //   };

  const saveCredentials = async credentials => {
    try {
      await Keychain.setGenericPassword(
        'appCredentials',
        JSON.stringify(credentials),
      );
      console.log('Credentials saved successfully');
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const getCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return JSON.parse(credentials.password);
      } else {
        console.log('No credentials stored');
        return null;
      }
    } catch (error) {
      console.log('Error retrieving credentials:', error);
      return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
      }}>
      <Text
        style={{
          color: 'red',
          fontSize: 24,
        }}>
        Face Authentication
      </Text>
    </View>
  );
};

export default FaceAuth;
