<script lang="ts">
  import Result from "$components/animal-result.svelte";
  import { BuyMeACoffee, Github } from "$components/icons";
  import Recorder from "$components/voice-recorder.svelte";
  import type { PageProps } from "./$types";
  import type { Animal } from "./api/animals/+server";

  let { data }: PageProps & { data: { animals: Animal[] } } = $props();

  let recording = $state<boolean>(false);
  let peakDecibel = $state<number>(0);

  let matchedAnimal = $derived.by(() => {
    if (!recording && peakDecibel) {
      return data?.animals?.find(findMatchedAnimal(peakDecibel));
    }
    return undefined;
  });

  function findMatchedAnimal(decibel: number) {
    return (animal: Animal) =>
      decibel >= animal.decibel.min && decibel <= animal.decibel.max;
  }
</script>

<div
  class="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8"
>
  <div class="flex w-full max-w-4xl flex-col items-center">
    <div class="mb-16 flex flex-col items-center text-center">
      <h1
        class="mb-4 bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 bg-clip-text text-4xl font-black text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Wild Frequency
      </h1>
      <p
        class="max-w-2xl text-center text-base leading-relaxed font-medium text-emerald-200 sm:text-lg lg:text-xl"
      >
        Make a sound for 3 seconds to discover your spirit animal!
      </p>
    </div>
    <div class="mb-16 flex w-full flex-col items-center">
      {#if !matchedAnimal}
        <Recorder bind:recording bind:peakDecibel />
      {:else}
        <Result bind:peakDecibel bind:matchedAnimal />
      {/if}
    </div>

    {#if recording}
      <div class="mb-16 flex w-full flex-col items-center">
        <div class="flex flex-col items-center">
          <div
            class="mb-3 text-xl font-bold text-emerald-400 sm:text-2xl lg:text-3xl"
          >
            Listening to your voice...
          </div>
          <div class="text-base text-emerald-300 sm:text-lg">
            Make some noise!
          </div>
        </div>
      </div>
    {/if}
    {#if !recording && !matchedAnimal}
      <div class="mb-16 flex w-full flex-col items-center">
        <div class="flex flex-col items-center">
          <div
            class="mb-3 text-xl font-bold text-emerald-300 sm:text-2xl lg:text-3xl"
          >
            Ready for adventure?
          </div>
          <div
            class="max-w-md text-center text-base leading-relaxed text-emerald-200 sm:text-lg"
          >
            Press the microphone to discover your spirit animal!
          </div>
        </div>
      </div>
    {/if}
    <div
      class="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
    >
      <a
        href="https://github.com/orhantugrul/wild-frequency"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/50 px-6 py-3 text-sm font-medium text-emerald-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200 sm:w-auto"
      >
        <Github
          class="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
        />
        <span>GitHub</span>
      </a>
      <a
        href="https://www.buymeacoffee.com/orhantugrul"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/50 px-6 py-3 text-sm font-medium text-amber-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-200 sm:w-auto"
      >
        <BuyMeACoffee
          class="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
        />
        <span>Buy me a coffee</span>
      </a>
    </div>
  </div>
</div>
