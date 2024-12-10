<!-- src/views/QuizDetailsView.vue -->
<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <!-- Quiz Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold">{{ quiz?.subject }}</h1>
          <p class="text-gray-600">{{ quiz?.courseTopic }} - {{ quiz?.difficulty }}</p>
          <div class="mt-2 text-lg">
            Score: <span class="font-bold text-indigo-600">{{ quiz?.score }}%</span>
          </div>
        </div>
  
        <!-- Questions Review -->
        <div class="space-y-8">
          <div v-for="(question, index) in quiz?.questions" :key="index" class="border-b pb-6">
            <p class="font-medium mb-3">{{ index + 1 }}. {{ question.question }}</p>
            <div class="space-y-2">
              <div
                v-for="(option, key) in question.options"
                :key="key"
                class="p-3 rounded-lg"
                :class="{
                  'bg-green-100': key === question.correctAnswer,
                  'bg-red-100': quiz.answers[index] === key && key !== question.correctAnswer,
                  'bg-gray-50': quiz.answers[index] !== key && key !== question.correctAnswer
                }"
              >
                {{ key }}) {{ option }}
                <span v-if="key === question.correctAnswer" class="text-green-600 ml-2">(Correct Answer)</span>
                <span v-if="quiz.answers[index] === key && key !== question.correctAnswer" class="text-red-600 ml-2">(Your Answer)</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Actions -->
        <div class="mt-8 flex justify-between">
          <button
            @click="router.push('/dashboard')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
          <button
            @click="retakeQuiz"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Take New Quiz
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuizStore } from '../stores/quiz';
  import { useAuthStore } from '../stores/auth';
  
  const route = useRoute();
  const router = useRouter();
  const quizStore = useQuizStore();
  const authStore = useAuthStore();
  const quiz = ref(null);
  
  onMounted(async () => {
    try {
      const quizId = route.params.id;
      const quizzes = await quizStore.getUserQuizHistory(authStore.user.uid);
      quiz.value = quizzes.find(q => q.id === quizId);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  });
  
  const retakeQuiz = () => {
    router.push('/quiz');
  };
  </script>