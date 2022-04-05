<template>
  <c-modal>
    <p class="text-center">No Spell could be found for this code.</p>

    <template #modal-action>
      <div class="flex flex-col items-stretch w-64">
        <a-link-button @click="$router.push({ name: 'home' })">
          Go back Home
        </a-link-button>
        <div class="divider">or</div>
        <a-link-button @click="$router.push({ name: 'spell' })">
          Solve daily Spell
        </a-link-button>
      </div>
    </template>
  </c-modal>
</template>
