<script lang="ts">
  import "virtual:windi.css";
  import "fluent-svelte/theme.css";
  import "$lib/app.css";
  import Header from "$lib/components/Header.svelte";
  import { routesMap } from "./routes";
  import { ListItem } from "fluent-svelte";
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";
  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import { ChatBot } from "carbon-icons-svelte";
  import Chat from "$lib/components/Chat.svelte";
  import { expoOut } from "svelte/easing";
  import { onMount } from "svelte";
  let chat = false;

  onMount(() => {
    pb.collection("users").subscribe("*", async ({ action, record }) => {
      if (pb.authStore.model?.id == record.id) {
        if (action == "delete") logout();
        else if (action == "update") pb.collection("users").authRefresh();
      }
    });
  });

  function logout() {
    pb.authStore.clear();
    goto("/login");
  }
</script>

<Header>
  {#if $page.data.hideNav}
    <div class="w-full flex flex-col rounded-lg p-4 flex-grow">
      <slot />
    </div>
  {:else}
    <div class="flex flex-grow w-full p-2 space-x-2 h-full relative">
      {#if chat}
        <div
          class="absolute bottom-24 right-6 z-60"
          transition:fly={{ x: 200, duration: 400, easing: expoOut }}
        >
          <Chat bind:open={chat} />
        </div>
      {/if}
      {#if ["chef", "admin"].includes(pb.authStore.model?.role)}
        <button
          class="absolute bottom-6 right-6 z-20 flex rounded-full items-center justify-center bg-[var(--fds-accent-default)] text-black w-12 h-12 bg-shadow transform duration-200 hover:scale-95"
          on:click={() => (chat = !chat)}
        >
          <ChatBot width="24" height="24" />
        </button>
      {/if}
      <div class="flex sm:w-1/8 flex-col flex-grow justify-between">
        <div class="flex flex-col space-y-2">
          <img
            src="/logo.png"
            alt=""
            class="flex w-9/10 h-auto mx-auto <sm:hidden select-none pointer-events-none"
          />
          <div class="flex flex-col w-full">
            {#each routesMap as r}
              {#if !r.roles?.length || r.roles.includes(pb.authStore.model?.role)}
                <ListItem
                  selected={r.path == "/"
                    ? $page.url.pathname == r.path
                    : $page.url.pathname.startsWith(r.path || "")}
                  href={r.path}
                  class="!cursor-pointer"
                >
                  <svelte:fragment slot="icon">
                    {@html r.icon || ""}
                  </svelte:fragment>
                  <span class="<sm:hidden">{r.name}</span>
                </ListItem>
              {/if}
            {/each}
          </div>
        </div>
        <div class="border-t border-dark-50 pt-2 flex flex-col">
          {#if ["admin"].includes(pb.authStore.model?.role)}
            <ListItem
              class="!cursor-pointer"
              href="/users"
              selected={$page.route.id == "/users"}
            >
              <svelte:fragment slot="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  ><path
                    fill="currentColor"
                    d="M12 11q.825 0 1.413-.588Q14 9.825 14 9t-.587-1.413Q12.825 7 12 7q-.825 0-1.412.587Q10 8.175 10 9q0 .825.588 1.412Q11.175 11 12 11Zm0 2q-1.65 0-2.825-1.175Q8 10.65 8 9q0-1.65 1.175-2.825Q10.35 5 12 5q1.65 0 2.825 1.175Q16 7.35 16 9q0 1.65-1.175 2.825Q13.65 13 12 13Zm0 11q-2.475 0-4.662-.938q-2.188-.937-3.825-2.574Q1.875 18.85.938 16.663Q0 14.475 0 12t.938-4.663q.937-2.187 2.575-3.825Q5.15 1.875 7.338.938Q9.525 0 12 0t4.663.938q2.187.937 3.825 2.574q1.637 1.638 2.574 3.825Q24 9.525 24 12t-.938 4.663q-.937 2.187-2.574 3.825q-1.638 1.637-3.825 2.574Q14.475 24 12 24Zm0-2q1.8 0 3.375-.575T18.25 19.8q-.825-.925-2.425-1.612q-1.6-.688-3.825-.688t-3.825.688q-1.6.687-2.425 1.612q1.3 1.05 2.875 1.625T12 22Zm-7.7-3.6q1.2-1.3 3.225-2.1q2.025-.8 4.475-.8q2.45 0 4.463.8q2.012.8 3.212 2.1q1.1-1.325 1.713-2.95Q22 13.825 22 12q0-2.075-.788-3.887q-.787-1.813-2.15-3.175q-1.362-1.363-3.175-2.151Q14.075 2 12 2q-2.05 0-3.875.787q-1.825.788-3.187 2.151Q3.575 6.3 2.788 8.113Q2 9.925 2 12q0 1.825.6 3.463q.6 1.637 1.7 2.937Z"
                  /></svg
                >
              </svelte:fragment>
              <span class="<sm:hidden">Usuarios</span>
            </ListItem>
          {/if}
          <ListItem class="!cursor-pointer" on:click={logout}>
            <svelte:fragment slot="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                ><path
                  fill="currentColor"
                  d="M112 216a8 8 0 0 1-8 8H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h56a8 8 0 0 1 0 16H48v160h56a8 8 0 0 1 8 8Zm109.66-93.66l-40-40a8 8 0 0 0-11.32 11.32L196.69 120H104a8 8 0 0 0 0 16h92.69l-26.35 26.34a8 8 0 0 0 11.32 11.32l40-40a8 8 0 0 0 0-11.32Z"
                /></svg
              >
            </svelte:fragment>
            <span class="<sm:hidden">Cerrar sesión</span>
          </ListItem>
        </div>
      </div>
      <div
        class="sm:w-6/8 flex flex-col rounded-lg flex-grow overflow-auto bg-dark-300 select-none"
      >
        {#key $page.url.pathname}
          <div
            class="flex flex-grow flex-col"
            in:fly={{ x: -10, duration: 200 }}
          >
            <slot />
          </div>
        {/key}
      </div>
    </div>
  {/if}
</Header>
