import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@tours_app_token';
const USER_KEY = '@tours_app_user';

/**
 * Storage utility for authentication data
 */
export const authStorage = {
  /**
   * Save authentication token
   */
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  },

  /**
   * Get authentication token
   */
  async getToken() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Remove authentication token
   */
  async removeToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  },

  /**
   * Save user data
   */
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  /**
   * Get user data
   */
  async getUser() {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Remove user data
   */
  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  },

  /**
   * Clear all authentication data
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },
};
