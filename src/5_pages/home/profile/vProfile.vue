<script setup lang="ts">
import { user, spells } from '@/3_stores';

const loading = reactive({
  friends: false,
});

async function addFriend(friend: string) {
  loading.friends = true;
  await user.addFriend(friend);
  loading.friends = false;
}
</script>

<template>
  <h3 class="home-section-title text-info">Your friends</h3>
  <ul v-if="user.data.friends.length" class="w-list mx-auto mb-8">
    <li
      v-for="[name, friend] in user.friendsData"
      class="flex justify-between items-center"
      :key="name">
      <button
        class="btn btn-ghost -ml-8 text-base normal-case remove-friend-btn"
        title="Remove friend"
        @click="user.confirmRemoveFriend(friend)">
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
  <p v-else>You don't have any friends! :(</p>

  <p class="mt-16">Add a friend:</p>
  <c-input-with-button
    placeholder="Enter friend's name..."
    button-text="Add friend"
    :loading="loading.friends"
    @submitted="f => addFriend(f)" />

  <h3 class="home-section-title">Your stats</h3>
  <p class="italic text-neutral">WIP</p>

  <h3 class="home-section-title">Your Spells</h3>
  <c-spell-list v-if="spells.userSpells.size" />
  <p v-else>You haven't cast any Spells! Go to the Welcome tab to cast one.</p>
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
