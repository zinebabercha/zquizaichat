<!-- src/views/ProfileView.vue -->
<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">User Profile</h1>
          <router-link 
            to="/dashboard" 
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </router-link>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg p-6">
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="bg-indigo-100 p-3 rounded-full">
                <UserIcon class="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 class="text-lg font-medium">Email</h3>
                <p class="text-gray-600">{{ user?.email }}</p>
              </div>
            </div>
            <!-- Add more profile information here -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { UserIcon } from '@heroicons/vue/24/outline';
  
  const authStore = useAuthStore();
  const user = ref(authStore.user);
  </script>