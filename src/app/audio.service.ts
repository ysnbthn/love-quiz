import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private context: AudioContext;
  private buffers: Map<string, AudioBuffer> = new Map();
  private currentSource: AudioBufferSourceNode | null = null;

  private audioUrls = {
    startBgm: 'assets/audio/start_bgm.mp3',
    quizBgm: 'assets/audio/quiz_bgm.mp3',
    correctAnswer: 'assets/audio/correct_answer.mp3',
    wrongAnswer: 'assets/audio/wrong_answer.mp3',
    transitionMusic: 'assets/audio/transition.mp3',
    selectionMusic: 'assets/audio/selection.mp3',
    finishMusic: 'assets/audio/finish.mp3',
    finalQuizBgm: 'assets/audio/final_quiz_bgm.mp3',
  };

  constructor() {
    this.context = new AudioContext();
    this.preloadAll();
  }

  private async preloadAll() {
    for (const [key, url] of Object.entries(this.audioUrls)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.buffers.set(key, audioBuffer);
      } catch (e) {
        console.error(`Failed to preload ${key}:`, e);
      }
    }
  }

  play(audioKey: keyof typeof this.audioUrls, loop = false) {
    this.stop();
    const buffer = this.buffers.get(audioKey);
    if (!buffer) {
      console.warn(`Audio buffer for ${audioKey} not ready yet`);
      return;
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(this.context.destination);
    source.start(0);

    this.currentSource = source;
  }

  stop() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource.disconnect();
      this.currentSource = null;
    }
  }

  playOnce(audioKey: keyof typeof this.audioUrls) {
    this.play(audioKey, false);
  }

  unlock() {
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }
}
