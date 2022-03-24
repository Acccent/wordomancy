<script setup lang="ts">
import cModal from '@/4_components/cModal.vue';
const router = useRouter();

const modal = ref<InstanceType<typeof cModal> | null>(null);

function open() {
  modal.value?.open();
}

function pickRandom() {
  emit('pickedRandom');
  modal.value?.close();
}

defineExpose({ open });
const emit = defineEmits<{
  (e: 'pickedRandom'): void;
}>();
</script>

<template>
  <c-modal ref="modal">
    <p class="text-center">No Spell could be found for this code.</p>

    <template #modal-action>
      <div class="flex w-full">
        <a-button class="btn-primary" @click="router.push({ name: 'home' })">
          Go back Home
        </a-button>
        <div class="divider divider-horizontal">or</div>
        <a-button class="btn-primary" @click="pickRandom">
          Solve random Spell
        </a-button>
      </div>
    </template>
  </c-modal>
</template>
