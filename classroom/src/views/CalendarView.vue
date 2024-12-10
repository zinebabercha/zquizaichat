<!-- <template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between mb-6">
        <button
          @click="router.push('/dashboard')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back to Dashboard
        </button>
        <h1 class="text-2xl font-bold">Academic Calendar</h1>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex space-x-4">
            <button
              @click="previousMonth"
              class="p-2 text-gray-600 hover:text-gray-900"
            >
              Previous
            </button>
            <h2 class="text-xl font-semibold">
              {{ currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
            </h2>
            <button
              @click="nextMonth"
              class="p-2 text-gray-600 hover:text-gray-900"
            >
              Next
            </button>
          </div>
          <button
            @click="showEventModal = true"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Study Session
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <template v-for="day in daysOfWeek" :key="day">
            <div class="text-center p-2 bg-gray-50 font-medium">
              {{ day }}
            </div>
          </template>

          <template v-for="{ date, isCurrentMonth, hasEvent } in calendarDays" :key="date">
            <div
              @click="selectDate(date)"
              class="min-h-24 p-2 border cursor-pointer hover:bg-gray-50"
              :class="{
                'bg-gray-100': !isCurrentMonth,
                'border-indigo-500': isToday(date)
              }"
            >
              <div class="flex justify-between">
                <span :class="{ 'text-gray-400': !isCurrentMonth }">
                  {{ date.getDate() }}
                </span>
                <span v-if="hasEvent" class="h-2 w-2 rounded-full bg-indigo-500"></span>
              </div>
              
              <div class="mt-1 space-y-1">
                <template v-for="event in getEventsForDate(date)" :key="event.id">
                  <div 
                    class="text-xs p-1 rounded truncate"
                    :class="{
                      'bg-red-100 text-red-800': event.type === 'exam',
                      'bg-green-100 text-green-800': event.type === 'study'
                    }"
                  >
                    {{ event.title }}
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div v-if="showEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Add Study Session</h3>
        <form @submit.prevent="handleAddEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="newEvent.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="newEvent.date"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select
              v-model="newEvent.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="study">Study Session</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              v-model="newEvent.notes"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showEventModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const router = useRouter();
const authStore = useAuthStore();

const currentDate = ref(new Date());
const showEventModal = ref(false);
const events = ref([]);

const newEvent = ref({
  title: '',
  date: '',
  type: 'study',
  notes: ''
});

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  
  const prevMonthDays = firstDay.getDay();
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      isCurrentMonth: false,
      hasEvent: hasEventsOnDate(date)
    });
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      hasEvent: hasEventsOnDate(date)
    });
  }
  
  const nextMonthDays = 42 - days.length; 
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      hasEvent: hasEventsOnDate(date)
    });
  }
  
  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const hasEventsOnDate = (date) => {
  return events.value.some(event => 
    new Date(event.date).toDateString() === date.toDateString()
  );
};

const getEventsForDate = (date) => {
  return events.value.filter(event =>
    new Date(event.date).toDateString() === date.toDateString()
  );
};

const handleAddEvent = async () => {
  try {
    const eventData = {
      ...newEvent.value,
      userId: authStore.user.uid,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, 'calendar_events'), eventData);
    
    await fetchEvents();
    
    newEvent.value = {
      title: '',
      date: '',
      type: 'study',
      notes: ''
    };
    showEventModal.value = false;
  } catch (error) {
    console.error('Error adding event:', error);
  }
};

const fetchEvents = async () => {
  try {
    const q = query(
      collection(db, 'calendar_events'),
      where('userId', '==', authStore.user.uid)
    );
    const querySnapshot = await getDocs(q);
    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

fetchEvents();
</script> -->


<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between mb-6">
        <button
          @click="router.push('/dashboard')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back to Dashboard
        </button>
        <h1 class="text-2xl font-bold">Academic Calendar</h1>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex space-x-4">
            <button
              @click="previousMonth"
              class="p-2 text-gray-600 hover:text-gray-900"
            >
              Previous
            </button>
            <h2 class="text-xl font-semibold">
              {{ currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
            </h2>
            <button
              @click="nextMonth"
              class="p-2 text-gray-600 hover:text-gray-900"
            >
              Next
            </button>
          </div>
          <button
            @click="showEventModal = true"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Study Session
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Days of Week -->
          <template v-for="day in daysOfWeek" :key="day">
            <div class="text-center p-2 bg-gray-50 font-medium">
              {{ day }}
            </div>
          </template>

          <!-- Calendar Days -->
          <template v-for="{ date, isCurrentMonth, hasEvent } in calendarDays" :key="date">
            <div
              @click="() => handleDateSelect(date)"
              class="min-h-24 p-2 border cursor-pointer hover:bg-gray-50"
              :class="{
                'bg-gray-100': !isCurrentMonth,
                'border-indigo-500': isToday(date),
                'bg-indigo-50': isSelectedDate(date)
              }"
            >
              <div class="flex justify-between">
                <span :class="{ 'text-gray-400': !isCurrentMonth }">
                  {{ date.getDate() }}
                </span>
                <span v-if="hasEvent" class="h-2 w-2 rounded-full bg-indigo-500"></span>
              </div>
              
              <!-- Events for this day -->
              <!-- <div class="mt-1 space-y-1">
                <template v-for="event in getEventsForDate(date)" :key="event.id">
                  <div 
                    class="text-xs p-1 rounded truncate"
                    :class="{
                      'bg-red-100 text-red-800': event.type === 'exam',
                      'bg-green-100 text-green-800': event.type === 'study'
                    }"
                  >
                    {{ event.title }}
                  </div>
                </template>
              </div> -->
              <div class="mt-1 space-y-1">
                <template v-for="event in getEventsForDate(date)" :key="event.id">
                  <div 
                    class="text-xs p-1 rounded truncate group relative flex justify-between items-center"
                    :class="{
                      'bg-red-100 text-red-800': event.type === 'exam',
                      'bg-green-100 text-green-800': event.type === 'study'
                    }"
                  >
                    <span>{{ event.title }}</span>
                    <button 
                      @click.stop="handleDeleteEvent(event.id)"
                      class="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-600 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <div v-if="showEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Add Study Session</h3>
        <form @submit.prevent="handleAddEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="newEvent.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="newEvent.date"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select
              v-model="newEvent.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="study">Study Session</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              v-model="newEvent.notes"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showEventModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const router = useRouter();
const authStore = useAuthStore();

const currentDate = ref(new Date());
const selectedDate = ref(null);
const showEventModal = ref(false);
const events = ref([]);

const newEvent = ref({
  title: '',
  date: '',
  type: 'study',
  notes: ''
});

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Calendar calculations
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  
  // Add days from previous month
  const prevMonthDays = firstDay.getDay();
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      isCurrentMonth: false,
      hasEvent: hasEventsOnDate(date)
    });
  }
  
  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      hasEvent: hasEventsOnDate(date)
    });
  }
  
  // Add days from next month
  const nextMonthDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      hasEvent: hasEventsOnDate(date)
    });
  }
  
  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isSelectedDate = (date) => {
  return selectedDate.value?.toDateString() === date.toDateString();
};

const handleDateSelect = (date) => {
  selectedDate.value = date;
  newEvent.value.date = date.toISOString().split('T')[0];
  showEventModal.value = true;
};

const hasEventsOnDate = (date) => {
  return events.value.some(event => 
    new Date(event.date).toDateString() === date.toDateString()
  );
};

const getEventsForDate = (date) => {
  return events.value.filter(event =>
    new Date(event.date).toDateString() === date.toDateString()
  );
};

const handleAddEvent = async () => {
  try {
    const eventData = {
      ...newEvent.value,
      userId: authStore.user.uid,
      createdAt: new Date()
    };
    
    await addDoc(collection(db, 'calendar_events'), eventData);
    
    // Refresh events
    await fetchEvents();
    
    // Reset form and close modal
    newEvent.value = {
      title: '',
      date: '',
      type: 'study',
      notes: ''
    };
    showEventModal.value = false;
    selectedDate.value = null;
  } catch (error) {
    console.error('Error adding event:', error);
  }
};

const fetchEvents = async () => {
  try {
    const q = query(
      collection(db, 'calendar_events'),
      where('userId', '==', authStore.user.uid)
    );
    const querySnapshot = await getDocs(q);
    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};
const handleDeleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'calendar_events', eventId));
    // Refresh events after deletion
    await fetchEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};


// Initial fetch
fetchEvents();
</script>