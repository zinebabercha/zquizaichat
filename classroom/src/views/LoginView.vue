<!-- src/views/LoginView.vue -->
<template>
    <AuthLayout>
      <template #title>Sign in to your account</template>
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
  
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
  
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
          </div>
        </div>
  
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
  
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
  
          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleLogin"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img class="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
              Sign in with Google
            </button>
          </div>
        </div>
  
        <div class="mt-6 text-center text-sm">
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            Don't have an account? Register here
          </router-link>
        </div>
      </form>
  
      <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
        {{ error }}
      </div>
    </AuthLayout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { useAuth } from '../composables/useAuth'
  import AuthLayout from '../layouts/AuthLayout.vue'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const { handleGoogleSignIn } = useAuth()
  
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  
  const handleLogin = async () => {
    loading.value = true
    try {
      await authStore.login(email.value, password.value)
      router.push('/dashboard')
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  const handleGoogleLogin = async () => {
    try {
      await handleGoogleSignIn()
      router.push('/dashboard')
    } catch (e) {
      error.value = e.message
    }
  }
  </script>