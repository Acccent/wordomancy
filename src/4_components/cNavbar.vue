<script setup lang="ts">
import { user } from '@/3_stores';
</script>

<template>
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
          <router-link v-else :to="{ name: user.isSignedIn ? 'home' : 'index' }"
            >Wordomancy</router-link
          >
        </h1>
      </div>
      <div class="flex-none gap-2">
        <button class="btn btn-square btn-ghost" title="Help">
          <a-icon name="f-question" />
        </button>
        <template v-if="user.isSignedIn">
          <button class="btn btn-square btn-ghost" title="Settings">
            <a-icon name="f-settings" />
          </button>
          <button
            class="btn btn-square btn-ghost"
            title="Sign out"
            @click="user.signout">
            <a-icon name="f-signout" />
          </button>
        </template>
        <template v-else>
          <button class="btn btn-square btn-ghost" title="Sign in">
            <a-icon name="f-signin" :horizontalFlip="true" />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
