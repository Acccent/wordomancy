<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const props = defineProps<{
  buttonText?: string;
  loading?: boolean;
}>();

const inputVal = ref('');

function submit(e: Event) {
  emit('submitted', inputVal.value);
}

const emit = defineEmits<{
  (e: 'submitted', value: string): void;
}>();
</script>

<template>
  <div class="form-control mt-2 mb-8">
    <div class="input-group justify-center">
      <a-text-input
        class="font-mono text-lg"
        v-bind="$attrs"
        v-model="inputVal"
        required />
      <a-button class="btn-primary" :loading="props.loading" @click="submit">{{
        props.buttonText ?? 'Submit'
      }}</a-button>
    </div>
  </div>
</template>
