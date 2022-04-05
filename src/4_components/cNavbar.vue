<script setup lang="ts">
import { generateAnims } from '@/2_utils/anims';
import { user } from '@/3_stores';

const [_barSetup, _barIn, _barOut] = generateAnims(
  { opacity: 1, y: 0 },
  { opacity: 0, y: -10 }
);

const [_btnsSetup, _btnsIn, _btnsOut] = generateAnims(
  { opacity: 1, x: 0 },
  { opacity: 0, x: 30 }
);

function btnsIn(el: Element, done: () => void) {
  const eIndex = (el as HTMLElement).dataset.index;
  _btnsIn(el, done).delay((eIndex ? parseInt(eIndex) * 0.1 : 0) + 0.1);
}

function btnsOut(el: Element, done: () => void) {
  const eIndex = (el as HTMLElement).dataset.index;
  _btnsOut(el, done).delay(eIndex ? parseInt(eIndex) * 0.1 : 0);
}
</script>

<template>
  <transition
    @before-enter="_barSetup"
    @enter="(e:Element, d: () => void) => _barIn(e, d).duration(0.3)"
    @leave="(e:Element, d: () => void) => _barOut(e, d)"
    appear>
    <div class="border-b h-[var(--navbar-height)]">
      <div class="navbar column">
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
            @before-enter="_btnsSetup"
            @enter="btnsIn"
            @leave="btnsOut"
            appear
            :css="false">
            <button
              class="btn btn-square btn-ghost"
              title="Help"
              key="help"
              data-index="0">
              <a-icon name="f-question" />
            </button>
            <template v-if="user.isSignedIn">
              <button
                class="btn btn-square btn-ghost"
                title="Settings"
                key="settings"
                data-index="1">
                <a-icon name="f-settings" />
              </button>
              <button
                class="btn btn-square btn-ghost"
                title="Sign out"
                key="signout"
                data-index="2"
                @click="user.signout">
                <a-icon name="f-signout" />
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn-square btn-ghost"
                title="Sign in"
                key="signin"
                data-index="1">
                <a-icon name="f-signin" :horizontalFlip="true" />
              </button>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
  </transition>
</template>
