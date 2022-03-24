<script setup lang="ts">
import ReadMe from '@/../readme.md';
import { useAppState } from '@/3_stores';
const app = useAppState();
const router = useRouter();

function go() {
  router.push('/home');
}

// const tooltip = computed(() =>
//   /^[a-zA-Z]*$/.test(user.name)
//     ? undefined
//     : 'Your username can only contain letters.'
// );
</script>

<template>
  <div class="column max-w-min mt-[40vh]">
    <h1 class="mb-16 text-6xl font-display drop-shadow-spell">Wordomancy</h1>
    <p class="text-center">Sign in with one of the following services:</p>
    <div class="flex justify-center mt-2 mb-6">
      <a-button
        v-for="p in app.providers"
        :key="p"
        class="btn-primary btn-outline w-24 mx-2"
        :title="p.replace(p[0], p[0].toUpperCase())"
        @click="app.loginWithProvider(p)"
        ><a-icon :name="`a-${p}`"
      /></a-button>
    </div>
    <p class="text-center">Or enter without signing in (Alpha only):</p>
    <div class="flex justify-center mt-2">
      <a-button class="btn-primary btn-outline" @click="go">Go</a-button>
    </div>
    <!-- <form class="form-control w-full mt-16" @submit.prevent="go">
      <label class="label" for="username-input">
        <span class="label-text">Enter the password:</span>
      </label>
      <a-text-input
        id="username-input"
        placeholder="Type here"
        required
        :tooltip="tooltip"
        v-model="user.name" />
      <a-button
        class="btn-primary mt-4"
        type="submit"
        :disabled="!user.name || tooltip">
        Enter
      </a-button>
    </form> -->
  </div>
  <div class="column my-20 prose">
    <read-me />
  </div>
</template>
