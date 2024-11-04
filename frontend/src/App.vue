<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Joba Inventar 2.0</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/inventory">Inventory</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/sales">Sales</router-link>
            </li>
          </ul>
          <div class="d-flex align-items-center" v-if="isAuthenticated">
            <span class="text-light me-3">{{ userName }}</span>
            <b-button 
              variant="outline-light" 
              size="sm"
              @click="handleLogout"
            >
              <font-awesome-icon icon="sign-out-alt" class="mr-2"/>
              Logout
            </b-button>
          </div>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser']),
    userName() {
      return this.getUser ? this.getUser.name : ''
    }
  },
  methods: {
    handleLogout() {
      // Clear user data and token
      this.$store.commit('SET_USER', null)
      this.$store.commit('SET_TOKEN', null)
      localStorage.removeItem('token')
      
      // Redirect to login page
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.4rem;
}

.me-auto {
  margin-right: auto !important;
}

.me-3 {
  margin-right: 1rem !important;
}
</style> 