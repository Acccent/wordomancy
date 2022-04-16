<script setup lang="ts">
import { generateAnims } from '@/2_utils/anims';

const props = defineProps<{
  initialTab?: string;
}>();

const tabNames = Object.keys(useSlots());

const activeTab = ref(props.initialTab || tabNames[0]);

function switchSlot(name: string) {
  activeTab.value = name;
  emit('changedTab', name);
}

const { setup, enter, leave } = generateAnims(
  { opacity: 1, blur: 0 },
  { opacity: 0, blur: 1 }
);

const emit = defineEmits<{
  (e: 'changedTab', newTab: string): void;
}>();
</script>

<template>
  <div class="tabs w-full">
    <button
      v-for="tabName in tabNames"
      :key="tabName"
      class="tab tab-lg tab-bordered font-serif grow"
      :class="{ 'tab-active': tabName === activeTab }"
      @click="switchSlot(tabName)">
      {{ tabName }}
    </button>
  </div>
  <div class="w-full pt-16 pb-8">
    <keep-alive>
      <transition
        @before-enter="setup"
        @enter="enter"
        @leave="leave"
        mode="out-in"
        appear
        :css="false">
        <div class="text-center" :key="activeTab">
          <slot :name="activeTab"></slot>
        </div>
      </transition>
    </keep-alive>
  </div>
</template>
