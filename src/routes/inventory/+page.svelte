<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
  import Inventory from "$lib/components/Inventory.svelte";
  import PageShell from "$lib/components/PageShell.svelte";
  import { Button } from "fluent-svelte";
  export let crud: "entry" | "exit" | false = false;
</script>

<PageShell title="Inventario">
  <div class="flex space-x-4 items-center" slot="commands">
    <Button
      on:click={() => {
        crud = "exit";
      }}
    >
      Nueva salida
    </Button>
    <Button
      variant="accent"
      on:click={() => {
        crud = "entry";
      }}
    >
      Nueva entrada
    </Button>
  </div>
  <Inventory bind:crud />
</PageShell>
