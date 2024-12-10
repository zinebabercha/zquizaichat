<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const authStore = useAuthStore();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    authStore.user = user;
  });
});
</script>