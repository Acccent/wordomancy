<script setup lang="ts">
import { Motion } from 'motion/vue';
import { user } from '@/3_stores';
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await user.getUser();
  const newPath =
    user.isSignedIn && route.query.to ? route.query.to.toString() : '/index';
  router.replace(newPath);
});
</script>

<template>
  <div class="h-full w-full loader">
    <Motion
      v-for="n in 3"
      :key="n"
      :animate="{
        opacity: [0, 0.8, 1, 0.1, 0],
        scale: [6, 3, 0.1, 8, 8],
        filter: ['blur(0)', 'blur(0)', 'blur(0)', 'blur(6px)', 'blur(8px)'],
      }"
      :transition="{
        easing: ['ease-in', 'ease-out', 'linear'],
        offset: [0, 0.25, 0.5, 0.85, 1],
        duration: 3.8,
        delay: n * 0.6,
        repeat: Infinity,
      }" />
  </div>
</template>

<style scoped lang="postcss">
.loader > div {
  @apply block absolute inset-0 m-auto h-4 w-4;
  background-color: hsl(var(--a));
  border-radius: 100%;
}
</style>
