<script lang="ts">
  import PageShell from "$lib/components/PageShell.svelte";
  import { pb } from "$lib/pocketbase";
  import Chart from "./Chart.svelte";

  $: dishesCount = pb
    .collection("dishes")
    .getList(1, 1, { $autoCancel: false });

  $: ingredientsCount = pb
    .collection("ingredients")
    .getList(1, 1, { $autoCancel: false });

  $: exitsCount = pb
    .collection("inventory_items")
    .getList(1, 1, { $autoCancel: false, filter: 'type = "exit"' });

  $: entriesCount = pb
    .collection("inventory_items")
    .getList(1, 1, { $autoCancel: false, filter: 'type = "entry"' });
</script>

<PageShell title="Reportes">
  <div class="flex flex-col space-y-4">
    <div
      class="mx-auto w-full grid gap-6 grid-cols-1 print:grid-cols-3 sm:grid-cols-2"
    >
      <div
        class="bg-white border rounded-lg flex flex-col border-gray-300 text-right w-full p-4 transform transition-transform duration-200 dark:bg-dark-700 dark:border-dark-100"
        style:will-change="transform"
      >
        <h4 class="font-bold text-lg print:text-sm">Platillos registrados</h4>
        <p class="font-bold text-4xl print:text-xl">
          {#await dishesCount then e}
            {e.totalItems}
          {/await}
        </p>
      </div>
      <div
        class="bg-white border rounded-md flex flex-col border-gray-300 text-right w-full p-4 transform transition-transform duration-200 dark:bg-dark-700 dark:border-dark-100"
        style:will-change="transform"
      >
        <h4 class="font-bold text-lg print:text-sm">
          Ingredientes registrados
        </h4>
        <p class="font-bold text-4xl print:text-xl">
          {#await ingredientsCount then e}
            {e.totalItems}
          {/await}
        </p>
      </div>
      <div
        class="bg-white border rounded-md flex flex-col border-gray-300 text-right w-full p-4 transform transition-transform duration-200 dark:bg-dark-700 dark:border-dark-100"
        style:will-change="transform"
      >
        <h4 class="font-bold text-lg print:text-sm">Salidas de inventario</h4>
        <p class="font-bold text-4xl print:text-xl text-red-500">
          {#await exitsCount then e}
            {e.totalItems}
          {/await}
        </p>
      </div>
      <div
        class="bg-white border rounded-md flex flex-col border-gray-300 text-right w-full p-4 transform transition-transform duration-200 dark:bg-dark-700 dark:border-dark-100"
        style:will-change="transform"
      >
        <h4 class="font-bold text-lg print:text-sm">Entradas de inventario</h4>
        <p class="font-bold text-4xl print:text-xl text-green-500">
          {#await entriesCount then e}
            {e.totalItems}
          {/await}
        </p>
      </div>
    </div>
    <div class="flex-col flex mx-auto space-y-4 w-full">
      <div class="flex space-x-4 items-center">
        <h3 class="font-bold font-title text-black text-2xl dark:text-white">
          Salidas de inventario en los últimos 6 meses
        </h3>
      </div>
      <div class="w-7/10 mx-auto">
        <Chart type="exit" />
      </div>
    </div>
    <div class="flex-col flex mx-auto space-y-4 w-full">
      <div class="flex space-x-4 items-center">
        <h3 class="font-bold font-title text-black text-2xl dark:text-white">
          Entradas de inventario en los últimos 6 meses
        </h3>
      </div>
      <div class="w-7/10 mx-auto">
        <Chart type="entry" />
      </div>
    </div>
  </div></PageShell
>
