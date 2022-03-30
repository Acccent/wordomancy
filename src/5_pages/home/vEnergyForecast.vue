<script setup lang="ts">
import { SpellPhase } from '@/2_utils/global';
import cModal from '@/4_components/cModal.vue';
import { user, casting as spell } from '@/3_stores';

const modal = ref<InstanceType<typeof cModal> | null>(null);

function goToCastSpells() {
  emit('acknowledged', 'cast');
  modal.value?.close();
}

function goToSolveSpells() {
  emit('acknowledged', 'solve');
  modal.value?.close();
}

onMounted(() => {
  spell.resetEnergy();
});

const emit = defineEmits<{
  (e: 'acknowledged', next: string): void;
}>();
</script>

<template>
  <c-modal
    ref="modal"
    starts-open
    @closed="spell.phase = SpellPhase.inputtingWord">
    <p class="text-center">Hi {{ user.displayName }}!</p>
    <template v-if="spell.energy.size < 1">
      <p class="text-center">Getting your energy forecast...</p>
      <p class="text-center">Just a moment...</p>
    </template>
    <template v-else>
      <p class="text-center">Here is your energy forecast for today:</p>
      <div class="flex justify-around gap-8 my-10">
        <div v-for="e in spell.energy" :key="e[0]" class="text-center">
          <a-emoji
            :name="e[0]"
            class="w-16 h-16 mx-auto mb-4 drop-shadow-spell" />
          <span class="block font-spell text-xl">{{ e[1] }}</span>
        </div>
      </div>
    </template>

    <template #modal-action>
      <div class="flex flex-col w-full">
        <div class="text-center">
          <p>Use your energy to</p>
          <a-button class="mt-2 btn-primary" @click="goToCastSpells">
            Cast a Spell
          </a-button>
        </div>
        <div class="divider">or</div>
        <div class="text-center">
          <p>
            keep it for later and
            <a class="link link-primary" @click="goToSolveSpells"
              >solve Spells</a
            >
            for now
          </p>
        </div>
      </div>
    </template>
  </c-modal>
</template>
