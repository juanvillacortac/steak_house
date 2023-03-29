<script lang="ts">
  import { tooltip } from "$lib/components/tooltip";
  import { onMount, tick } from "svelte";
  import {
    ChevronSort,
    ChevronUp,
    ChevronRight,
    ChevronDown,
    Calendar,
    ChevronLeft,
    Edit,
    Close,
    TrashCan,
    Checkmark,
  } from "carbon-icons-svelte";
  import { browser } from "$app/environment";
  import Submenu from "$lib/components/Submenu.svelte";
  import { fade, fly } from "svelte/transition";
  import { expoOut } from "svelte/easing";
  import Ufo from "$lib/components/__Ufo.svelte";
  import { clamp } from "$lib/utils/math";
  import { page } from "$app/stores";
  import { pb } from "$lib/pocketbase";
  import type { ListResult, Record as _Record } from "pocketbase";
  import { ComboBox, IconButton, NumberBox, TextBox } from "fluent-svelte";
  import { portal } from "svelte-portal";

  export let categories: _Record[] = [];
  export let data: ListResult<_Record> | undefined = undefined;
  export let total: number | undefined = undefined;

  let pageNumber = 1;

  let frame: HTMLDivElement | undefined;

  onMount(() => {
    pb.collection("ingredients").subscribe("*", () => {
      search(nameSearch, sortBy);
    });
  });

  let timeout: number;
  let waitTimeout: number;
  let nameSearch = "";
  export let selected = "";
  const search = (..._deps: any[]) => {
    const find = async () => {
      waitTimeout = setTimeout(() => {
        data = undefined;
        total = undefined;
        tick();
      }, 100);
      const filtered = await pb
        .collection("ingredients")
        .getList(pageNumber, 5, {
          filter: nameSearch
            ? `id ~ "%${nameSearch}%" || name ~ "%${nameSearch}%" || category.name ~ "%${nameSearch}%"`
            : "",
          sort: sortBy,
          expand: "category",
        });
      categories = await pb.collection("categories").getFullList();
      clearTimeout(waitTimeout);
      data = filtered;
      wait = true;
      total = filtered.totalPages;
      if (frame) frame.scrollTop = 0;
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    if (wait) {
      timeout = setTimeout(() => find(), 500);
    } else {
      find();
    }
  };

  let sortBy = "name";
  let wait = true;

  $: if (browser && sortBy) {
    wait = false;
  }

  $: if (browser) {
    pageNumber;
    search(nameSearch, sortBy);
  }

  export let selectable = false;

  const mediaqueries = {
    small: "(max-width: 849px)",
    large: "(min-width: 850px)",
    short: "(max-height: 399px)",
    landscape: "(orientation: landscape) and (max-height: 499px)",
    tiny: "(orientation: portrait) and (max-height: 599px)",
    dark: "(prefers-color-scheme: dark)",
    noanimations: "(prefers-reduced-motion: reduce)",
  };

  export let crud = false;
  let toEdit: Record<string, any> = {
    name: "",
    weight: 0,
    quantity: 0,
    category: null,
    weight_type: "gr",
    cooled: false,
  };

  function cancelCrud() {
    crud = false;
    toEdit = {
      name: "",
      weight: 0,
      quantity: 0,
      category: null,
      weight_type: "gr",
      cooled: false,
    };
  }

  async function save() {
    if (toEdit.id) {
      await pb.collection("ingredients").update(toEdit.id, toEdit);
    } else {
      await pb.collection("ingredients").create(toEdit);
    }
    cancelCrud();
  }

  async function del() {
    await pb.collection("ingredients").delete(toEdit.id);
  }
</script>

{#if crud}
  <div
    class="flex h-full w-full top-0 z-99 fixed items-center justify-center backdrop-filter backdrop-blur-md"
    transition:fade={{ duration: 300, easing: expoOut }}
    use:portal
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="bg-black h-full w-full opacity-70 absolute"
      on:click={cancelCrud}
    />
    <form
      class="bg-white rounded-xl flex flex-col space-y-4 shadow max-h-9/10 p-4 relative w-full sm:w-4/10 dark:bg-dark-800 overflow-y-auto overflow-x-hidden"
      style="will-change: transform"
      on:submit|preventDefault|stopPropagation={save}
      transition:fly={{ y: 10, duration: 400, easing: expoOut }}
    >
      <div class="flex space-x-8 justify-between">
        <div class="flex space-x-2 items-center">
          <h4
            class="font-bold text-xl text-black leading-thight dark:text-white"
          >
            {toEdit.id ? "Editar" : "Crear"} ingrediente
          </h4>
        </div>
        <IconButton type="button" on:click={cancelCrud}><Close /></IconButton>
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Nombre</p>
        <TextBox
          required
          class="w-full"
          bind:value={toEdit.name}
          placeholder="Ej. Pechuga de pollo"
        />
      </div>
      <div class="flex w-full space-x-4 items-center">
        <div class="flex flex-col space-y-2">
          <p class="font-bold text-sm">Cantidad disponible</p>
          <NumberBox
            required
            size={50}
            inline
            bind:value={toEdit.quantity}
            min={0}
          />
        </div>
        <div class="flex flex-col space-y-2">
          <p class="font-bold text-sm">Peso por unidad</p>
          <NumberBox
            required
            size={50}
            inline
            bind:value={toEdit.weight}
            min={0}
          />
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Unidad de medida</p>
        <ComboBox
          items={[
            { name: "Gramos", value: "gr" },
            { name: "Mililitros", value: "l" },
          ]}
          value={toEdit.weight_type}
        />
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Categoría</p>
        <ComboBox
          items={categories.map((c) => ({ name: c.name, value: c.id }))}
          bind:value={toEdit.category}
        />
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Conservación</p>
        <ComboBox
          items={[
            { name: "Seco", value: false },
            { name: "Refrigerado", value: true },
          ]}
          value={toEdit.cooled}
        />
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Fecha de vencimiento</p>
        <div class="flex space-x-4 justify-between w-full items-center">
          <TextBox
            class="w-full"
            value={toEdit.expirationDate
              ? new Date(toEdit.expirationDate).toLocaleString()
              : "N/A"}
            disabled
          />
          <div class="relative">
            <input
              type="date"
              class="opacity-0 w-0 h-0 absolute"
              id="expirationDate"
              bind:value={toEdit.expirationDate}
            />
            <IconButton
              type="button"
              class="relative"
              on:click={() => {
                document.getElementById("expirationDate")?.click();
              }}
              ><Calendar />
            </IconButton>
          </div>
          {#if toEdit.expirationDate}
            <IconButton
              type="button"
              class="relative"
              on:click={() => {
                toEdit.expirationDate = null;
              }}
              ><TrashCan />
            </IconButton>
          {/if}
        </div>
      </div>
      <div class="flex space-x-2 items-center justify-end">
        {#if toEdit.id}
          <button
            type="button"
            on:click={del}
            class="rounded font-bold ml-auto border-2 border-red-500 text-xs py-1 px-2 text-red-500 duration-200 disabled:cursor-not-allowed disabled:opacity-50 not-disabled:hover:bg-red-500 not-disabled:hover:text-white"
            on:click={cancelCrud}>Eliminar</button
          >
        {/if}
        <button
          class="rounded font-bold ml-auto border-2 border-blue-500 text-xs py-1 px-2 text-blue-500 duration-200 disabled:cursor-not-allowed disabled:opacity-50 not-disabled:hover:bg-blue-500 not-disabled:hover:text-white"
          >Guardar</button
        >
      </div>
    </form>
  </div>
{/if}

<div
  class="border rounded-lg flex flex-col space-y-4 bg-gray-50 border-gray-300 w-full p-4 dark:bg-dark-700 dark:border-dark-100"
>
  <div class="flex space-x-2 w-full justify-between items-center">
    <input
      class="bg-white border rounded border-gray-300 text-xs leading-tight w-full py-2 px-3 appearance-none dark:bg-dark-400 dark:border-dark-100 focus:outline-none focus:shadow-outline"
      type="search"
      bind:value={nameSearch}
      placeholder="Busca por id, nombre o categoría"
    />
    <Submenu>
      <button
        class="border-transparent rounded flex space-x-1 border-2 p-1 duration-200 whitespace-nowrap items-center hover:border-gray-300 dark:hover:border-dark-100"
        type="button"
        slot="button"
      >
        <div class="text-xs">Ordenar por</div>
        <ChevronSort /></button
      >
      <div
        class="flex flex-col font-bold divide-y-1 divide-gray-300 text-xs text-gray-80 dark:divide-gray-600 dark:text-white"
        slot="body"
      >
        <div class="flex flex-col space-y-3 pb-3">
          <p class="font-bold">Nombre</p>
          <label class="flex font-normal space-x-2 text-xs">
            <input type="radio" value="name" bind:group={sortBy} />
            <div class="flex space-x-1 items-center">
              <ChevronUp />
              <span>Ascendente</span>
            </div>
          </label>
          <label class="flex font-normal space-x-2 text-xs">
            <input type="radio" value="-name" bind:group={sortBy} checked />
            <div class="flex space-x-1 items-center">
              <ChevronDown />
              <span>Descendente</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col space-y-3 py-3">
          <p class="font-bold">Fecha de creación</p>
          <label class="flex font-normal space-x-2 text-xs">
            <input type="radio" value="created" bind:group={sortBy} />
            <div class="flex space-x-1 items-center">
              <ChevronUp />
              <span>Ascendente</span>
            </div>
          </label>
          <label class="flex font-normal space-x-2 text-xs">
            <input type="radio" value="-created" bind:group={sortBy} checked />
            <div class="flex space-x-1 items-center">
              <ChevronDown />
              <span>Descendente</span>
            </div>
          </label>
        </div>
        <div class="flex flex-col space-y-3 pt-3">
          <p class="font-bold">Fecha de actualización</p>
          <label class="flex font-normal space-x-2 text-xs">
            <input type="radio" value="updated" bind:group={sortBy} />
            <div class="flex space-x-1 items-center">
              <ChevronUp />
              <span>Ascendente</span>
            </div>
          </label>
          <label class="flex font-normal space-x-2 text-xs">
            <input type="radio" value="-updated" bind:group={sortBy} checked />
            <div class="flex space-x-1 items-center">
              <ChevronDown />
              <span>Descendente</span>
            </div>
          </label>
        </div>
      </div>
    </Submenu>
  </div>
  {#if data && !data.items.length}
    <div
      class="flex flex-col h-full mx-auto space-y-6 w-full py-8 items-center lg:w-8/10"
      in:fly|local={{ y: 10, duration: 400, easing: expoOut }}
    >
      <div class="w-5/10 lg:w-2/10">
        <Ufo class="h-auto w-full" />
      </div>
      <div class="font-bold font-title text-xl">Nada por acá</div>
    </div>
  {:else}
    <div
      class="bg-white border rounded-lg flex border-gray-300 w-full h-full relative overflow-auto dark:bg-dark-700 dark:border-dark-100"
      class:max-h-50={selectable}
      bind:this={frame}
    >
      {#if !data}
        <div class="h-50vh w-full skeleton" />
      {:else}
        <table
          class="text-sm text-left w-full text-gray-500 relative overflow-auto dark:text-gray-400"
        >
          <thead
            class="bg-gray-50 text-xs top-0 text-gray-700 z-20 uppercase sticky dark:bg-dark-400 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="py-3 px-6"> Id </th>
              <th scope="col" class="py-3 px-6"> Nombre </th>
              <th scope="col" class="py-3 px-6"> Categoría </th>
              <th scope="col" class="py-3 px-6 text-right"> Cantidad </th>
              <th scope="col" class="py-3 px-6 text-right">
                Medida por unidad
              </th>
              <th scope="col" class="py-3 px-6 text-right"> Total </th>
              <th scope="col" class="py-3 px-6"> Conservación </th>
              <th scope="col" class="py-3 px-6"> Vencimiento </th>
              <th scope="col" class="py-3 px-6"> Agregado el </th>
              <th scope="col" class="py-3 px-6"> Actualizado el </th>
              <th scope="col" class="text-right py-3 px-6"> Acciones </th>
            </tr>
          </thead>
          <tbody>
            {#each data.items as c, idx}
              <tr
                class="bg-white dark:bg-dark-800"
                class:!bg-dark-300={selected == c.id}
                class:border-b={idx !== data.items.length - 1}
                class:dark:border-gray-700={idx !== data.items.length - 1}
              >
                <td
                  class="font-bold py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div class="flex w-6ch">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <button
                      class="rounded cursor-pointer font-normal bg-gray-100 text-xs p-1 transform whitespace-nowrap overflow-ellipsis overflow-hidden dark:bg-dark-100 hover:overflow-visible "
                      title="Copiar al portapapeles"
                      on:click={() => navigator.clipboard.writeText(c.id)}
                      use:tooltip
                    >
                      {c.id}
                    </button>
                  </div>
                </td>
                <td>
                  <div class="flex space-x-2 w-full py-4 px-6 items-center">
                    <p class="font-bold text-xs">
                      {c.name}
                    </p>
                  </div>
                </td>
                <td>
                  <div class="flex space-x-2 w-full py-4 px-6 items-center">
                    <p class="font-bold text-xs">
                      {c.expand.category?.name || "N/A"}
                    </p>
                  </div>
                </td>
                <td>
                  <div
                    class="flex space-x-2 w-full py-4 px-6 items-center text-right justify-end"
                  >
                    <p class="font-bold text-xs">
                      {c.quantity}
                    </p>
                  </div>
                </td>
                <td>
                  <div
                    class="flex space-x-2 w-full py-4 px-6 items-center text-right justify-end"
                  >
                    <p class="font-bold text-xs">
                      {c.weight}{c.weight_type}
                    </p>
                  </div>
                </td>
                <td>
                  <div
                    class="flex space-x-2 w-full py-4 px-6 items-center text-right justify-end"
                  >
                    <p class="font-bold text-xs">
                      {c.weight * c.quantity}{c.weight_type}
                    </p>
                  </div>
                </td>
                <td>
                  <div class="flex py-4 px-6">
                    <p class="font-bold text-xs">
                      {c.cooled ? "Refrigerado" : "Seco"}
                    </p>
                  </div>
                </td>
                <td>
                  <div class="flex py-4 px-6">
                    <p class="font-bold text-xs">
                      {c.expirationDate
                        ? new Date(c.expirationDate).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </td>
                <td>
                  <div class="flex py-4 px-6">
                    <p class="font-bold text-xs">
                      {new Date(c.created).toLocaleString()}
                    </p>
                  </div>
                </td>
                <td>
                  <div class="flex py-4 px-6">
                    <p class="font-bold text-xs">
                      {new Date(c.updated).toLocaleString()}
                    </p>
                  </div>
                </td>
                <td class="text-right py-4 px-6">
                  <div class="flex space-x-1 items-center justify-center">
                    {#if selectable}
                      <IconButton
                        type="button"
                        on:click={() => {
                          selected = c.id;
                        }}
                      >
                        <Checkmark class="flex" />
                      </IconButton>
                    {:else}
                      <IconButton
                        on:click={() => {
                          crud = true;
                          toEdit = c.export();
                        }}
                      >
                        <Edit class="flex" />
                      </IconButton>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
    <div class="flex w-full items-center justify-between">
      <span class="font-bold text-xs leading-0">
        {data?.totalItems || 0} ingredientes encontrados
      </span>
      <div class="flex space-x-2 items-center">
        <button
          title="Previous page"
          use:tooltip
          on:click={() => {
            pageNumber = clamp({
              min: 1,
              max: data?.totalPages || 1,
              val: pageNumber - 1,
            });
          }}
        >
          <ChevronLeft />
        </button>
        <div
          class="flex font-bold space-x-2 text-xs text-gray-400 uppercase items-center"
        >
          <select
            bind:value={pageNumber}
            class="bg-transparent font-bold py-1 appearance-none !border-none !outline-none"
          >
            {#each Array.from({ length: data?.totalPages || 1 })
              .fill({})
              .map((_, idx) => idx + 1) as n}
              <option value={n}>{n}</option>
            {/each}
          </select>
          <span>/</span>
          <p>{data?.totalPages || 1}</p>
        </div>
        <button
          title="Next page"
          use:tooltip
          on:click={() => {
            pageNumber = clamp({
              min: 1,
              max: data?.totalPages || 1,
              val: pageNumber + 1,
            });
          }}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  {/if}
</div>
