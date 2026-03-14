import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private context: AudioContext;
  private buffers: Map<string, AudioBuffer> = new Map();
  private currentSource: AudioBufferSourceNode | null = null;

  private audioUrls = {
    startBgm: '/love-quiz/audio/start_bgm.mp3',
    quizBgm: '/love-quiz/audio/quiz_bgm.mp3',
    correctAnswer: '/love-quiz/audio/correct_answer.mp3',
    wrongAnswer: '/love-quiz/audio/wrong_answer.mp3',
    transitionMusic: '/love-quiz/audio/transition.mp3',
    selectionMusic: '/love-quiz/audio/selection.mp3',
    finishMusic: '/love-quiz/audio/finish.mp3',
    finalQuizBgm: '/love-quiz/audio/final_quiz_bgm.mp3',
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
