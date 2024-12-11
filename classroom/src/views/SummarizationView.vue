<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header Section with Title and Back Button -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">File Summarization</h1>
          <router-link 
            to="/dashboard" 
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Back to Dashboard
          </router-link>
        </div>
  
        <!-- Content Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium mb-4">Upload a File</h2>
          <p class="text-sm text-gray-500 mb-2">
            Accepted file types: <strong>.txt, .pdf, .docx</strong>
          </p>
          <div class="space-y-4">
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept=".txt,.pdf,.docx" 
              class="block w-full text-sm text-gray-500"
            />
            <button
              @click="summarizeFile"
              :disabled="!file || loading"
              class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {{ loading ? "Summarizing..." : "Summarize" }}
            </button>
          </div>
          <div v-if="error" class="mt-6 text-red-500">
            <p>{{ error }}</p>
          </div>
          <div v-if="summary" class="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-medium mb-2">Summary</h3>
            <p>{{ summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { extractTextFromPDF } from "@/utils/pdfReader";
  import { extractTextFromFile } from "@/utils/fileReader";
  import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
  import mammoth from "mammoth"; // For Word documents (.docx)
  
  const file = ref(null);
  const summary = ref("");
  const loading = ref(false);
  const error = ref(null);
  
  const summarizeText = async (text) => {
    const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    const API_KEY = "Bearer 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"; // Replace with your Hugging Face API key
  
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });
  
    const result = await response.json();
  
    if (result.error) {
      throw new Error(result.error);
    }
  
    return result[0].summary_text;
  };
  
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    const allowedExtensions = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
  
    if (!allowedExtensions.includes(selectedFile.type) && !selectedFile.name.endsWith(".docx")) {
      error.value = "Unsupported file type. Please upload a .txt, .pdf, or .docx file.";
      file.value = null;
      return;
    }
  
    error.value = null;
    file.value = selectedFile;
  };
  
  const summarizeFile = async () => {
    if (!file.value) return;
    error.value = null;
    loading.value = true;
  
    try {
      let text;
  
      if (file.value.type === "text/plain") {
        text = await extractTextFromFile(file.value);
      } else if (file.value.type === "application/pdf") {
        text = await extractTextFromPDF(file.value);
      } else if (file.value.name.endsWith(".docx")) {
        const arrayBuffer = await file.value.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        throw new Error("Unsupported file type.");
      }
  
      summary.value = await summarizeText(text);
    } catch (err) {
      error.value = err.message || "An error occurred.";
    } finally {
      loading.value = false;
    }
  };
  </script>
  