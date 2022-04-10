<script setup lang="ts">
import { user, spells } from '@/3_stores';

const loading = reactive({
  btnFriends: false,
  friendsList: false,
});

const friendInput = ref('');
async function addFriend() {
  loading.btnFriends = true;
  loading.friendsList = true;
  await user.addFriend(friendInput.value);
  loading.btnFriends = false;
  loading.friendsList = false;
}
</script>

<template>
  <div class="text-center">
    <p class="mt-8">Add a friend:</p>
    <div class="form-control mt-4">
      <div class="input-group justify-center">
        <input
          type="text"
          placeholder="Enter your friend's name here..."
          class="input input-bordered text-lg"
          v-model="friendInput" />
        <a-button
          class="btn-primary"
          :loading="loading.btnFriends"
          @click="addFriend">
          Add friend
        </a-button>
      </div>
    </div>
    <p>Your friends:</p>
    {{ user.friendNames }}

    <p>Your Spells:</p>
    <c-spell-list :list="spells.sortedUserSpells" />
  </div>
</template>
