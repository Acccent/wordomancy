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
</script>

<template>
  <h3 class="home-section-title">Your friends:</h3>
  {{ user.friendNames }}
  <p class="mt-12">Add a friend:</p>
  <c-input-with-button
    placeholder="Enter your friend's name here..."
    button-text="Add friend"
    :loading="loading.btnFriends"
    @submitted="f => addFriend(f)" />

  <h3 class="mt-16 home-section-title">Your Spells:</h3>
  <c-spell-list />
</template>
