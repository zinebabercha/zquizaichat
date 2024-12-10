import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { HfInference } from "@huggingface/inference";

const hf = new HfInference("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");

export const useRelaxationStore = defineStore('relaxation', () => {
  const loading = ref(false);
  const error = ref(null);
  const currentAdvice = ref(null);

  const saveAdvice = async (userId, category, advice) => {
    try {
      await addDoc(collection(db, 'relaxation'), {
        userId,
        category,
        advice,
        timestamp: new Date(),
      });
    } catch (e) {
      console.error('Error saving advice:', e);
      throw e;
    }
  };

  const getRecentAdvice = async (userId) => {
    try {
      const q = query(
        collection(db, 'relaxation'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.error('Error getting advice:', e);
      return [];
    }
  };

  const getAdvice = async (category, situation) => {
    loading.value = true;
    try {
      const prompts = {
        stress: `As a mental health expert, provide practical advice for managing this stress situation: ${situation}. Include breathing exercises or meditation techniques if relevant. Keep it supportive and actionable.`,
        relationships: `As a relationship counselor, provide advice for this situation: ${situation}. Focus on healthy communication and understanding. Keep the advice practical and constructive.`
      };

      const response = await hf.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages: [
          {
            role: "user",
            content: prompts[category],
          }
        ],
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    currentAdvice,
    saveAdvice,
    getRecentAdvice,
    getAdvice
  };
});
