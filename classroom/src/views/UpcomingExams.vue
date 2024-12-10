<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex justify-between mb-6">
    <button
      @click="router.push('/dashboard')"
      class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
    >
      Back to Dashboard
    </button>
    <h2 class="text-2xl font-bold text-gray-900">Manage Upcoming Exams</h2>
  </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Manage Upcoming Exams</h2>
          
          <!-- Add Exam Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  v-model="newExam.subject"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Exam Date</label>
                <input
                  v-model="newExam.date"
                  type="date"
                  required
                  :min="today"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  v-model="newExam.notes"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add Exam
              </button>
              
            </div>
   
          </form>
          
          <!-- Exams List -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Your Upcoming Exams</h3>
            <div v-if="exams.length" class="space-y-4">
              <div
                v-for="exam in sortedExams"
                :key="exam.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex-grow">
                  <h4 class="font-medium">{{ exam.subject }}</h4>
                  <p class="text-sm text-gray-500">{{ formatDate(exam.date) }}</p>
                  <p v-if="exam.notes" class="text-sm text-gray-600 mt-1">{{ exam.notes }}</p>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    class="px-3 py-1 rounded-full text-sm"
                    :class="getDaysUntil(exam.date) < 7 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ getDaysUntil(exam.date) }} days left
                  </span>
                  <button
                    @click="deleteExam(exam.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-gray-500">No upcoming exams</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  const authStore = useAuthStore();
  const exams = ref([]);
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  
  const newExam = ref({
    subject: '',
    date: '',
    notes: ''
  });
  
  // Sort exams by date
  const sortedExams = computed(() => {
    return [...exams.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate days until exam
  const getDaysUntil = (date) => {
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Add new exam
  const handleSubmit = async () => {
    try {
      const examData = {
        ...newExam.value,
        userId: authStore.user.uid,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'exams'), examData);
      await fetchExams();
      
      // Reset form
      newExam.value = {
        subject: '',
        date: '',
        notes: ''
      };
    } catch (error) {
      console.error('Error adding exam:', error);
    }
  };
  
  // Delete exam
  const deleteExam = async (examId) => {
    try {
      await deleteDoc(doc(db, 'exams', examId));
      await fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };
  
  // Fetch user's exams
  const fetchExams = async () => {
    try {
      const q = query(
        collection(db, 'exams'),
        where('userId', '==', authStore.user.uid)
      );
      const querySnapshot = await getDocs(q);
      exams.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };
  
  // Initial fetch
  fetchExams();
  </script>