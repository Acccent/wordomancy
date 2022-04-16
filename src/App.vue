<script setup lang="ts">
import { gsap } from 'gsap';
import { generateAnims } from '@/2_utils/anims';
import { app } from '@/3_stores';

const viewTransition = ref(false);

const {
  setup: viewSetup,
  enter: _viewEnter,
  leave: _viewLeave,
} = generateAnims(
  { opacity: 1, blur: 0, scale: 1 },
  { opacity: 0, blur: 10, scale: 0.98 }
);

function viewEnter(el: Element, done: () => void) {
  _viewEnter(el, () => {
    viewTransition.value = false;
    done();
  }).delay(0.1);
}

function viewLeave(el: Element, done: () => void) {
  viewTransition.value = true;
  _viewLeave(el, done).add(gsap.set(el, { position: 'absolute' }), 0);
}

const {
  setup: mOverlaySetup,
  enter: mOverlayEnter,
  leave: _mOverlayLeave,
} = generateAnims(
  { display: 'flex', opacity: 1 },
  { display: 'none', opacity: 0 }
);

function mOverlayLeave(el: Element, done: () => void) {
  _mOverlayLeave(el, done).delay(0.1);
}

const {
  setup: mBoxSetup,
  enter: _mBoxEnter,
  leave: mBoxLeave,
} = generateAnims(
  { opacity: 1, scale: 1, y: 0, blur: 0 },
  { opacity: 0, scale: 0.94, y: '1rem', blur: 5 }
);

function mBoxEnter(el: Element, done: () => void) {
  _mBoxEnter(el, done).delay(0.1);
}
</script>

<template>
  <main class="h-screen flex flex-col place-items-stretch">
    <c-navbar v-if="$route.meta.showNavbar" />
    <div v-else class="w-full h-[var(--navbar-height)]"></div>
    <div class="relative w-full max-w grow mx-auto pt-8">
      <router-view v-slot="{ Component, route }">
        <transition-group
          @before-enter="viewSetup"
          @enter="viewEnter"
          @leave="viewLeave"
          appear
          :css="false">
          <div
            v-if="app.dataState > 1"
            v-show="!app.loading"
            class="w-full px-4"
            :key="route.name === 'spell' ? route.params.id : route.name">
            <component :is="Component" />
          </div>
          <div
            v-if="app.dataState < 2 || app.loading"
            class="flex justify-center items-center h-screen-w/o-nav w-full"
            key="loading">
            <a-loading color="hsl(var(--a))" size="8" delay="0.2" />
          </div>
        </transition-group>
      </router-view>
    </div>
  </main>
  <transition
    @before-enter="mOverlaySetup"
    @enter="mOverlayEnter"
    @leave="mOverlayLeave"
    :css="false">
    <div
      v-show="app.modalQueue.length && !viewTransition"
      id="modal-overlay"
      :class="{ open: app.modalQueue.length }">
      <transition
        @before-enter="mBoxSetup"
        @enter="mBoxEnter"
        @leave="mBoxLeave"
        mode="out-in"
        :css="false">
        <div
          v-if="app.modalQueue.length"
          id="modal-box"
          :key="app.modalQueue[0]?.name">
          <component :is="app.modalQueue[0]?.component" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped lang="postcss">
#modal-overlay {
  @apply fixed inset-0 justify-center items-center;
  @apply bg-neutral-focus bg-opacity-40;
  overflow-y: hidden;
  overscroll-behavior: contain;
  z-index: 999;

  &:not(.open) {
    @apply pointer-events-none;
  }
}
#modal-box {
  @apply rounded-box bg-base-100 w-fit max-w-full p-12 m-4;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}
</style>
