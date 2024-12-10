<!-- src/views/AnalyticsView.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <router-link 
          to="/dashboard" 
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Back to Dashboard
        </router-link>
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-lg font-medium mb-4">Score Progress Over Time</h2>
        <div class="h-64">
          <Line
            v-if="chartData.datasets"
            :data="chartData"
            :options="chartOptions"
          />
          <p v-else class="text-gray-500">No quiz data available</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium mb-4">Performance by Subject</h2>
          <div class="h-64">
            <Bar
              v-if="subjectChartData.datasets"
              :data="subjectChartData"
              :options="barChartOptions"
            />
            <p v-else class="text-gray-500">No subject data available</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium mb-4">Quizzes by Difficulty</h2>
          <div class="h-64">
            <Bar
              v-if="difficultyChartData.datasets"
              :data="difficultyChartData"
              :options="barChartOptions"
            />
            <p v-else class="text-gray-500">No difficulty data available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useAuthStore } from '../stores/auth';
import { Line, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement
);

const quizStore = useQuizStore();
const authStore = useAuthStore();
const quizHistory = ref([]);
const userStats = ref([]);

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const chartData = computed(() => ({
  labels: quizHistory.value.map(quiz => 
    new Date(quiz.timestamp.seconds * 1000).toLocaleDateString()
  ),
  datasets: [{
    label: 'Quiz Scores',
    data: quizHistory.value.map(quiz => quiz.score),
    borderColor: '#8884d8',
    tension: 0.1
  }]
}));

const subjectChartData = computed(() => {
  const subjectMap = {};
  quizHistory.value.forEach(quiz => {
    if (!subjectMap[quiz.subject]) {
      subjectMap[quiz.subject] = {
        total: 0,
        count: 0
      };
    }
    subjectMap[quiz.subject].total += quiz.score;
    subjectMap[quiz.subject].count += 1;
  });

  const subjects = Object.keys(subjectMap);
  const averages = subjects.map(subject => 
    Math.round(subjectMap[subject].total / subjectMap[subject].count)
  );

  return {
    labels: subjects,
    datasets: [{
      label: 'Average Score by Subject',
      data: averages,
      backgroundColor: '#8884d8'
    }]
  };
});

const difficultyChartData = computed(() => {
  const stats = userStats.value[0]?.quizzesByDifficulty || { easy: 0, medium: 0, hard: 0 };
  return {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      label: 'Number of Quizzes',
      data: [stats.easy, stats.medium, stats.hard],
      backgroundColor: '#82ca9d'
    }]
  };
});

onMounted(async () => {
  try {
    const userId = authStore.user.uid;
    quizHistory.value = await quizStore.getUserQuizHistory(userId);
    userStats.value = await quizStore.getUserStats(userId);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
  }
});
</script>

