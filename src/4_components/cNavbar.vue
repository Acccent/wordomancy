<script setup lang="ts">
import { generateAnims } from '@/2_utils/anims';
import { user } from '@/3_stores';

const {
  setup: barSetup,
  enter: barEnter,
  leave: barLeave,
} = generateAnims({ opacity: 1, y: 0 }, { opacity: 0, y: -10 });

const {
  setup: btnsSetup,
  enter: btnsEnter,
  leave: btnsLeave,
} = generateAnims({ opacity: 1, x: 0 }, { opacity: 0, x: 30 });

function btnsDelayedEnter(el: Element, done: () => void) {
  const eIndex = (el as HTMLElement).dataset.index;
  btnsEnter(el, done).delay((eIndex ? parseInt(eIndex) * 0.1 : 0) + 0.1);
}

function btnsDelayedLeave(el: Element, done: () => void) {
  const eIndex = (el as HTMLElement).dataset.index;
  btnsLeave(el, done).delay(eIndex ? parseInt(eIndex) * 0.1 : 0);
}
</script>

<template>
  <transition
    @before-enter="barSetup"
    @enter="(e:Element, d: () => void) => barEnter(e, d).duration(0.3)"
    @leave="(e:Element, d: () => void) => barLeave(e, d)"
    appear>
    <div class="border-b h-[var(--navbar-height)]">
      <div class="navbar w-full max-w mx-auto px-8">
        <div class="flex-1">
          <h1 class="text-s logo">
            <template
              v-if="
                (user.isSignedIn && $route.name === 'home') ||
                (!user.isSignedIn && $route.name === 'index')
              "
              >Wordomancy</template
            >
            <router-link
              v-else
              :to="{ name: user.isSignedIn ? 'home' : 'index' }"
              >Wordomancy</router-link
            >
          </h1>
        </div>
        <div class="flex-none gap-2">
          <transition-group
            @before-enter="btnsSetup"
            @enter="btnsDelayedEnter"
            @leave="btnsDelayedLeave"
            appear
            :css="false">
            <button
              v-if="$route.name === 'spell'"
              class="btn btn-square btn-ghost"
              title="Info"
              key="info"
              data-index="0">
              <a-icon name="f-info" />
            </button>
            <button
              class="btn btn-square btn-ghost"
              title="Help"
              key="help"
              data-index="1">
              <a-icon name="f-question" />
            </button>
            <template v-if="user.isSignedIn">
              <button
                class="btn btn-square btn-ghost"
                title="Settings"
                key="settings"
                data-index="2">
                <a-icon name="f-settings" />
              </button>
              <button
                class="btn btn-square btn-ghost"
                title="Sign out"
                key="signout"
                data-index="3"
                @click="user.signout">
                <a-icon name="f-signout" />
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-square btn-ghost"
                title="Sign in"
                key="signin"
                data-index="2">
                <a-icon name="f-signin" :horizontalFlip="true" />
              </button>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
  </transition>
</template>
