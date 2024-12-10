// src/composables/useAuth.js
import { ref } from 'vue'
import { auth } from '../config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useUserStore } from '../stores/user';


export function useAuth() {
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // const handleGoogleSignIn = async () => {
  //   loading.value = true
  //   error.value = null
  //   try {
  //     const provider = new GoogleAuthProvider()
  //     const result = await signInWithPopup(auth, provider)
  //     user.value = result.user
  //     return result.user
  //   } catch (e) {
  //     error.value = e.message
  //     throw e
  //   } finally {
  //     loading.value = false
  //   }
  // }
  const handleGoogleSignIn = async () => {
    loading.value = true;
    error.value = null;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      user.value = result.user;
      
      // Add this: Create/update user profile
      const userStore = useUserStore();
      await userStore.createUserProfile(result.user);
      
      return result.user;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    error,
    loading,
    handleGoogleSignIn
  }
}