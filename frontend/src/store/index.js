import Vue from 'vue'
import Vuex from 'vuex'
import { inventory } from '../services/api'
import AuthService from '../services/auth'
import io from 'socket.io-client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: AuthService.getStoredUser(),
    token: AuthService.getToken(),
    inventory: [],
    loading: false,
    error: null,
    socket: null,
    searchQuery: ''
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory
    },
    ADD_INVENTORY_ITEM(state, item) {
      state.inventory.push(item)
    },
    UPDATE_INVENTORY_ITEM(state, updatedItem) {
      const index = state.inventory.findIndex(item => item.item_id === updatedItem.item_id)
      if (index !== -1) {
        Vue.set(state.inventory, index, updatedItem)
      }
    },
    REMOVE_INVENTORY_ITEM(state, itemId) {
      state.inventory = state.inventory.filter(item => item.item_id !== itemId)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_SOCKET(state, socket) {
      state.socket = socket
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    }
  },
  actions: {
    async initAuth({ commit }) {
      try {
        const isValid = await AuthService.validateToken()
        if (!isValid) {
          commit('SET_USER', null)
          commit('SET_TOKEN', null)
          AuthService.clearSession()
          return false
        }
        
        const user = AuthService.getStoredUser()
        const token = AuthService.getToken()
        
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        return true
      } catch (error) {
        commit('SET_USER', null)
        commit('SET_TOKEN', null)
        AuthService.clearSession()
        return false
      }
    },
    async login({ commit, dispatch }, credentials) {
      try {
        commit('SET_LOADING', true);
        const response = await AuthService.login(credentials);
        
        if (response.token) {
          commit('SET_USER', response.user);
          commit('SET_TOKEN', response.token);
          await dispatch('initializeSocket');
          await dispatch('fetchInventory');
          return true;
        }
        return false;
      } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Login failed';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    logout({ commit, state }) {
      AuthService.clearSession()
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      commit('SET_INVENTORY', [])
      if (state.socket) {
        state.socket.disconnect()
        commit('SET_SOCKET', null)
      }
    },
    initializeSocket({ commit }) {
      const socket = io(process.env.VUE_APP_API_URL || 'http://localhost:3000')
      
      socket.on('inventoryUpdate', ({ action, item, itemId }) => {
        switch (action) {
          case 'create':
            commit('ADD_INVENTORY_ITEM', item)
            break
          case 'update':
            commit('UPDATE_INVENTORY_ITEM', item)
            break
          case 'delete':
            commit('REMOVE_INVENTORY_ITEM', itemId)
            break
        }
      })
      
      commit('SET_SOCKET', socket)
    },
    async fetchInventory({ commit }) {
      try {
        commit('SET_LOADING', true)
        const { data } = await inventory.getAll()
        commit('SET_INVENTORY', data)
      } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Failed to fetch inventory'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createInventoryItem({ commit }, itemData) {
      try {
        const { data } = await inventory.create(itemData)
        commit('ADD_INVENTORY_ITEM', data)
        return data
      } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Failed to create item'
        commit('SET_ERROR', errorMessage)
        throw error
      }
    },
    async updateInventoryItem({ commit }, { id, data }) {
      try {
        const response = await inventory.update(id, data)
        commit('UPDATE_INVENTORY_ITEM', response.data)
        return response.data
      } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Failed to update item'
        commit('SET_ERROR', errorMessage)
        throw error
      }
    },
    async deleteInventoryItem({ commit }, id) {
      try {
        await inventory.delete(id)
        commit('REMOVE_INVENTORY_ITEM', id)
      } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Failed to delete item'
        commit('SET_ERROR', errorMessage)
        throw error
      }
    },
    setSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query)
    },
    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        console.log('Registering user:', userData);
        
        const response = await AuthService.register(userData);
        console.log('Registration response:', response);
        
        return response.data;
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'Registration failed';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getUser: state => state.user,
    getInventory: state => state.inventory,
    isLoading: state => state.loading,
    getError: state => state.error,
    filteredInventory: state => {
      const query = state.searchQuery.toLowerCase()
      return state.inventory.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      )
    }
  }
}) 