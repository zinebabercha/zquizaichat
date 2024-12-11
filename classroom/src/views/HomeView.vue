<template>
  <div class="min-h-screen flex">
    <!-- Left Section -->
    <div class="w-1/2 bg-pastel-blue flex flex-col justify-center items-center text-center p-8">
      <img
        src="@/assets/logo.png"
        alt="Exam preparation illustration"
        class="mb-6 w-auto h-auto"
      />
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Ace Your Exams with Ease!
      </h1>
      <p class="text-lg text-gray-600">
        Your personal AI-powered study assistant. Tailored guidance and smart study tools to help high schoolers excel in their exams.
      </p>
    </div>

    <!-- Right Section -->
    <div class="w-1/2 bg-white flex flex-col justify-center items-center p-8">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Sign in to your account
        </h2>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
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
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
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
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = () => {
  loading.value = true;
  // Simulate login logic
  setTimeout(() => {
    loading.value = false;
    // Handle login logic here
    console.log("User logged in with email:", email.value);
  }, 2000);
};

const handleGoogleLogin = () => {
  console.log("Google login clicked");
};
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