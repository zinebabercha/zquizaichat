<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <nav class="fixed top-0 left-0 h-full w-64 bg-indigo-600 text-white">
      <div class="flex items-center justify-center h-16 bg-indigo-700">
        <h2 class="text-xl font-bold">AI Classroom</h2>
      </div>
      <div class="p-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          class="flex items-center p-2 rounded-lg hover:bg-indigo-700 mb-1"
          :class="{ 'bg-indigo-700': item.current }"
        >
          <component :is="item.icon" class="h-6 w-6 mr-3" />
          {{ item.name }}
        </router-link>
      </div>
    </nav>
      <div class="ml-64 p-8">
        <!-- Back to Dashboard Button -->
        <div class="flex justify-between mb-6">
          <button
            @click="router.push('/dashboard')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
          <h2 class="text-2xl font-bold text-gray-900">Relaxation & Advice</h2>
        </div>
  
        <!-- Advice Form -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Category</label>
              <select
                v-model="category"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="stress">Stress Management</option>
                <option value="relationships">Relationships</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">Describe your situation</label>
              <textarea
                v-model="situation"
                rows="4"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="What's on your mind?"
              ></textarea>
            </div>
  
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ loading ? 'Getting Advice...' : 'Get Advice' }}
              </button>
            </div>
          </form>
        </div>
  
        <!-- Current Advice -->
        <div v-if="currentAdvice" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Your Advice</h3>
          <div class="prose max-w-none">
            {{ currentAdvice }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useRelaxationStore } from '@/stores/relaxation';

  import {
  HomeIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  HeartIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
  { name: 'Quiz', href: '/quiz', icon: AcademicCapIcon, current: false },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, current: false },
  { name: 'Calendar', href: '/calendar', icon: ClockIcon, current: false },
  { name: 'Relaxation', href: '/relaxation', icon: HeartIcon, current: true },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Summarization', href: '/summarization', icon: DocumentTextIcon, current: false }, // Add this

];
  
  const router = useRouter();
  const relaxationStore = useRelaxationStore();
  
  const category = ref('stress');
  const situation = ref('');
  const currentAdvice = ref('');
  const loading = ref(false);
  
  const handleSubmit = async () => {
    try {
      loading.value = true;
      const advice = await relaxationStore.getAdvice(category.value, situation.value);
      currentAdvice.value = advice;
      
      // Clear form
      situation.value = '';
    } catch (error) {
      console.error('Error getting advice:', error);
    } finally {
      loading.value = false;
    }
  };
  </script>