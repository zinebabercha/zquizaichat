// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '@/config/firebase';
import { useUserStore } from './user';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // const register = async (email, password) => {
  //   loading.value = true;
  //   error.value = null;
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     user.value = userCredential.user;
  //     return userCredential.user;
  //   } catch (e) {
  //     error.value = e.message;
  //     throw e;
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  const register = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      
      // Add this: Create user profile in Firestore
      const userStore = useUserStore();
      await userStore.createUserProfile(userCredential.user);
      
      return userCredential.user;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      user.value = result.user;
      
      // Create/update user profile
      const userStore = useUserStore();
      await userStore.createUserProfile(result.user);
      
      return result.user;
    } catch (e) {
      error.value = e.message;
      throw e;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      return userCredential.user;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
    } catch (e) {
      error.value = e.message;
      throw e;
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    handleGoogleSignIn
  };
});