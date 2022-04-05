<script setup lang="ts">
import ReadMe from '@/../readme.md';
import { user } from '@/3_stores';
</script>

<template>
  <div class="column mt-[30vh]">
    <h1 class="mb-16 text-6xl text-center logo">Wordomancy</h1>
    <p class="text-center">Sign in with one of the following services:</p>
    <div class="flex justify-center mt-4 mb-6 input-group">
      <a-link-button
        v-for="p in user.providers"
        :key="p"
        class="btn-outline w-24 h-6"
        :title="p.replace(p[0], p[0].toUpperCase())"
        @click="user.signinWithProvider(p)">
        <a-icon :name="`a-${p}`" />
      </a-link-button>
    </div>
  </div>
  <div class="column my-20 prose">
    <read-me />
  </div>
</template>
