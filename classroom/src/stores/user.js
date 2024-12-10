// src/stores/user.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useUserStore = defineStore('user', () => {
  const userProfile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const createUserProfile = async (user) => {
    loading.value = true;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        lastLogin: new Date()
      });
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getUserProfile = async (uid) => {
    loading.value = true;
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        userProfile.value = userSnap.data();
      }
      return userProfile.value;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    userProfile,
    loading,
    error,
    createUserProfile,
    getUserProfile
  };
});