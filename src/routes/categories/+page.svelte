<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
  import PageShell from "$lib/components/PageShell.svelte";
  import { IconButton } from "fluent-svelte";
  export let crud = false;
</script>

<PageShell title="Categorías">
  <div class="flex space-x-4 items-center" slot="commands">
    <IconButton
      on:click={() => {
        crud = true;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="4rem"
        height="4rem"
        viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z"
        /></svg
      >
    </IconButton>
  </div>
  <Categories bind:crud />
</PageShell>
