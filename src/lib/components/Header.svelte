<script lang="ts">
  import { appWindow } from "@tauri-apps/api/window";
  import { page } from "$app/stores";
  import { slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
</script>

<div
  class="flex flex-col min-h-screen rounded-br-[10px] rounded-bl-[10px] overflow-hidden rounded-[10px]"
>
  <header
    data-tauri-drag-region
    class="sticky top-0 flex w-full justify-between overflow-hidden"
  >
    <div class="flex items-center">
      {#if !$page.data.header?.hideBack}
        <button
          class="hover:bg-gray-500 hover:bg-opacity-20 items-center justify-center h-full px-2 transition-colors duration-100"
          transition:slide={{ duration: 300, axis: "x", easing: cubicOut }}
          on:click={() => {
            window.history.back();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6L12 20Z"
            /></svg
          >
        </button>
      {/if}
      <div class="p-2 select-none text-xs font-bold pointer-events-none">
        <p>Steak House</p>
      </div>
    </div>
    <div class="flex items-center">
      <button
        class="hover:bg-gray-500 hover:bg-opacity-20 items-center justify-center h-full px-2 transition-colors duration-100"
        on:click={() => {
          appWindow.minimize();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          ><path fill="currentColor" d="M20 14H4v-4h16" /></svg
        >
      </button>
      <button
        class="hover:bg-gray-500 hover:bg-opacity-20 items-center justify-center h-full px-2 transition-colors duration-100"
        on:click={() => {
          appWindow.toggleMaximize();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          ><path fill="currentColor" d="M4 4h16v16H4V4m2 4v10h12V8H6Z" /></svg
        >
      </button>
      <button
        class="hover:bg-red-500 items-center justify-center h-full px-2 transition-colors duration-100"
        on:click={() => {
          appWindow.close();
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
      </button>
    </div>
  </header>
  <main class="flex flex-col flex-grow w-full">
    <slot />
  </main>
</div>
