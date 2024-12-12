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
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Chat with Virtual Tutor</h1>
          <router-link 
            to="/dashboard" 
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Back to Dashboard
          </router-link>
        </div>
  
        <div v-if="!chatStarted" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium mb-4">Select Subject</h2>
          <div class="space-y-4">
            <input
              v-model="subject"
              type="text"
              placeholder="Enter subject (e.g., Mathematics, Physics)"
              class="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              @click="startChat"
              :disabled="!subject"
              class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Start Chat
            </button>
          </div>
        </div>
  
        <div v-else class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <div class="flex items-center">
              <UserCircleIcon class="h-8 w-8 text-indigo-600" />
              <div class="ml-3">
                <p class="text-lg font-medium">Virtual Professor</p>
                <p class="text-sm text-gray-500">Subject: {{ subject }}</p>
              </div>
            </div>
          </div>
  
          <div class="h-[500px] overflow-y-auto p-4 space-y-4">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="[
                'max-w-[80%] p-3 rounded-lg',
                message.role === 'user' 
                  ? 'ml-auto bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              ]"
            >
              {{ message.content }}
            </div>
          </div>
  
          <div class="p-4 border-t">
            <div class="flex space-x-4">
              <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Type your question..."
                class="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                @click="sendMessage"
                :disabled="!newMessage || chatStore.loading"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                <PaperAirplaneIcon v-if="!chatStore.loading" class="h-5 w-5" />
                <ArrowPathIcon v-else class="h-5 w-5 animate-spin" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import { useChatStore } from '../stores/chat';
  import {
    UserCircleIcon,
    ArrowLeftIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
  } from '@heroicons/vue/24/outline';
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
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, current: true },
  { name: 'Calendar', href: '/calendar', icon: ClockIcon, current: false },
  { name: 'Relaxation', href: '/relaxation', icon: HeartIcon, current: false },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Summarization', href: '/summarization', icon: DocumentTextIcon, current: false }, // Add this

];
  
  const router = useRouter();
  const authStore = useAuthStore();
  const chatStore = useChatStore();
  
  const subject = ref('');
  const chatStarted = ref(false);
  const messages = ref([]);
  const newMessage = ref('');
  
  const startChat = () => {
    chatStarted.value = true;
    messages.value = [{
      role: 'assistant',
      content: `Hello! I'm your virtual ${subject.value} professor. How can I help you today?`
    }];
  };
  
  const sendMessage = async () => {
    if (!newMessage.value || chatStore.loading) return;
  
    const userMessage = newMessage.value;
    messages.value.push({
      role: 'user',
      content: userMessage
    });
    newMessage.value = '';
  
    try {
      const response = await chatStore.sendMessage(userMessage, subject.value);
      messages.value.push({
        role: 'assistant',
        content: response
      });
  
      await chatStore.saveChat(
        authStore.user.uid,
        subject.value,
        messages.value
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  </script> 
  


   