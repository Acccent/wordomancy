<script setup lang="ts">
import ReadMe from '@/../readme.md';
import { useUser } from '@/3_stores/user';
const user = useUser();
const router = useRouter();

function go() {
  if (user.name) {
    router.push('/home');
  }
}

const tooltip = computed(() =>
  /^[a-zA-Z]*$/.test(user.name)
    ? undefined
    : 'Your username can only contain letters.'
);
</script>

<template>
  <div class="column max-w-min mt-[40vh]">
    <h1 class="text-6xl font-display drop-shadow-spell">Wordomancy</h1>
    <form class="form-control w-full mt-16" @submit.prevent="go">
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
    </form>
  </div>
  <div class="column my-20 prose">
    <read-me />
  </div>
</template>
