<script setup lang="ts">
const props = defineProps<{
  buttonClass?: string;
  buttonText?: string;
}>();

const emit = defineEmits(['opened', 'closed']);
const isOpen = ref(false);

function open() {
  emit('opened');
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
  emit('closed');
}

defineExpose({ open, close });
</script>

<template>
  <teleport to="body">
    <div :class="['modal', { 'modal-open': isOpen }]">
      <div class="w-auto max-w p-4">
        <div class="modal-box max-w-none py-8 px-16">
          <slot />
          <div class="modal-action mt-8">
            <slot name="modal-action">
              <a-button :class="[props.buttonClass]" @click="close">
                {{ props.buttonText || 'OK' }}
              </a-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
