///COMPLETE MOBILE APP WITH BIOMETRICS
///`client/mobile-native/src/services/authService.tstypescript

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { apiClient } from './apiClient';

export class AuthService {
  // Check biometric support
  async isBiometricAvailable(): Promise {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  // Enable biometric login
  async enableBiometricLogin(userId: string) {
    const available = await this.isBiometricAvailable();
    if (!available) {
      throw new Error('Biometric authentication not available');
    }

    await AsyncStorage.setItem('biometric_enabled', 'true');
    await AsyncStorage.setItem('biometric_user_id', userId);
  }

  // Authenticate with biometrics
  async authenticateWithBiometric(): Promise {
    const enabled = await AsyncStorage.getItem('biometric_enabled');
    if (enabled !== 'true') return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access Etincel',
      fallbackLabel: 'Use passcode',
    });

    return result.success;
  }

  // Login with biometrics
  async biometricLogin() {
    const authenticated = await this.authenticateWithBiometric();
    if (!authenticated) {
      throw new Error('Biometric authentication failed');
    }

    const userId = await AsyncStorage.getItem('biometric_user_id');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    // Refresh tokens
    const response = await apiClient.post('/api/v1/auth/refresh', {
      refreshToken,
    });

    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

    return response.data;
  }

  // Regular login
  async login(email: string, password: string) {
    const response = await apiClient.post('/api/v1/auth/login', {
      email,
      password,
    });

    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('userId', response.data.user.id);

    return response.data;
  }

  // OAuth login
  async loginWithGoogle(idToken: string) {
    const response = await apiClient.post('/api/v1/auth/oauth/google', {
      idToken,
    });

    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('userId', response.data.user.id);

    return response.data;
  }

  async loginWithFacebook(accessToken: string) {
    const response = await apiClient.post('/api/v1/auth/oauth/facebook', {
      accessToken,
    });

    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('userId', response.data.user.id);

    return response.data;
  }

  async loginWithApple(identityToken: string) {
    const response = await apiClient.post('/api/v1/auth/oauth/apple', {
      identityToken,
    });

    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('userId', response.data.user.id);

    return response.data;
  }

  async logout() {
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'userId',
      'biometric_enabled',
      'biometric_user_id',
    ]);
  }
}