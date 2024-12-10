





// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import { db } from '@/config/firebase';
// import { HfInference } from "@huggingface/inference";
// import { 
//   collection, 
//   addDoc, 
//   query, 
//   where, 
//   getDocs,
//   doc,
//   updateDoc
// } from 'firebase/firestore';

// const hf = new HfInference("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");

// export const useQuizStore = defineStore('quiz', () => {
//   const currentQuiz = ref(null);
//   const loading = ref(false);
//   const error = ref(false);
  
//   const difficultyLevels = [
//     { id: 'easy', name: 'Easy' },
//     { id: 'medium', name: 'Medium' },
//     { id: 'hard', name: 'Hard' }
//   ];

//   const generateQuiz = async (quizConfig) => {
//     loading.value = true;
//     error.value = null;
    
//     try {
//       const prompt = `Generate a multiple choice quiz in JSON format about ${quizConfig.subject} - ${quizConfig.courseTopic} with ${quizConfig.numberOfQuestions} questions at ${quizConfig.difficulty} level. Return the response in this exact format:
//       {
//         "questions": [
//           {
//             "id": 1,
//             "question": "Question text here?",
//             "options": {
//               "A": "First option",
//               "B": "Second option",
//               "C": "Third option",
//               "D": "Fourth option"
//             },
//             "correctAnswer": "A"
//           }
//         ]
//       }`;

//       const chatCompletion = await hf.chatCompletion({
//         model: "Qwen/Qwen2.5-Coder-32B-Instruct",
//         messages: [
//           {
//             role: "user",
//             content: prompt,
//           }
//         ],
//         max_tokens: 1200,
//       });

//       const result = chatCompletion.choices[0].message.content;
      
//       try {
//         const parsedContent = JSON.parse(result);
//         console.log('Parsed JSON content:', parsedContent);

//         if (!parsedContent.questions || parsedContent.questions.length === 0) {
//           throw new Error('No questions in the response');
//         }

//         currentQuiz.value = {
//           ...quizConfig,
//           questions: parsedContent.questions,
//           currentQuestionIndex: 0,
//           answers: new Array(parsedContent.questions.length).fill(null),
//           completed: false
//         };

//         return parsedContent.questions;
//       } catch (jsonError) {
//         console.error('JSON parsing error:', jsonError);
//         throw new Error('Failed to parse quiz content as JSON');
//       }
//     } catch (e) {
//       console.error('Quiz generation error:', e);
//       error.value = e.message;
//       throw e;
//     } finally {
//       loading.value = false;
//     }
//   };

//   // Save quiz results
//   const saveQuizResults = async (userId, quizData, results) => {
//     try {
//       const quizRef = await addDoc(collection(db, 'quizzes'), {
//         userId,
//         subject: quizData.subject,
//         courseTopic: quizData.courseTopic,
//         difficulty: quizData.difficulty,
//         numberOfQuestions: quizData.numberOfQuestions,
//         questions: quizData.questions,
//         answers: results.answers,
//         score: results.score,
//         correctAnswers: results.correctAnswers,
//         timestamp: new Date()
//       });
      
//       // Update user's progress stats
//       const userStatsRef = collection(db, 'userStats');
//       const q = query(userStatsRef, where('userId', '==', userId), 
//                      where('subject', '==', quizData.subject));
//       const querySnapshot = await getDocs(q);
      
//       if (querySnapshot.empty) {
//         // Create new stats
//         await addDoc(userStatsRef, {
//           userId,
//           subject: quizData.subject,
//           totalQuizzes: 1,
//           averageScore: results.score,
//           quizzesByDifficulty: {
//             easy: quizData.difficulty === 'easy' ? 1 : 0,
//             medium: quizData.difficulty === 'medium' ? 1 : 0,
//             hard: quizData.difficulty === 'hard' ? 1 : 0
//           }
//         });
//       } else {
//         // Update existing stats
//         const statsDoc = querySnapshot.docs[0];
//         const currentStats = statsDoc.data();
//         const newTotalQuizzes = currentStats.totalQuizzes + 1;
//         const newAverage = (currentStats.averageScore * currentStats.totalQuizzes + results.score) / newTotalQuizzes;
        
//         await updateDoc(doc(db, 'userStats', statsDoc.id), {
//           totalQuizzes: newTotalQuizzes,
//           averageScore: newAverage,
//           [`quizzesByDifficulty.${quizData.difficulty}`]: currentStats.quizzesByDifficulty[quizData.difficulty] + 1
//         });
//       }
      
//       return quizRef.id;
//     } catch (e) {
//       console.error('Error saving quiz:', e);
//       throw e;
//     }
//   };

//   // Get user's quiz history
//   const getUserQuizHistory = async (userId) => {
//     try {
//       const q = query(collection(db, 'quizzes'), where('userId', '==', userId));
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (e) {
//       console.error('Error getting quiz history:', e);
//       throw e;
//     }
//   };

//   // Get user's stats by subject
//   const getUserStats = async (userId) => {
//     try {
//       const q = query(collection(db, 'userStats'), where('userId', '==', userId));
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//     } catch (e) {
//       console.error('Error getting user stats:', e);
//       throw e;
//     }
//   };

//   return {
//     currentQuiz,
//     loading,
//     error,
//     difficultyLevels,
//     generateQuiz,
//     saveQuizResults,
//     getUserQuizHistory,
//     getUserStats
//   };
// });





import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';

export const useQuizStore = defineStore('quiz', () => {
  const currentQuiz = ref(null);
  const loading = ref(false);
  const error = ref(false);
  
  const difficultyLevels = [
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  // Save quiz results
  const saveQuizResults = async (userId, quizData, results) => {
    try {
      const quizRef = await addDoc(collection(db, 'quizzes'), {
        userId,
        subject: quizData.subject,
        courseTopic: quizData.courseTopic,
        difficulty: quizData.difficulty,
        numberOfQuestions: quizData.numberOfQuestions,
        questions: quizData.questions,
        answers: results.answers,
        score: results.score,
        correctAnswers: results.correctAnswers,
        timestamp: new Date()
      });
      
      // Update user's progress stats
      const userStatsRef = collection(db, 'userStats');
      const q = query(userStatsRef, where('userId', '==', userId), 
                     where('subject', '==', quizData.subject));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Create new stats
        await addDoc(userStatsRef, {
          userId,
          subject: quizData.subject,
          totalQuizzes: 1,
          averageScore: results.score,
          quizzesByDifficulty: {
            easy: quizData.difficulty === 'easy' ? 1 : 0,
            medium: quizData.difficulty === 'medium' ? 1 : 0,
            hard: quizData.difficulty === 'hard' ? 1 : 0
          }
        });
      } else {
        // Update existing stats
        const statsDoc = querySnapshot.docs[0];
        const currentStats = statsDoc.data();
        const newTotalQuizzes = currentStats.totalQuizzes + 1;
        const newAverage = (currentStats.averageScore * currentStats.totalQuizzes + results.score) / newTotalQuizzes;
        
        await updateDoc(doc(db, 'userStats', statsDoc.id), {
          totalQuizzes: newTotalQuizzes,
          averageScore: newAverage,
          [`quizzesByDifficulty.${quizData.difficulty}`]: currentStats.quizzesByDifficulty[quizData.difficulty] + 1
        });
      }
      
      return quizRef.id;
    } catch (e) {
      console.error('Error saving quiz:', e);
      throw e;
    }
  };

  // Get user's quiz history
  const getUserQuizHistory = async (userId) => {
    try {
      const q = query(collection(db, 'quizzes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.error('Error getting quiz history:', e);
      throw e;
    }
  };

  // Get user's stats by subject
  const getUserStats = async (userId) => {
    try {
      const q = query(collection(db, 'userStats'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.error('Error getting user stats:', e);
      throw e;
    }
  };
  const generateQuiz = async (quizConfig) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('https://openaizineb-instance.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-08-01-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '7AcPIaP9Zr3TFjKTCrQQB1fS5ecqTkf2bJjpWG8bqehAHsKedmTzJQQJ99ALAC5T7U2XJ3w3AAABACOGvKX1'
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Generate a multiple choice quiz in JSON format about ${quizConfig.subject} - ${quizConfig.courseTopic} with ${quizConfig.numberOfQuestions} questions at ${quizConfig.difficulty} level. Return the response in this exact format:
            {
              "questions": [
                {
                  "id": 1,
                  "question": "Question text here?",
                  "options": {
                    "A": "First option",
                    "B": "Second option",
                    "C": "Third option",
                    "D": "Fourth option"
                  },
                  "correctAnswer": "A"
                }
              ]
            }`
          }],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      const data = await response.json();
      try {
        const parsedContent = JSON.parse(data.choices[0].message.content);
        console.log('Parsed JSON content:', parsedContent);

        if (!parsedContent.questions || parsedContent.questions.length === 0) {
          throw new Error('No questions in the response');
        }

        currentQuiz.value = {
          ...quizConfig,
          questions: parsedContent.questions,
          currentQuestionIndex: 0,
          answers: new Array(parsedContent.questions.length).fill(null),
          completed: false
        };

        return parsedContent.questions;
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Failed to parse quiz content as JSON');
      }
    } catch (e) {
      console.error('Quiz generation error:', e);
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    currentQuiz,
    loading,
    error,
    difficultyLevels,
    generateQuiz,
    saveQuizResults,
    getUserQuizHistory,
    getUserStats
  };
});