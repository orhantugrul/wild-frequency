<script lang="ts">
  import { VoiceRecorder } from "$lib/audio";
  import { Mic } from "lucide-svelte";
  import { onDestroy } from "svelte";

  let { recording = $bindable(), peakDecibel = $bindable() } = $props();

  const voiceRecorder = new VoiceRecorder();
  let currentDecibel = $state(0);

  onDestroy(() => {
    voiceRecorder?.stop();
  });

  async function handleRecord() {
    if (recording) {
      return;
    }

    recording = true;
    peakDecibel = 0;
    currentDecibel = 0;

    try {
      await voiceRecorder.start((decibel) => {
        currentDecibel = decibel;
        if (decibel > peakDecibel) {
          peakDecibel = decibel;
        }
      });

      setTimeout(() => {
        voiceRecorder.stop();
        recording = false;
        currentDecibel = 0;
      }, 3000);
    } catch (error) {
      voiceRecorder.stop();
      recording = false;
      currentDecibel = 0;
      console.error("Failed to start recording:", error);
    }
  }
</script>

<div class="flex w-full flex-col items-center justify-center">
  <button
    onclick={handleRecord}
    disabled={recording}
    class="group relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 p-1 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56"
  >
    <div
      class="flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-emerald-950 to-green-900 p-4"
    >
      {#if recording}
        <div class="flex flex-col items-center justify-center gap-3">
          <div class="flex items-center justify-center">
            <Mic
              class="h-8 w-8 text-emerald-400 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
            />
          </div>
          <div class="flex flex-col items-center justify-center gap-1">
            <div
              class="text-xs font-medium text-emerald-300 sm:text-sm md:text-base"
            >
              Listening...
            </div>
            <div class="flex items-center justify-center gap-1">
              {#each Array(3) as _, i}
                <div
                  class="h-1 w-1 animate-pulse rounded-full bg-emerald-400"
                  style="animation-delay: {i * 0.2}s"
                ></div>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center gap-3">
          <div class="flex items-center justify-center">
            <Mic
              class="h-8 w-8 text-emerald-400 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
            />
          </div>
          <div class="flex flex-col items-center justify-center">
            <div
              class="text-xs font-medium text-emerald-300 sm:text-sm md:text-base"
            >
              Tap to Start
            </div>
          </div>
        </div>
      {/if}
    </div>
  </button>
</div>
