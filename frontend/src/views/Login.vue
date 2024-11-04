<template>
  <div class="login-page">
    <b-card class="login-card">
      <!-- Card Header -->
      <div class="text-center mb-4">
        <div class="logo-container mb-4">
          <font-awesome-icon icon="box" size="3x" class="text-primary"/>
        </div>
        <h2 class="h3 mb-2">Login to Inventory System</h2>
        <p class="text-muted">Enter your credentials to access the inventory management system</p>
      </div>

      <!-- Login Form -->
      <b-form @submit.prevent="handleSubmit" class="login-form">
        <!-- Email Field -->
        <b-form-group
          label="Email"
          label-for="email"
          :invalid-feedback="emailError"
          :state="emailState"
        >
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            :state="emailState"
            required
          ></b-form-input>
        </b-form-group>

        <!-- Password Field -->
        <b-form-group
          label="Password"
          label-for="password"
          :invalid-feedback="passwordError"
          :state="passwordState"
        >
          <div class="password-input-group">
            <b-form-input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              :state="passwordState"
              required
            ></b-form-input>
            <b-button
              variant="link"
              class="password-toggle"
              @click="togglePassword"
            >
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"/>
            </b-button>
          </div>
        </b-form-group>

        <!-- Remember Me Checkbox -->
        <b-form-group>
          <b-form-checkbox
            v-model="form.rememberMe"
            name="remember-me"
            class="mb-3"
          >
            <div class="text-muted small">Keep me logged in on this device</div>
          </b-form-checkbox>
        </b-form-group>

        <!-- Submit Button -->
        <b-button
          type="submit"
          variant="primary"
          block
          :disabled="loading"
          class="mb-3"
        >
          {{ loading ? 'Logging in...' : 'Log in' }}
        </b-button>

        <!-- Links -->
        <div class="text-center mb-3">
          <p class="text-muted">
            Don't have an account?
            <router-link to="/register" class="text-primary">Sign up</router-link>
          </p>
          <router-link to="/forgot-password" class="text-primary">
            Forgot your password?
          </router-link>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      showPassword: false,
      validationErrors: {}
    }
  },
  computed: {
    ...mapState(['loading', 'error']),
    emailState() {
      return !this.validationErrors.email
    },
    passwordState() {
      return !this.validationErrors.password
    },
    emailError() {
      return this.validationErrors.email || ''
    },
    passwordError() {
      return this.validationErrors.password || ''
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    validateForm() {
      this.validationErrors = {}
      
      if (!this.form.email) {
        this.validationErrors.email = 'Email is required'
      } else if (!/.+@.+\..+/.test(this.form.email)) {
        this.validationErrors.email = 'Invalid email address'
      }

      if (!this.form.password) {
        this.validationErrors.password = 'Password is required'
      }

      return Object.keys(this.validationErrors).length === 0
    },
    async handleSubmit() {
      if (!this.validateForm()) return

      try {
        console.log('Attempting login with:', this.form.email);
        await this.$store.dispatch('login', {
          email: this.form.email,
          password: this.form.password
        });
        
        console.log('Login successful, redirecting...');
        
        // Show success message
        this.$bvToast.toast('Successfully logged in!', {
          title: 'Success',
          variant: 'success',
          solid: true
        });

        // Force navigation to dashboard
        await this.$router.replace('/');
        
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response && error.response.data && error.response.data.error 
          ? error.response.data.error 
          : 'Login failed';
        
        this.$bvToast.toast(errorMessage, {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-container {
  color: #007bff;
}

.password-input-group {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 1rem;
  color: #6c757d;
}

.password-toggle:hover {
  background: transparent;
  color: #343a40;
}

.text-primary {
  color: #007bff !important;
}

.text-primary:hover {
  color: #0056b3 !important;
  text-decoration: underline;
}
</style> 