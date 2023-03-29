<script lang="ts">
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import { Button, TextBox, ProgressBar } from "fluent-svelte";
  import type { ClientResponseError } from "pocketbase";
  import { fade } from "svelte/transition";

  let error: ClientResponseError | undefined;
  let email = "";
  let password = "";
  let loading = false;

  async function login() {
    if (!email?.trim() || !password?.trim()) return;
    loading = true;
    try {
      await pb.collection("users").authWithPassword(email, password);
      goto("/");
    } catch (_err: unknown) {
      loading = false;
      error = _err as ClientResponseError;
    }
  }
</script>

<div
  class="flex flex-col justify-center items-center w-full flex-grow space-y-4 p-4"
>
  {#if loading}
    <div in:fade={{ duration: 200 }}>
      <ProgressBar
        class="max-w-[8rem] bg-gray-200 bg-opacity-20 rounded-full"
      />
    </div>
  {:else}
    <img src="/logo.png" alt="" class="max-w-32 h-auto" />
    <h2 class="font-bold text-2xl text-center">Inicio de sesión</h2>
    {#if error?.response?.message}
      <p class="no-select pointer-normal text-xs font-bold text-red-500">
        {error.response.message}
      </p>
    {/if}
    <form
      class="bg-[var(--fds-card-background-default)] flex p-4 space-y-4 rounded-lg shadow w-full max-w-[16rem] flex-col"
      on:submit|preventDefault={login}
    >
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Correo</p>
        <TextBox
          required
          class="w-full"
          bind:value={email}
          placeholder="Ej. silvio@gmail.com"
          type="email"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <p class="font-bold text-sm">Contraseña</p>
        <TextBox class="w-full" type="password" bind:value={password} />
      </div>
      <Button type="submit">Iniciar sesión</Button>
    </form>
  {/if}
</div>
