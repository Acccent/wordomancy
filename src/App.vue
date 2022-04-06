<script setup lang="ts">
import { gsap } from 'gsap';
import { generateAnims } from '@/2_utils/anims';
import { app } from '@/3_stores';

const { setup, enter, leave } = generateAnims(
  { opacity: 1, blur: 0, scale: 1 },
  { opacity: 0, blur: 10, scale: 0.98 }
);

function viewSetup(el: Element) {
  setup(el);
}

function viewIn(el: Element, done: () => void) {
  enter(el, () => {
    done();
    app.viewTransition = false;
    if (app.modalWaiting) {
      app.openModal();
    }
  }).delay(0.1);
}

function viewOut(el: Element, done: () => void) {
  app.closeModal();
  app.viewTransition = true;
  leave(el, done).add(gsap.set(el, { position: 'absolute' }), 0);
}

const modalOverlay = ref<HTMLElement | null>(null);
const modalBox = ref<HTMLElement | null>(null);

const initModalVars = {
  opacity: 0,
  blur: 5,
  scale: 0.94,
  y: '1rem',
};
onMounted(() => gsap.set(modalBox.value, initModalVars));

watch(
  () => app.modalOpen,
  isOpening => {
    const overlay = modalOverlay.value;
    const box = modalBox.value;

    if (overlay && box) {
      if (isOpening) {
        gsap
          .timeline()
          .to(overlay, { display: 'flex', opacity: 1, duration: 0.1 })
          .to(box, {
            opacity: 1,
            blur: 0,
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          });
      } else {
        gsap
          .timeline()
          .to(box, {
            ...initModalVars,
            duration: 0.1,
            ease: 'power1.in',
          })
          .to(overlay, { display: 'none', opacity: 0, duration: 0.1 });
      }
    }
  }
);
</script>

<template>
  <main class="h-screen flex flex-col place-items-stretch">
    <c-navbar v-if="$route.meta.showNavbar" />
    <div v-else class="w-full h-[var(--navbar-height)]"></div>
    <div class="relative w-full max-w grow mx-auto pt-8">
      <router-view v-slot="{ Component, route }">
        <transition
          @before-enter="viewSetup"
          @enter="viewIn"
          @leave="viewOut"
          appear
          :css="false">
          <Suspense>
            <c-user-manager class="h-full w-full px-4" :key="route.path">
              <component :is="Component" />
            </c-user-manager>
            <template #fallback>
              <div
                class="flex justify-center items-center h-screen-w/o-nav w-full">
                <a-loading color="hsl(var(--a))" size="8" delay="0.2" />
              </div>
            </template>
          </Suspense>
        </transition>
      </router-view>
    </div>
  </main>
  <div id="modal-overlay" :class="{ open: app.modalOpen }" ref="modalOverlay">
    <div id="modal-box" ref="modalBox"></div>
  </div>
</template>

<style scoped lang="postcss">
#modal-overlay {
  @apply fixed inset-0 hidden justify-center items-center;
  @apply bg-neutral-focus bg-opacity-40;
  @apply opacity-0;
  overflow-y: hidden;
  overscroll-behavior: contain;
  z-index: 999;

  &:not(.open) {
    @apply pointer-events-none;
  }
}
#modal-box {
  @apply rounded-box bg-base-100 w-min max-w-full sm:min-w-[40rem] p-12 m-4;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}
</style>
