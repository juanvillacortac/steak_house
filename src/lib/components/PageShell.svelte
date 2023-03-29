<script lang="ts">
  import { ProgressRing } from "fluent-svelte";
  import { fade } from "svelte/transition";

  export let title = "";
  export let loading = false;
</script>

{#if loading}
  <div class="flex w-full justify-center items-center p-4 flex-grow">
    <ProgressRing />
  </div>
{:else}
  <div
    class="flex w-full justify-between items-center p-4"
    in:fade={{ duration: 200 }}
  >
    <h1 class="font-bold text-3xl">{title}</h1>
    <slot name="commands" />
  </div>
  <div class="flex flex-col overflow-auto flex-grow h-0 rounded-lg px-4 pb-4">
    <slot />
  </div>
{/if}
