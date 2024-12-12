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
          <p v-html="summary"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import { extractTextFromPDF } from "@/utils/pdfReader";
import { extractTextFromTxt } from "@/utils/fileReader";
import { query } from "@/utils/query";
import mammoth from "mammoth";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import MarkdownIt from "vue3-markdown-it";
import markdownit from 'markdown-it'
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
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, current: false },
  { name: 'Calendar', href: '/calendar', icon: ClockIcon, current: false },
  { name: 'Relaxation', href: '/relaxation', icon: HeartIcon, current: false },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Summarization', href: '/summarization', icon: DocumentTextIcon, current: true }, // Add this

];
const file = ref(null);
const summary = ref("");
const loading = ref(false);
const error = ref(null);



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
      text = await extractTextFromTxt(file.value);
    } else if (file.value.type === "application/pdf") {
      text = await extractTextFromPDF(file.value);
    } else if (file.value.name.endsWith(".docx")) {
      const arrayBuffer = await file.value.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      throw new Error("Unsupported file type.");
    }
    console.log(text);

    const apiResponse = await query({ inputs: text });
    const md = markdownit()
    const MDresult = md.render(apiResponse);
    summary.value = MDresult || "No summary available.";
  } catch (err) {
    error.value = err.message || "An error occurred.";
  } finally {
    loading.value = false;
  }
};
</script>
