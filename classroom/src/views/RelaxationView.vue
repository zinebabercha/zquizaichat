<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
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