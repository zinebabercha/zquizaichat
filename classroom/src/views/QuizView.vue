<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Quiz Configuration -->
      <div v-if="!quizStore.currentQuiz" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-6">Create New Quiz</h2>
        
        <div class="space-y-6">
          <!-- Subject Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              v-model="quizConfig.subject"
              placeholder="Enter subject (e.g., Mathematics, Physics, History)"
              class="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <!-- Topic Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              v-model="quizConfig.courseTopic"
              placeholder="Enter specific topic (e.g., Calculus, Quantum Physics)"
              class="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <!-- Difficulty -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select 
              v-model="quizConfig.difficulty" 
              class="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="" disabled>Select difficulty</option>
              <option v-for="level in quizStore.difficultyLevels" :key="level.id" :value="level.id">
                {{ level.name }}
              </option>
            </select>
          </div>

          <!-- Number of Questions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
            <input
              type="number"
              v-model.number="quizConfig.numberOfQuestions"
              min="1"
              max="10"
              class="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            @click="startQuiz"
            :disabled="!isConfigValid || quizStore.loading"
            class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {{ quizStore.loading ? 'Generating Quiz...' : 'Start Quiz' }}
          </button>
          <button
  @click="returnToDashboard"
  class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
>
  Return to Dashboard
</button>

          <!-- Error Message -->
          <div v-if="quizStore.error" class="text-red-600 text-sm text-center">
            {{ quizStore.error }}
          </div>
        </div>
      </div>

      <!-- Quiz Questions -->
      <div v-else-if="currentQuestion && !showResults" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Question {{ currentQuestionIndex + 1 }} of {{ quizStore.currentQuiz.questions.length }}</h2>
          <button @click="exitQuiz" class="text-gray-600 hover:text-gray-900">Exit Quiz</button>
          <button 
  @click="saveProgress" 
  class="mr-4 text-indigo-600 hover:text-indigo-900"
>
  Save Progress
</button>
        </div>

        <div class="mb-8">
          <p class="text-lg mb-4">{{ currentQuestion.question }}</p>
          
          <div class="space-y-3">
            <div
              v-for="(option, key) in currentQuestion.options"
              :key="key"
              @click="selectAnswer(key)"
              class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              :class="{
                'border-indigo-500 bg-indigo-50': selectedAnswer === key,
                'border-gray-200': selectedAnswer !== key
              }"
            >
              {{ key }}) {{ option }}
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Previous
          </button>
          
          <div class="ml-auto">
            <button
              v-if="currentQuestionIndex < quizStore.currentQuiz.questions.length - 1"
              @click="nextQuestion"
              :disabled="!selectedAnswer"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Next
            </button>
            <button
              v-else
              @click="finishQuiz"
              :disabled="!selectedAnswer"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Finish
            </button>
          </div>
        </div>
      </div>

      <!-- Results Display -->
      <div v-else-if="showResults" class="bg-white rounded-lg shadow p-6">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-4">Quiz Results</h2>
          <div class="text-4xl font-bold text-indigo-600 mb-2">
            {{ score }}%
          </div>
          <p class="text-gray-600">
            You got {{ correctAnswers }} out of {{ quizStore.currentQuiz.questions.length }} questions correct
          </p>
        </div>

        <!-- Review Questions -->
        <div class="space-y-8">
          <div v-for="(question, index) in quizStore.currentQuiz.questions" :key="index" class="border-b pb-6">
            <p class="font-medium mb-3">{{ index + 1 }}. {{ question.question }}</p>
            <div class="space-y-2">
              <div
                v-for="(option, key) in question.options"
                :key="key"
                class="p-3 rounded-lg"
                :class="{
                  'bg-green-100': key === question.correctAnswer,
                  'bg-red-100': quizStore.currentQuiz.answers[index] === key && key !== question.correctAnswer,
                  'bg-gray-50': quizStore.currentQuiz.answers[index] !== key && key !== question.correctAnswer
                }"
              >
                {{ key }}) {{ option }}
                <span v-if="key === question.correctAnswer" class="text-green-600 ml-2">(Correct Answer)</span>
                <span v-if="quizStore.currentQuiz.answers[index] === key && key !== question.correctAnswer" class="text-red-600 ml-2">(Your Answer)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center space-x-4">
          <button
            @click="startNewQuiz"
            class="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
          >
            Start New Quiz
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { useRouter } from 'vue-router'
const router = useRouter()
const quizStore = useQuizStore()
const showResults = ref(false)
const error = ref('')
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()


const quizConfig = ref({
  subject: '',
  courseTopic: '',
  difficulty: '',
  numberOfQuestions: 5
})

const selectedAnswer = ref(null)
const currentQuestionIndex = ref(0)

const score = computed(() => {
  if (!quizStore.currentQuiz) return 0
  const correct = quizStore.currentQuiz.questions.reduce((acc, question, index) => {
    return acc + (quizStore.currentQuiz.answers[index] === question.correctAnswer ? 1 : 0)
  }, 0)
  return Math.round((correct / quizStore.currentQuiz.questions.length) * 100)
})

const correctAnswers = computed(() => {
  if (!quizStore.currentQuiz) return 0
  return quizStore.currentQuiz.questions.reduce((acc, question, index) => {
    return acc + (quizStore.currentQuiz.answers[index] === question.correctAnswer ? 1 : 0)
  }, 0)
})

const isConfigValid = computed(() => {
  return quizConfig.value.subject &&
         quizConfig.value.courseTopic &&
         quizConfig.value.difficulty &&
         quizConfig.value.numberOfQuestions > 0
})

const currentQuestion = computed(() => {
  if (!quizStore.currentQuiz?.questions) return null
  return quizStore.currentQuiz.questions[currentQuestionIndex.value]
})

const startQuiz = async () => {
  try {
    await quizStore.generateQuiz(quizConfig.value)
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    showResults.value = false
  } catch (error) {
    console.error('Failed to start quiz:', error)
  }
}

const selectAnswer = (answer) => {
  selectedAnswer.value = answer
}

const nextQuestion = () => {
  if (selectedAnswer.value) {
    quizStore.currentQuiz.answers[currentQuestionIndex.value] = selectedAnswer.value
    currentQuestionIndex.value++
    selectedAnswer.value = quizStore.currentQuiz.answers[currentQuestionIndex.value]
  }
}

const previousQuestion = () => {
  currentQuestionIndex.value--
  selectedAnswer.value = quizStore.currentQuiz.answers[currentQuestionIndex.value]
}

const exitQuiz = () => {
  if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
    quizStore.currentQuiz = null
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    showResults.value = false
  }
}

const finishQuiz = async () => {
  quizStore.currentQuiz.answers[currentQuestionIndex.value] = selectedAnswer.value;
  
  const results = {
    answers: quizStore.currentQuiz.answers,
    score: score.value,
    correctAnswers: correctAnswers.value
  };
  
  try {
    // Debug logs
    console.log('Auth store user:', authStore.user);
    console.log('Results to save:', results);
    
    if (!authStore.user) {
      throw new Error('User must be logged in to save quiz results');
    }
    
    const userId = authStore.user.uid;
    console.log('Attempting to save with userId:', userId);
    
    await quizStore.saveQuizResults(userId, quizStore.currentQuiz, results);
    console.log('Quiz results saved successfully');
    showResults.value = true;
  } catch (e) {
    console.error('Detailed error:', e);
    error.value = e.message;
    showResults.value = true;
  }
};
const startNewQuiz = () => {
  quizStore.currentQuiz = null
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResults.value = false
}
const returnToDashboard = () => {
  router.push('/dashboard')
}
const saveProgress = async () => {
  try {
    if (!authStore.user) {
      throw new Error('Must be logged in to save progress');
    }
    await quizStore.saveQuizResults(authStore.user.uid, quizStore.currentQuiz, {
      answers: quizStore.currentQuiz.answers,
      score: score.value,
      correctAnswers: correctAnswers.value,
      inProgress: true
    });
  } catch (e) {
    error.value = e.message;
  }
};
</script>