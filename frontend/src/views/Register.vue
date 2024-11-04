<template>
  <div class="register-page">
    <b-card class="register-card">
      <div class="text-center mb-4">
        <div class="logo-container mb-4">
          <font-awesome-icon icon="box" size="3x" class="text-primary"/>
        </div>
        <h2 class="h3 mb-2">Create New Account</h2>
        <p class="text-muted">Enter your details to create a new account</p>
      </div>

      <b-form @submit.prevent="handleSubmit">
        <!-- Name Field -->
        <b-form-group label="Full Name">
          <b-form-input
            v-model="form.name"
            :state="getValidationState('name')"
            placeholder="Enter your full name"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ getErrorMessage('name') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Email Field -->
        <b-form-group label="Email">
          <b-form-input
            v-model="form.email"
            type="email"
            :state="getValidationState('email')"
            placeholder="Enter your email"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ getErrorMessage('email') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Password Field -->
        <b-form-group label="Password">
          <div class="password-input-group">
            <b-form-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :state="getValidationState('password')"
              placeholder="Create a password"
            ></b-form-input>
            <b-button
              variant="link"
              class="password-toggle"
              @click="togglePassword"
            >
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'"/>
            </b-button>
          </div>
          <b-form-invalid-feedback>
            {{ getErrorMessage('password') }}
          </b-form-invalid-feedback>
          <small class="text-muted">
            Password must be at least 8 characters long
          </small>
        </b-form-group>

        <!-- Role Selection -->
        <b-form-group label="Role">
          <b-form-select
            v-model="form.role"
            :options="roleOptions"
            :state="getValidationState('role')"
          ></b-form-select>
          <b-form-invalid-feedback>
            {{ getErrorMessage('role') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Submit Button -->
        <b-button
          type="submit"
          variant="primary"
          block
          :disabled="loading"
          class="mt-4"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </b-button>

        <!-- Login Link -->
        <div class="text-center mt-3">
          <p class="mb-0">
            Already have an account?
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: 'Manager'
      },
      showPassword: false,
      validationErrors: {},
      roleOptions: [
        { value: 'Manager', text: 'Manager' },
        { value: 'Admin', text: 'Admin' }
      ]
    }
  },
  computed: {
    ...mapState(['loading', 'error'])
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    getValidationState(field) {
      return !this.validationErrors[field]
    },
    getErrorMessage(field) {
      return this.validationErrors[field] || ''
    },
    validateForm() {
      this.validationErrors = {}
      
      if (!this.form.name) {
        this.validationErrors.name = 'Name is required'
      } else if (this.form.name.length < 2) {
        this.validationErrors.name = 'Name must be at least 2 characters'
      }

      if (!this.form.email) {
        this.validationErrors.email = 'Email is required'
      } else if (!/.+@.+\..+/.test(this.form.email)) {
        this.validationErrors.email = 'Invalid email address'
      }

      if (!this.form.password) {
        this.validationErrors.password = 'Password is required'
      } else if (this.form.password.length < 8) {
        this.validationErrors.password = 'Password must be at least 8 characters'
      }

      if (!this.form.role) {
        this.validationErrors.role = 'Role is required'
      }

      return Object.keys(this.validationErrors).length === 0
    },
    async handleSubmit() {
      if (!this.validateForm()) return

      try {
        const response = await this.$store.dispatch('register', this.form)
        console.log('Registration successful:', response)
        
        this.$bvToast.toast('Account created successfully! Please log in.', {
          title: 'Success',
          variant: 'success',
          solid: true
        })
        
        // Clear form
        this.form = {
          name: '',
          email: '',
          password: '',
          role: 'Manager'
        }
        
        // Redirect to login
        this.$router.push('/login')
      } catch (error) {
        console.error('Registration error:', error)
        const errorMessage = error.response && error.response.data 
          ? error.response.data.error || 'Registration failed'
          : 'Registration failed'
        
        this.$bvToast.toast(errorMessage, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 1rem;
}

.register-card {
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
</style> 