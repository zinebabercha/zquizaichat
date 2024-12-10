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

export const useChatStore = defineStore('chat', () => {
  const loading = ref(false);
  const error = ref(null);
  const currentChat = ref(null);

  const saveChat = async (userId, subject, messages) => {
    try {
      await addDoc(collection(db, 'chats'), {
        userId,
        subject,
        messages,
        timestamp: new Date(),
        lastMessage: messages[messages.length - 1].content
      });
    } catch (e) {
      console.error('Error saving chat:', e);
      throw e;
    }
  };


const getRecentChats = async (userId) => {
    try {
      const q = query(
        collection(db, 'chats'),
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
      console.error('Error getting chats:', e);
      return [];
    }
  };

  const sendMessage = async (message, subject) => {
    loading.value = true;
    try {
      const prompt = `As a ${subject} professor, respond to this question: ${message}. Keep the response concise and educational.`;
      
      const response = await hf.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages: [
          {
            role: "user",
            content: prompt,
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
    currentChat,
    saveChat,
    getRecentChats,
    sendMessage
  };
});
