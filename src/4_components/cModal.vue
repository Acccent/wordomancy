<script setup lang="ts">
import { app } from '@/3_stores';
</script>

<template>
  <teleport to="#modal-box">
    <slot />
    <div class="flex justify-center mt-8">
      <slot name="modal-action">
        <a-button class="btn-primary" @click="app.closeModal">OK</a-button>
      </slot>
    </div>
  </teleport>
</template>
