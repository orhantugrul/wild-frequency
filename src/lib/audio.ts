const SENSITIVITY = -45;

export class AudioAnalyzer {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  private async _initialize() {
    if (this.audioContext) {
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);
    } catch (error) {
      console.error("Failed to initialize audio analyzer:", error);
      this._cleanup();
      throw error;
    }
  }

  private _cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
  }

  public async record(duration: number): Promise<number> {
    await this._initialize();

    if (!this.analyser) {
      this._cleanup();
      throw new Error("Audio analyser not available.");
    }

    const localAnalyser = this.analyser;
    let peakDecibel = -Infinity;
    let animationFrameId: number;

    return new Promise((resolve) => {
      const startedAt = Date.now();

      const tick = () => {
        const data = new Uint8Array(localAnalyser.frequencyBinCount);
        localAnalyser.getByteTimeDomainData(data);

        const rootMeanSquare = toRootMeanSquare(data);
        const decibel = toDecibel(rootMeanSquare);

        if (decibel > peakDecibel) {
          peakDecibel = decibel;
        }

        if (Date.now() - startedAt < duration) {
          animationFrameId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(animationFrameId);
          this._cleanup();
          resolve(peakDecibel === -Infinity ? -100 : peakDecibel);
        }
      };

      tick();
    });
  }
}

const toRootMeanSquare = (data: Uint8Array): number => {
  const sumSquares = data.reduce((acc, val) => {
    const normalizedSample = val / 128.0 - 1.0;
    return acc + normalizedSample * normalizedSample;
  }, 0);

  return Math.sqrt(sumSquares / data.length);
};

const toDecibel = (rms: number): number => {
  return 20 * Math.log10(rms);
};

export const toSoundPressureLevel = (decibel: number): number => {
  if (decibel < SENSITIVITY) {
    return 0;
  }

  return ((decibel - SENSITIVITY) / -SENSITIVITY) * 100 + 20;
};
