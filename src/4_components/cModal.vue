<script setup lang="ts">
const props = defineProps<{
  buttonClass?: string;
  buttonText?: string;
  startsOpen?: boolean;
}>();

const isOpen = ref(props.startsOpen ?? false);

function open() {
  emit('opened');
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
  emit('closed');
}

const emit = defineEmits<{
  (e: 'opened'): void;
  (e: 'closed'): void;
}>();

defineExpose({ open, close });
</script>

<template>
  <teleport to="body">
    <div :class="['modal', { 'modal-open': isOpen }]">
      <div class="modal-box w-min min-w-[38rem] max-w-full p-12 m-4">
        <slot />
        <div class="modal-action mt-8">
          <slot name="modal-action">
            <a-button
              :class="['btn-primary', props.buttonClass]"
              @click="close">
              {{ props.buttonText || 'OK' }}
            </a-button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
