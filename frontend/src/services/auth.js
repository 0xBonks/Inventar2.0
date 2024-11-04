import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

class AuthService {
  async login(credentials) {
    try {
      console.log('Login attempt:', credentials.email);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        this.setSession(response.data);
      }
      return response.data;
    } catch (error) {
      const errorData = error.response && error.response.data ? error.response.data : error.message;
      console.error('Login error:', errorData);
      throw error;
    }
  }

  async register(userData) {
    try {
      console.log('Registration attempt:', userData);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration response:', response.data);
      return response;
    } catch (error) {
      const errorData = error.response && error.response.data ? error.response.data : error.message;
      console.error('Registration error:', errorData);
      throw error;
    }
  }

  setSession(authResult) {
    const expiresAt = new Date().getTime() + (authResult.expiresIn || 86400) * 1000;

    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('expiresAt', expiresAt.toString());
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const expiresAt = localStorage.getItem('expiresAt');
    return new Date().getTime() < parseInt(expiresAt || '0');
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService(); 