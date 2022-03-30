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
      <div class="w-auto w-auto min-w-[50%] max-w m-auto p-4">
        <div class="modal-box w-full py-8 px-16">
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
    </div>
  </teleport>
</template>
