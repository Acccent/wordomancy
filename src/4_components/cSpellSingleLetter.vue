<script setup lang="ts">
import { LetterState as LS } from '@/2_utils/global';

const props = defineProps<{
  letter: string;
  isCheckbox?: boolean;
  letterState?: LS;
}>();

const chbxState = ref(false);

const letterClass = computed(() => {
  if (props.isCheckbox && chbxState.value) {
    return 'letter-key';
  }
  switch (props.letterState) {
    case LS.key:
      return 'letter-key';
    case LS.correct:
      return 'letter-correct';
    case LS.misplaced:
      return 'letter-misplaced';
    case LS.wrong:
      return 'letter-wrong';
    case LS.unknown:
      return 'letter-unknown';
    default:
      return 'letter-default';
  }
});

defineEmits<{
  (e: 'updateCheckbox', value: boolean): void;
}>();
</script>

<template>
  <template v-if="isCheckbox">
    <label class="block aspect-square cursor-pointer">
      <input
        type="checkbox"
        class="sr-only"
        v-model="chbxState"
        @change="$emit('updateCheckbox', chbxState)" />
      <svg
        viewBox="0 0 30 30"
        class="btn btn-outline"
        :class="letterClass"
        :aria-label="props.letter">
        <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle">
          {{ props.letter }}
        </text>
      </svg>
    </label>
  </template>
  <div v-else class="aspect-square">
    <svg
      viewBox="0 0 30 30"
      class="border-current"
      :class="letterClass"
      :aria-label="props.letter">
      <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle">
        {{ props.letter }}
      </text>
    </svg>
  </div>
</template>

<style scoped lang="postcss">
svg {
  @apply w-full h-full p-0 text-lg drop-shadow-spell;
  border-width: var(--border-btn, 1px);
  border-style: inherit;
  color: hsl(var(--bc));
  font-size: 16px;

  & > text {
    @apply w-full h-full font-spell;
    fill: currentColor;
  }
}

input:focus + svg {
  outline: 2px solid currentColor;
  outline-offset: -3px;
}

input + svg:hover > text {
  fill: hsl(var(--b1));
  stroke: hsl(var(--b1));
  stroke-width: 0.5;
}

input:checked + svg {
  @apply border-accent;
}

svg.letter {
  &-key {
    color: hsl(var(--a));
  }
  &-correct {
    color: hsl(var(--su));
  }
  &-misplaced {
    color: hsl(var(--wa));
  }
  &-wrong {
    color: hsl(var(--er));
  }
  &-unknown {
    color: hsl(var(--n));
  }
}
</style>
