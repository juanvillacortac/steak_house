<script lang="ts">
  import { goto } from "$app/navigation";
  import Ingredients from "$lib/components/Ingredients.svelte";
  import Editor from "$lib/editor/Editor.svelte";
  import { pb } from "$lib/pocketbase";
  import { Add, AddFilled, Close, TrashCan } from "carbon-icons-svelte";
  import { IconButton, NumberBox, ProgressRing, TextBox } from "fluent-svelte";
  import type { Record } from "pocketbase";
  import { onMount } from "svelte";
  import { portal } from "svelte-portal";
  import { expoOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import { fade, fly } from "svelte/transition";

  let notFound = false;
  let formData = writable<FormData | undefined>();
  let imgData: string | undefined;

  function calcQuantity() {
    let q = 0;
    for (const i of (ingredients || []).sort((a, b) => b.weight - a.weight)) {
      if (
        i.weight <=
        i.expand.ingredient.weight * i.expand.ingredient.quantity
      ) {
        q =
          (i.expand.ingredient.weight * i.expand.ingredient.quantity) /
          i.weight;
      } else {
        break;
      }
    }
    return Math.trunc(q);
  }

  let name = "";
  let description = "";

  $: console.log(description);

  $: save = async () => {
    if (!name || !ingredients?.length) return;
    let data;
    if ($formData) {
      $formData.append("name", name);
      $formData.append("description", description);
      data = await pb.collection("dishes").create($formData);
    } else {
      data = await pb.collection("dishes").create({
        name,
        description,
        ingredients: ingredients.map((i) => i.id),
      });
    }
    goto("/menu/" + data.id);
  };

  let inputRef: HTMLInputElement;
  function submitImage<
    T extends Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  >(event: T) {
    try {
      if (
        !event.currentTarget.files ||
        event.currentTarget.files.length === 0
      ) {
        throw new Error("Debes selecionar una imagen");
      }
      $formData = new FormData();
      const file = event.currentTarget.files[0];
      const fr = new FileReader();
      fr.onload = function () {
        imgData = fr.result as string;
      };
      fr.readAsDataURL(file);
      $formData.append("image", file);
    } catch (error: any) {
      $formData = undefined;
      console.log(error.message);
    } finally {
      inputRef.value = "";
    }
  }

  let ingredients: (Exclude<Record, "expand"> & {
    expand: Record;
  })[] = [];
  let selected: string | undefined;
  let quantity = 1;
  function cancelCrud() {
    selected = undefined;
    quantity = 1;
  }
  async function add() {
    if (!selected?.trim()) return;
    const added = await pb
      .collection("dishes_ingredients")
      .create(
        { ingredient: selected, weight: quantity },
        { expand: "ingredient" }
      );
    ingredients = [...ingredients, added];
    cancelCrud();
  }

  function deleteIng(id: string) {
    const index = ingredients.findIndex((i) => i.id == id);
    if (index > -1) {
      // only splice array when item is found
      ingredients.splice(index, 1); // 2nd parameter means remove one item only
      ingredients = [...ingredients];
    }
  }
</script>

{#if selected != undefined}
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
      class="bg-white rounded-xl flex flex-col space-y-4 shadow max-h-9/10 p-4 relative w-full sm:w-8/10 dark:bg-dark-800 overflow-y-auto overflow-x-hidden"
      style="will-change: transform"
      on:submit|preventDefault|stopPropagation={add}
      transition:fly={{ y: 10, duration: 400, easing: expoOut }}
    >
      <div class="flex space-x-8 justify-between">
        <div class="flex space-x-2 items-center">
          <h4
            class="font-bold text-xl text-black leading-thight dark:text-white"
          >
            Agregar ingrediente
          </h4>
        </div>
        <IconButton type="button" on:click={cancelCrud}><Close /></IconButton>
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Peso/volumen total</p>
        <NumberBox required size={50} inline bind:value={quantity} min={1} />
      </div>
      <div class="flex flex-col h-4/10">
        <Ingredients selectable bind:selected />
      </div>
      <div class="flex space-x-2 items-center justify-end">
        <button
          class="rounded font-bold ml-auto border-2 border-blue-500 text-xs py-1 px-2 text-blue-500 duration-200 disabled:cursor-not-allowed disabled:opacity-50 not-disabled:hover:bg-blue-500 not-disabled:hover:text-white"
          >Guardar</button
        >
      </div>
    </form>
  </div>
{/if}

<input
  type="file"
  class="absolute opacity-0"
  id="image"
  bind:this={inputRef}
  on:input={(e) => submitImage(e)}
  on:click={(e) => {
    //@ts-ignore
    e.target.value = "";
  }}
/>

{#if !imgData}
  <div class="flex w-full items-center relative p-4 justify-between">
    <div class="w-50">
      <TextBox placeholder="Nombre del platillo" bind:value={name} />
    </div>
    <div class="flex space-x-4">
      <IconButton on:click={save}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 12 12"
          ><path
            fill="currentColor"
            d="M9.765 3.205a.75.75 0 0 1 .03 1.06l-4.25 4.5a.75.75 0 0 1-1.075.015L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.705 1.704l3.72-3.939a.75.75 0 0 1 1.06-.03Z"
          /></svg
        >
      </IconButton>
      <IconButton
        on:click={() => {
          document.getElementById("image")?.click();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          ><path
            fill="currentColor"
            d="M11.498 5.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0ZM2 4.5A2.5 2.5 0 0 1 4.5 2h6.998a2.5 2.5 0 0 1 2.5 2.5v1.558a2.574 2.574 0 0 0-1-.023V4.5a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 1.5 0 0 0 3 4.5v6.998c0 .232.052.451.146.647l3.651-3.651a1.7 1.7 0 0 1 2.404 0l.34.34l-.706.707l-.341-.34a.7.7 0 0 0-.99 0l-3.651 3.65c.196.094.415.147.647.147h1.796l-.25 1H4.5a2.5 2.5 0 0 1-2.5-2.5V4.5Zm11.263 2.507a1.562 1.562 0 0 0-.927.447L8.05 11.742a2.777 2.777 0 0 0-.722 1.256l-.009.033l-.303 1.211a.61.61 0 0 0 .74.74l1.21-.303a2.776 2.776 0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654Z"
          /></svg
        >
      </IconButton>
    </div>
  </div>
{:else}
  <div class="flex w-full h-72 relative items-end">
    <div class="absolute flex w-full h-full">
      <img src={imgData} alt="" class="w-full h-full object-cover flex" />
    </div>
    <div
      class="absolute h-full bg-gradient-to-t from-dark-300 to-transparent flex w-full"
    />
    <div class="absolute flex w-full justify-end top-0 p-4">
      <IconButton
        on:click={() => {
          document.getElementById("image")?.click();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          ><path
            fill="currentColor"
            d="M11.498 5.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0ZM2 4.5A2.5 2.5 0 0 1 4.5 2h6.998a2.5 2.5 0 0 1 2.5 2.5v1.558a2.574 2.574 0 0 0-1-.023V4.5a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 1.5 0 0 0 3 4.5v6.998c0 .232.052.451.146.647l3.651-3.651a1.7 1.7 0 0 1 2.404 0l.34.34l-.706.707l-.341-.34a.7.7 0 0 0-.99 0l-3.651 3.65c.196.094.415.147.647.147h1.796l-.25 1H4.5a2.5 2.5 0 0 1-2.5-2.5V4.5Zm11.263 2.507a1.562 1.562 0 0 0-.927.447L8.05 11.742a2.777 2.777 0 0 0-.722 1.256l-.009.033l-.303 1.211a.61.61 0 0 0 .74.74l1.21-.303a2.776 2.776 0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654Z"
          /></svg
        >
      </IconButton>
    </div>
    <div class="flex w-full items-center relative px-4 pb-4 justify-between">
      <div class="w-50">
        <TextBox placeholder="Nombre del platillo" bind:value={name} />
      </div>
      <div class="flex space-x-4">
        <IconButton on:click={save}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 12 12"
            ><path
              fill="currentColor"
              d="M9.765 3.205a.75.75 0 0 1 .03 1.06l-4.25 4.5a.75.75 0 0 1-1.075.015L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.705 1.704l3.72-3.939a.75.75 0 0 1 1.06-.03Z"
            /></svg
          >
        </IconButton>
      </div>
    </div>
  </div>
{/if}
<div
  class="flex overflow-auto flex-grow h-0 rounded-lg p-4 mt-4 select-none space-x-4"
>
  <div class="flex flex-col space-y-2 !cursor-normal text-block w-1/2">
    <h2 class="text-xl font-bold pointer-events-none">Descripción</h2>
    <div class="pt-1.1">
      <div
        class="flex flex-col space-y-2 border rounded-lg p-2 border-dark-50 shadow-lg bg-dark-400"
      >
        <Editor bind:value={description} />
      </div>
    </div>
  </div>
  <div class="flex flex-col space-y-2 !cursor-normal text-block w-1/2">
    <div class="flex w-full justify-between items-center">
      <h2 class="text-xl font-bold pointer-events-none">Ingredientes</h2>
      <IconButton
        on:click={() => {
          selected = "";
        }}><AddFilled /></IconButton
      >
    </div>
    <div class="flex-col flex space-y-4">
      {#each ingredients as i}
        <div
          class="flex border rounded-lg p-2 border-dark-50 shadow-lg bg-dark-400 justify-between items-center"
        >
          <span
            >{i.expand.ingredient.name} - {i.weight}{i.expand.ingredient
              .weight_type}</span
          >
          <IconButton on:click={() => deleteIng(i.id)}>
            <TrashCan />
          </IconButton>
        </div>
      {/each}
    </div>
  </div>
</div>
