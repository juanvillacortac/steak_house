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

  export let id: string | undefined = undefined;
  let notFound = false;
  let record: any | undefined;
  let toEdit: Record | undefined;
  let formData = writable<FormData | undefined>();
  let imgData: string | undefined;

  function edit() {
    // @ts-ignore
    toEdit = { ...record };
  }

  function calcQuantity() {
    let q = 0;
    for (const i of ((ingredients as Record[]) || []).sort(
      (a, b) => b.weight - a.weight
    )) {
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
    return q;
  }

  $: save = async () => {
    if (!record || !toEdit) return;
    if ($formData) {
      $formData.append("name", toEdit.name);
      $formData.append("description", toEdit.name);
      if (record.id) {
        await pb.collection("dishes").update(record!.id, $formData);
      } else {
        await pb.collection("dishes").create($formData);
      }
    } else {
      if (record.id) {
        await pb.collection("dishes").update(record.id, {
          ...toEdit,
          ingredients: ingredients.map((i) => i.id),
        });
      } else {
        const d = await pb.collection("dishes").create({
          ...toEdit,
          ingredients: ingredients.map((i) => i.id),
        });
        goto("/menu/" + d.id);
      }
    }
    $formData = undefined;
    // @ts-ignore
    record = toEdit?.clone();
    toEdit = undefined;
  };

  onMount(async () => {
    record = {};
    setData();
    pb.collection("dishes").subscribe("*", setData);
  });

  async function setData() {
    if (!id) return;
    try {
      record = await pb
        .collection("dishes")
        .getOne(id, { expand: "ingredients.ingredient" });
      ingredients = [...((record?.expand.ingredients as Record[]) || [])];
    } catch (err: unknown) {
      notFound = true;
    }
  }

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

  let ingredients: Record[] = [];
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

{#if notFound}
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
{:else if !record && id}
  <div class="flex w-full justify-center items-center pb-4 flex-grow">
    <ProgressRing />
  </div>
{:else}
  {#if !record?.image && !imgData}
    <div class="flex w-full items-center relative p-4 justify-between">
      {#if toEdit}
        <div class="w-50">
          <TextBox bind:value={toEdit.name} />
        </div>
      {:else}
        <h1 class="font-bold text-3xl cursor-default">
          {record.name}
        </h1>
      {/if}
      {#if toEdit}
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
          <IconButton
            on:click={() => {
              toEdit = undefined;
              $formData = undefined;
              imgData = undefined;
              ingredients = record?.ingredients;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              /></svg
            >
          </IconButton>
        </div>
      {:else if pb.authStore.model?.role == "chef"}
        <div class="flex space-x-4">
          <IconButton on:click={edit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              ><path
                fill="currentColor"
                d="M13.44 2.56a1.914 1.914 0 0 0-2.707 0L3.338 9.955a1.65 1.65 0 0 0-.398.644l-.914 2.743a.5.5 0 0 0 .632.632l2.743-.914c.243-.08.463-.217.644-.398l7.395-7.394a1.914 1.914 0 0 0 0-2.708Zm-2 .708a.914.914 0 1 1 1.293 1.292L12 5.294l-1.293-1.293l.734-.733ZM10 4.708l1.292 1.293l-5.954 5.954a.648.648 0 0 1-.253.156l-1.794.598l.598-1.793a.649.649 0 0 1 .156-.254L10 4.708Z"
              /></svg
            >
          </IconButton>
          <IconButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 12 12"
              ><path
                fill="currentColor"
                d="M5 3h2a1 1 0 0 0-2 0ZM4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1H4Zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0V6ZM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5ZM3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11l.436 5.085Z"
              /></svg
            >
          </IconButton>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex w-full h-72 relative items-end">
      <div class="absolute flex w-full h-full">
        <img
          src={imgData && toEdit
            ? imgData
            : pb.getFileUrl(record, record.image)}
          alt=""
          class="w-full h-full object-cover flex"
        />
      </div>
      <div
        class="absolute h-full bg-gradient-to-t from-dark-300 to-transparent flex w-full"
      />
      {#if toEdit}
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
      {/if}
      <div class="flex w-full items-center relative px-4 pb-4 justify-between">
        {#if toEdit}
          <div class="w-50">
            <TextBox bind:value={toEdit.name} />
          </div>
        {:else}
          <h1 class="font-bold text-3xl cursor-default">
            {record.name}
          </h1>
        {/if}
        {#if toEdit}
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
                toEdit = undefined;
                $formData = undefined;
                imgData = undefined;
                ingredients = [...(record?.expand.ingredients || [])];
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                /></svg
              >
            </IconButton>
          </div>
        {:else if pb.authStore.model?.role == "chef"}
          <div class="flex space-x-4">
            <IconButton on:click={edit}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                ><path
                  fill="currentColor"
                  d="M13.44 2.56a1.914 1.914 0 0 0-2.707 0L3.338 9.955a1.65 1.65 0 0 0-.398.644l-.914 2.743a.5.5 0 0 0 .632.632l2.743-.914c.243-.08.463-.217.644-.398l7.395-7.394a1.914 1.914 0 0 0 0-2.708Zm-2 .708a.914.914 0 1 1 1.293 1.292L12 5.294l-1.293-1.293l.734-.733ZM10 4.708l1.292 1.293l-5.954 5.954a.648.648 0 0 1-.253.156l-1.794.598l.598-1.793a.649.649 0 0 1 .156-.254L10 4.708Z"
                /></svg
              >
            </IconButton>
            <IconButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 12 12"
                ><path
                  fill="currentColor"
                  d="M5 3h2a1 1 0 0 0-2 0ZM4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1H4Zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0V6ZM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5ZM3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11l.436 5.085Z"
                /></svg
              >
            </IconButton>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  <div
    class="flex overflow-auto flex-grow h-0 rounded-lg p-4 mt-4 select-none space-x-4"
  >
    <div class="flex flex-col space-y-2 !cursor-normal text-block w-1/2">
      <p class="text-lg font-bold pb-7">
        Platillos disponibles: {calcQuantity()}
      </p>
      <h2 class="text-xl font-bold pointer-events-none">Descripción</h2>
      {#if toEdit}
        <div class="pt-1.1">
          <div
            class="flex flex-col space-y-2 border rounded-lg p-2 border-dark-50 shadow-lg bg-dark-400"
          >
            <Editor value={record.description} />
          </div>
        </div>
      {:else if record.description}
        <div class="flex flex-col pointer-events-none select-none">
          {@html record.description}
        </div>
      {:else}
        <div class="flex flex-col pointer-events-none select-none">
          <p>Sin descripción</p>
        </div>
      {/if}
    </div>
    <div class="flex flex-col space-y-2 !cursor-normal text-block w-1/2">
      <div class="flex w-full justify-between items-center">
        <h2 class="text-xl font-bold pointer-events-none">Ingredientes</h2>
        {#if toEdit}
          <IconButton
            on:click={() => {
              selected = "";
            }}><AddFilled /></IconButton
          >
        {/if}
      </div>
      {#if toEdit}
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
      {:else}
        <ul class="flex-col flex space-y-4 list-disc">
          {#each ingredients as i}
            <li class=" p-2">
              {i.expand.ingredient.name} - {i.weight}{i.expand.ingredient
                .weight_type}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
{/if}
