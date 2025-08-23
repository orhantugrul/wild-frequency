<script lang="ts">
  import { Info, RefreshCcw, Sparkles, Zap } from "lucide-svelte";

  let { peakDecibel = $bindable(), matchedAnimal = $bindable() } = $props();

  function handleTryAgain() {
    peakDecibel = 0;
    matchedAnimal = undefined;
  }
</script>

<div class="flex flex-col items-center justify-center space-y-8">
  <div class="mb-6 flex flex-col items-center justify-center text-center">
    <span class="mb-4 text-6xl sm:text-7xl lg:text-8xl">
      {matchedAnimal.emoji}
    </span>
    <div class="flex flex-col items-center justify-center gap-2">
      <h2 class="text-4xl font-bold text-emerald-300 sm:text-5xl lg:text-6xl">
        {matchedAnimal.name}
      </h2>
      <div class="flex items-center justify-center gap-2 text-emerald-400">
        <Sparkles class="h-4 w-4" />
        <span class="text-sm font-medium">Voice Match</span>
      </div>
    </div>
  </div>
  <div class="flex w-full justify-center">
    <div class="w-full max-w-md">
      <div
        class="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/95 to-green-950/95 p-6 shadow-2xl backdrop-blur-md"
      >
        <div class="mb-6 flex items-center gap-4">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-green-500/30 backdrop-blur-sm"
          >
            <Zap class="h-7 w-7 text-emerald-300" />
          </div>
          <div class="flex flex-col">
            <div class="text-xl font-bold text-emerald-200">
              Peak Voice Power
            </div>
            <div class="text-sm text-emerald-400">
              Your voice reached maximum volume
            </div>
          </div>
        </div>

        <div class="text-center">
          <div class="mb-3 text-5xl font-black text-emerald-100 lg:text-6xl">
            {peakDecibel.toFixed(0)}
          </div>
          <div class="text-lg font-medium text-emerald-300">decibels</div>

          <div class="mt-4 flex justify-center">
            <div class="flex gap-2">
              {#each Array(5) as _, i}
                {@const filled = (i + 1) * 20 <= peakDecibel}
                <div
                  class="h-2 w-2 rounded-full transition-all duration-300 {filled
                    ? 'scale-110 bg-emerald-400'
                    : 'bg-emerald-400/20'}"
                ></div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex w-full justify-center">
    <div class="w-full max-w-md">
      <div
        class="rounded-2xl border border-emerald-400/20 bg-emerald-950/60 p-6 backdrop-blur-sm"
      >
        <div class="mb-4 flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20"
          >
            <Info class="h-5 w-5 text-emerald-400" />
          </div>
          <span class="text-lg font-semibold text-emerald-200">Fun Fact</span>
        </div>

        <p class="text-sm leading-relaxed text-emerald-100 sm:text-base">
          {matchedAnimal.funFact}
        </p>
      </div>
    </div>
  </div>
  <div class="flex w-full flex-col items-center">
    <div class="w-full max-w-md space-y-4 text-center">
      <p class="text-base text-emerald-400">
        Ready to discover your next animal match?
      </p>

      <button
        onclick={handleTryAgain}
        class="group mx-auto flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/50 px-6 py-3 text-sm font-medium text-emerald-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200"
      >
        <RefreshCcw class="h-4 w-4 " />
        <span>Try Again</span>
      </button>
    </div>
  </div>
</div>
