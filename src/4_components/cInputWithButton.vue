<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import ATextInput from '@/4_components/atoms/aTextInput.vue';

const props = defineProps<{
  buttonText?: string;
  loading?: boolean;
  condition?: string;
}>();

const textInput = ref<InstanceType<typeof ATextInput> | null>(null);

const inputVal = ref('');
const isValid = ref(false);
const condRegExp = ref(new RegExp(`${props.condition}`));

function handleInput() {
  const refInput = textInput?.value?.refInput;

  if (!refInput) {
    return;
  }

  inputVal.value = refInput.value;
  if (props.condition) {
    isValid.value = condRegExp.value.test(inputVal.value);
  } else {
    isValid.value = !!inputVal.value.length;
  }
}

function submit(e: Event) {
  emit('submitted', inputVal.value);
}

const emit = defineEmits<{
  (e: 'submitted', value: string): void;
}>();
</script>

<template>
  <form class="form-control items-center mt-2 mb-8" @submit.prevent="submit">
    <div class="input-group w-fit">
      <a-text-input
        class="w-80 text-base"
        v-bind="$attrs"
        required
        ref="textInput"
        @input="handleInput" />
      <a-button
        class="btn-primary"
        type="submit"
        :disabled="!isValid"
        :loading="props.loading"
        >{{ props.buttonText ?? 'Submit' }}</a-button
      >
    </div>
  </form>
</template>
