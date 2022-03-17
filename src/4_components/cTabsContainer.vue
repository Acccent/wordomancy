<script setup lang="ts">
const props = defineProps<{
  initialTab?: string;
}>();
const tabNames = Object.keys(useSlots());

const activatedTab = ref('');
const activeTab = computed(
  () => activatedTab.value || props.initialTab || tabNames[0]
);

function switchSlot(name: string) {
  activatedTab.value = name;
}
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
  <div class="w-full pt-12 pb-8">
    <keep-alive>
      <slot :name="activeTab"></slot>
    </keep-alive>
  </div>
</template>
