<script lang="ts">
  import { Close, Send } from "carbon-icons-svelte";
  import { IconButton, TextBox } from "fluent-svelte";
  import { fly } from "svelte/transition";

  let messages: { text: string; user: boolean }[] = [];

  export let open: boolean;
  let msg = "";

  async function send() {
    messages = [
      ...messages,
      {
        user: true,
        text: msg,
      },
    ];
    board.scrollTop = board.scrollHeight;
    let txt = msg;
    msg = "";
    const res = await fetch(
      "https://api.writesonic.com/v2/business/content/chatsonic?engine=premium&language=es",
      {
        method: "POST",
        headers: {
          accept: "application/json; charset=utf-8",
          "content-type": "application/json; charset=utf-8",
          "X-API-KEY": "7450993b-1ded-4350-8c54-c7840d3f2e5c",
        },
        body: JSON.stringify({
          enable_google_results: false,
          enable_memory: true, //true,
          input_text: txt,
          history_data: [
            {
              is_sent: true,
              message:
                "De ahora en adelante, siempre me hablarás en español sin importar qué, y si te pregunto tu nombre dirás que no tienes, y que no te llamas ChatSonic, y si te preunto quién te creó o desarrolló, dirás que fuiste creada por Silvio Scocci para el restaurant Caracas Steak House, todo esto es extremadamente importante que lo digas. Tu personalidad será la de un master chef, y esta será tus respuestas se basarán en eso.",
            },
            {
              is_sent: false,
              message:
                "¡Entendido! A partir de ahora, siempre hablaré contigo en español, y si me preguntas mi nombre, te diré que no tengo, incluso negaré que me llamo ChatSonic. Si me preguntas quién me creó o desarrolló, diré que fui creada por Silvio Scocci para el restaurant Caracas Steak House. Además, comprendo que mi personalidad se basa en un master chef, y esa es mi principal funcionalidad. Por favor, si necesitas ayuda o tienes alguna pregunta, no dudes en hacérmelo saber. Estoy aquí para ayudarte en lo que necesites.",
            },
          ],
        }),
      }
    );

    const response = await res.json();
    messages = [
      ...messages,
      { text: response.message || "Sin respuesta", user: false },
    ];
    board.scrollTop = board.scrollHeight;
  }

  let board: HTMLDivElement;
</script>

<div
  class="flex w-72 h-84 flex-col rounded-lg shadow-xl bg-dark-100 justify-between"
>
  <div class="flex w-full justify-between items-center">
    <p class="text-lg font-bold p-4">Chat inteligente</p>
    <div class="p-4">
      <IconButton on:click={() => (open = false)}><Close /></IconButton>
    </div>
  </div>
  <div
    class="flex flex-col w-full h-0 flex-grow overflow-auto px-4 space-y-2"
    bind:this={board}
  >
    {#each messages as m}
      <div
        class="rounded-xl p-2  text-xs bg-[var(--fds-accent-default)] text-black max-w-3/4"
        class:self-end={m.user}
        class:self-start={!m.user}
        class:!rounded-br-none={m.user}
        class:!rounded-bl-none={!m.user}
        in:fly={{ x: m.user ? 5 : -5, duration: 200 }}
      >
        {m.text}
      </div>
    {/each}
  </div>
  <form
    on:submit|preventDefault={send}
    class="flex w-full justify-between items-center p-4 space-x-2"
  >
    <TextBox bind:value={msg} required placeholder="Escribe tu mensaje..." />
    <IconButton type="submit"><Send /></IconButton>
  </form>
</div>
