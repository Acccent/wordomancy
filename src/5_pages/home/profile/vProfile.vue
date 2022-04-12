<script setup lang="ts">
import { user } from '@/3_stores';

const loading = reactive({
  btnFriends: false,
  friendsList: false,
});

async function addFriend(friend: string) {
  loading.btnFriends = true;
  loading.friendsList = true;
  await user.addFriend(friend);
  loading.btnFriends = false;
  loading.friendsList = false;
}

async function removeFriend(friend: string) {
  await user.addFriend(friend);
}
</script>

<template>
  <h3 class="home-section-title">Your friends:</h3>
  <ul class="w-list mx-auto mb-8">
    <li
      v-for="[name] in user.friendsData"
      class="flex justify-between items-center my-4"
      :key="name">
      <button
        class="btn btn-ghost -ml-8 text-base normal-case remove-friend-btn"
        title="Remove friend"
        @click="removeFriend(name)">
        <a-icon class="mr-3" name="f-remove-friend" />
        {{ name }}
      </button>
      <a-list-dotted-line class="ml-0" />
      <div class="flex gap-2">
        <div title="Average guesses to solve Spells" class="flex gap-0.5 w-12">
          <a-icon name="f-stats" />
          <span class="italic text-neutral">WIP</span>
        </div>
      </div>
    </li>
  </ul>

  <p class="mt-12">Add a friend:</p>
  <c-input-with-button
    placeholder="Enter friend's name..."
    button-text="Add friend"
    :loading="loading.btnFriends"
    @submitted="f => addFriend(f)" />

  <h3 class="mt-16 home-section-title">Your stats:</h3>
  <p class="italic text-neutral">WIP</p>

  <h3 class="mt-16 home-section-title">Your Spells:</h3>
  <c-spell-list />
</template>

<style scoped lang="postcss">
.remove-friend-btn {
  svg {
    color: transparent;
    transition: color var(--animation-btn) ease;
  }

  &:hover svg,
  &:focus svg {
    color: hsl(var(--er));
  }
}
</style>
