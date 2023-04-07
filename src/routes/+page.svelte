<script lang="ts">
  import PageShell from "$lib/components/PageShell.svelte";
  import { pb } from "$lib/pocketbase";
  import { AutoSuggestBox, IconButton, ListItem } from "fluent-svelte";
  import type { Record } from "pocketbase";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  let data: Record[] | undefined;

  onMount(async () => {
    setData();
    pb.collection("dishes").subscribe("*", setData);
  });

  async function setData() {
    data = await pb.collection("dishes").getFullList();
  }

  let searchMatches: any[] = [];
  let searchValue = "";
  let searchSelection = 0;
  let searchFlyoutOpen = false;

  $: searchItems = (data || []).map((e) => e.name);
  $: filtered = (data || []).filter((e) =>
    e.name
      .replaceAll(" ", "")
      .toLowerCase()
      .includes(searchValue.replaceAll(" ", "").toLowerCase())
  );

  function handleSelection(index: number) {
    searchValue = searchItems[index];
    searchSelection = index;
    searchFlyoutOpen = false;
  }
</script>

<PageShell title="Menú" loading={!data}>
  <div class="flex space-x-4 items-center" slot="commands">
    <div class="w-48">
      <AutoSuggestBox
        placeholder="Buscar por nombre"
        bind:open={searchFlyoutOpen}
        bind:value={searchValue}
        bind:selection={searchSelection}
        bind:matches={searchMatches}
        bind:items={searchItems}
      >
        <svelte:fragment slot="item-template" let:index let:id let:item>
          <ListItem
            on:click={() => handleSelection(index)}
            tabindex={-1}
            selected={searchSelection === index}
            class="!cursor-pointer"
            {id}
          >
            {item}
          </ListItem>
        </svelte:fragment>
      </AutoSuggestBox>
    </div>
    {#if ["chef", "admin"].includes(pb.authStore.model?.role)}
      <IconButton href="/menu/new">
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
    {/if}
  </div>

  {#if !filtered.length}
    <div
      class="flex w-full flex-grow flex-col items-center justify-center space-y-4"
    >
      <svg
        in:fly|local={{ y: 5 }}
        xmlns="http://www.w3.org/2000/svg"
        width="6em"
        height="6em"
        viewBox="0 0 20 20"
        ><path
          fill="currentColor"
          d="M4 5c0-1.007.875-1.755 1.904-2.223C6.978 2.289 8.427 2 10 2s3.022.289 4.096.777C15.125 3.245 16 3.993 16 5v4.758a4.485 4.485 0 0 0-1-.502V6.698a4.92 4.92 0 0 1-.904.525C13.022 7.711 11.573 8 10 8s-3.022-.289-4.096-.777A4.92 4.92 0 0 1 5 6.698V15c0 .374.356.875 1.318 1.313c.916.416 2.218.687 3.682.687c.22 0 .437-.006.65-.018c.447.367.966.65 1.534.822c-.68.127-1.417.196-2.184.196c-1.573 0-3.022-.289-4.096-.777C4.875 16.755 4 16.007 4 15V5Zm1 0c0 .374.356.875 1.318 1.313C7.234 6.729 8.536 7 10 7s2.766-.27 3.682-.687C14.644 5.875 15 5.373 15 5c0-.374-.356-.875-1.318-1.313C12.766 3.271 11.464 3 10 3s-2.766.27-3.682.687C5.356 4.125 5 4.627 5 5Zm8.5 12c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 13.5 17Zm0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5Z"
        /></svg
      >
      <p class="text-sm font-bold text-center select-none" in:fly={{ y: 5 }}>
        No se encontró ningún platillo
      </p>
    </div>
  {:else}
    <div class="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
      {#each filtered || [] as e (e.id)}
        <a
          class="rounded-lg flex-col w-full aspect-square items-center justify-center hover:bg-[var(--fds-card-background-default)] flex duration-200 hover:shadow-xl cursor-pointer p-2 space-y-4"
          in:fly={{ y: 5 }}
          href="/menu/{e.id}"
        >
          {#if e.image}
            <div class="flex rounded-lg overflow-hidden">
              <img
                src={pb.getFileUrl(e, e.image)}
                alt="w-full flex object-cover h-full rounded-lg"
              />
            </div>
          {:else}<svg
              xmlns="http://www.w3.org/2000/svg"
              width="4em"
              height="4em"
              viewBox="0 0 16 16"
              ><path
                fill="currentColor"
                d="M4 1.5a.5.5 0 0 0-1 0v3a2.5 2.5 0 0 0 2 2.45v7.55a.5.5 0 0 0 1 0V6.95A2.5 2.5 0 0 0 8 4.5v-3a.5.5 0 0 0-1 0v3a1.5 1.5 0 0 1-1 1.415V1.5a.5.5 0 0 0-1 0v4.415A1.5 1.5 0 0 1 4 4.5v-3Zm7 13V8H9.5a.5.5 0 0 1-.5-.5v-4c0-.663.326-1.283.771-1.729C10.217 1.326 10.837 1 11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0Z"
              /></svg
            >
          {/if}
          <p class="text-sm font-bold text-center select-none">
            {e.name}
          </p>
        </a>
      {/each}
    </div>
  {/if}
</PageShell>
