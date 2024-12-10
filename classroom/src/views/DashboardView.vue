<template>
  <div class="min-h-screen bg-gray-100">
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
      <header class="bg-white shadow-sm rounded-lg p-4 mb-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="flex items-center">
        <UserCircleIcon class="h-5 w-5 text-gray-500 mr-2" />
        {{ user?.email }}
      </span>
      <router-link
        to="/profile"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
      >
        <UserIcon class="h-5 w-5 mr-2" />
        Profile
      </router-link>
      <button
        @click="handleLogout"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5 mr-2" />
        Logout
      </button>
    </div>
  </div>
</header>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="bg-white p-6 rounded-lg shadow-sm"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full" :class="stat.bgColor">
              <component :is="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ stat.name }}</h3>
              <p class="text-2xl font-semibold">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quiz History</h3>
          <div v-if="recentQuizzes.length" class="space-y-4">
            <div
              v-for="quiz in recentQuizzes"
              :key="quiz.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-medium">{{ quiz.subject }}</h4>
                <p class="text-sm text-gray-500">{{ quiz.date }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-lg font-semibold">{{ quiz.score }}%</span>
                <button 
                  @click="viewQuiz(quiz)"
                  class="text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No recent quizzes</p>
        </div>

        <!-- <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Upcoming Exams</h3>
          <div v-if="upcomingExams.length" class="space-y-4">
            <div
              v-for="exam in upcomingExams"
              :key="exam.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-medium">{{ exam.subject }}</h4>
                <p class="text-sm text-gray-500">{{ exam.date }}</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-sm"
                :class="exam.daysUntil < 7 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
              >
                {{ exam.daysUntil }} days left
              </span>
            </div>
          </div>
          <p v-else class="text-gray-500">No upcoming exams</p>
        </div> -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-medium text-gray-900">Upcoming Exams</h3>
    <router-link 
      to="/upcoming-exams" 
      class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
    >
      Manage Exams
    </router-link>
  </div>
</div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Study Time</h3>
          <div class="h-64">
            <p class="text-gray-500">Study time visualization</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Chat Sessions</h3>
          <div v-if="recentChats.length" class="space-y-4">
            <div
              v-for="chat in recentChats"
              :key="chat.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-medium">{{ chat.subject }}</h4>
                <p class="text-sm text-gray-500">{{ chat.lastMessage }}</p>
              </div>
              <button class="text-indigo-600 hover:text-indigo-800">
                Continue
              </button>
            </div>
          </div>
          <p v-else class="text-gray-500">No recent chat sessions</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/vue/24/outline';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useQuizStore } from '../stores/quiz';
import {
  HomeIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  HeartIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const quizStore = useQuizStore();
const user = ref(authStore.user);

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Quiz', href: '/quiz', icon: AcademicCapIcon, current: false },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, current: false },
  { name: 'Calendar', href: '/calendar', icon: ClockIcon, current: false },
  { name: 'Relaxation', href: '/relaxation', icon: HeartIcon, current: false },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
];

const stats = ref([
  { name: 'Total Quizzes', value: '24', icon: AcademicCapIcon, bgColor: 'bg-blue-500' },
  { name: 'Average Score', value: '85%', icon: ChartBarIcon, bgColor: 'bg-green-500' },
  { name: 'Study Hours', value: '45h', icon: ClockIcon, bgColor: 'bg-purple-500' },
]);

const recentQuizzes = ref([]);
const upcomingExams = ref([]);
const recentChats = ref([]);

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const viewQuiz = (quiz) => {
  router.push(`/quiz-details/${quiz.id}`);
};

onMounted(async () => {
  try {
    const quizHistory = await quizStore.getUserQuizHistory(authStore.user.uid);
    const userStats = await quizStore.getUserStats(authStore.user.uid);

    

    stats.value = [
      { name: 'Total Quizzes', value: quizHistory.length, icon: AcademicCapIcon, bgColor: 'bg-blue-500' },
      { name: 'Average Score', value: `${Math.round(userStats[0]?.averageScore || 0)}%`, icon: ChartBarIcon, bgColor: 'bg-green-500' },
      { name: 'Study Hours', value: '0h', icon: ClockIcon, bgColor: 'bg-purple-500' },
    ];

    recentQuizzes.value = quizHistory.slice(0, 5).map(quiz => ({
      id: quiz.id,
      subject: quiz.subject,
      score: quiz.score,
      date: new Date(quiz.timestamp.seconds * 1000).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script> 


