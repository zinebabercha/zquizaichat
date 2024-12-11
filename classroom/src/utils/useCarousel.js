import { ref, computed, onMounted } from "vue";

export function useCarousel(slidesArray, interval = 5000) {
  const slides = ref(slidesArray);
  const currentIndex = ref(0);

  const currentSlide = computed(() => slides.value[currentIndex.value]);

  const goToSlide = (index) => {
    currentIndex.value = index;
  };

  onMounted(() => {
    setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
    }, interval);
  });

  return { slides, currentSlide, currentIndex, goToSlide };
}
