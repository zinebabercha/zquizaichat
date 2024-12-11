<template>
  <div class="min-h-screen flex">
    <!-- Left Section -->
    <div class="w-1/2 bg-pastel-blue flex flex-col justify-center items-center text-center p-12">
      <img
        src="@/assets/logo.png"
        alt="Exam preparation illustration"
        class="mb-8 w-64 h-auto"
      />
      <h1 class="text-5xl font-extrabold text-gray-800 mb-6">
        Ace Your Exams with Ease!
      </h1>
      <p class="text-xl text-gray-600 max-w-md">
        Your personal AI-powered study assistant. Tailored guidance and smart study tools to help high schoolers excel in their exams.
      </p>
    </div>

    <!-- Right Section -->
    <div class="w-1/2 bg-white flex flex-col justify-center items-center p-12">
      <div class="w-full max-w-md">
        <AuthLayout>
          <template #title>
            <h2 class="text-4xl font-bold text-gray-800 mb-8 text-center">
              Sign in to your account
            </h2>
          </template>
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <div class="flex items-center justify-between">
              <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
  
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  class="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../layouts/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const { handleGoogleSignIn } = useAuth()

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

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

<style>
/* Custom pastel color */
:root {
  --pastel-blue: #d0ebff;
}
.bg-pastel-blue {
  background-color: var(--pastel-blue);
}
</style>