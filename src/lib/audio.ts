const MIN_DECIBEL = -45;

/**
 * Callback function type for real-time decibel updates
 * @param decibel - Current decibel level
 */
export type DecibelCallback = (decibel: number) => void;

export class VoiceRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private recording = false;
  private animationId: number | null = null;

  /**
   * Initialize audio context and microphone stream
   * @throws Error if microphone access is denied or audio context fails
   */
  private async initialize(): Promise<void> {
    if (this.audioContext) return;

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Create audio context and analyzer
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      // Connect microphone to analyzer
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);
    } catch (error) {
      this.cleanup();
      throw new Error(`Failed to initialize audio: ${error}`);
    }
  }

  /**
   * Clean up audio resources
   */
  private cleanup(): void {
    this.recording = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext?.state !== "closed") {
      this.audioContext?.close();
      this.audioContext = null;
    }

    this.analyser = null;
  }

  /**
   * Start live recording with real-time decibel monitoring
   * @param onUpdate - Callback function for decibel updates
   * @returns Promise that resolves when recording starts
   * @throws Error if initialization fails
   */
  async start(onUpdate: DecibelCallback): Promise<void> {
    if (this.recording) {
      throw new Error("Recording already in progress");
    }

    await this.initialize();

    if (!this.analyser) {
      throw new Error("Audio analyzer not available");
    }

    this.recording = true;
    const analyser = this.analyser;

    const tick = () => {
      if (!this.recording) return;

      // Get current audio data
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);

      // Calculate decibel and sound level
      const rootMeanSquare = calculateRootMeanSquare(data);
      const decibel = toDecibel(rootMeanSquare);
      const normalized = toSoundLevel(decibel);

      // Call callback with current values
      onUpdate(normalized);

      // Continue monitoring
      this.animationId = requestAnimationFrame(tick);
    };

    tick();
  }

  /**
   * Stop live recording
   */
  stop(): void {
    this.cleanup();
  }
}

/**
 * Calculate root mean square from audio data
 * @param data - Raw audio samples
 * @returns Root mean square value
 */
export const calculateRootMeanSquare = (data: Uint8Array): number => {
  const sumSquares = data.reduce((sum, sample) => {
    const normalized = sample / 128.0 - 1.0;
    return sum + normalized * normalized;
  }, 0);

  return Math.sqrt(sumSquares / data.length);
};

/**
 * Convert root mean square to decibels
 * @param rootMeanSquare - Root mean square value
 * @returns Decibel value
 */
export const toDecibel = (rootMeanSquare: number): number => {
  return 20 * Math.log10(rootMeanSquare);
};

/**
 * Convert decibel to normalized sound level (0-100)
 * @param decibel - Decibel value
 * @returns Normalized sound level
 */
export const toSoundLevel = (decibel: number): number => {
  if (decibel < MIN_DECIBEL) return 0;
  return ((decibel - MIN_DECIBEL) / -MIN_DECIBEL) * 100 + 20;
};
