/////client/mobile-native/src/screens/LoginScreen.tsx`typescript

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Fingerprint } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AuthService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const authService = new AuthService();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const { setUser } = useAuth();

  // Google OAuth
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  // Facebook OAuth
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
  });

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const available = await authService.isBiometricAvailable();
    setBiometricAvailable(available);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await authService.biometricLogin();
      setUser(result.user);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googlePromptAsync();
    if (result?.type === 'success') {
      const { authentication } = result;
      try {
        const data = await authService.loginWithGoogle(authentication.idToken!);
        setUser(data.user);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleFacebookLogin = async () => {
    const result = await fbPromptAsync();
    if (result?.type === 'success') {
      const { authentication } = result;
      try {
        const data = await authService.loginWithFacebook(authentication.accessToken);
        setUser(data.user);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const data = await authService.loginWithApple(credential.identityToken!);
      setUser(data.user);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    
      Etincel
      Find your spark

      

      

      
        
          {loading ? 'Logging in...' : 'Log In'}
        
      

      {biometricAvailable && (
        
          
          Login with Biometrics
        
      )}

      
        
        OR
        
      

      
        Continue with Google
      

      
        Continue with Facebook
      

      {AppleAuthentication.isAvailableAsync() && (
        
      )}
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff4458',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff4458',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ff4458',
    borderRadius: 8,
    marginBottom: 20,
  },
  biometricText: {
    color: '#ff4458',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    height: 50,
    marginTop: 10,
  },
});