<script setup lang="ts">
import ReadMe from '@/../readme.md';
import { user } from '@/3_stores';
const router = useRouter();

onBeforeMount(async () => {
  await user.getUser();

  if (user.isSignedIn) {
    router.replace({ name: 'home' });
  }
});
</script>

<template>
  <div class="column max-w-min mt-[40vh]">
    <h1 class="mb-16 text-6xl text-center logo">Wordomancy</h1>
    <p class="text-center">Sign in with one of the following services:</p>
    <div class="flex justify-center mt-2 mb-6 input-group">
      <button
        v-for="p in user.providers"
        :key="p"
        class="btn btn-primary btn-outline w-24"
        :title="p.replace(p[0], p[0].toUpperCase())"
        @click="user.signinWithProvider(p)">
        <a-icon :name="`a-${p}`" />
      </button>
    </div>
  </div>
  <div class="column my-20 prose">
    <read-me />
  </div>
</template>
