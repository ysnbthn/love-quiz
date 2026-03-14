import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audios: Record<string, HTMLAudioElement> = {};

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
    // preload
    for (const [key, url] of Object.entries(this.audioUrls)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audios[key] = audio;
    }
  }

  play(audioKey: keyof typeof this.audioUrls, loop = false) {
    this.stop();
    const audio = this.audios[audioKey];
    if (audio) {
      audio.loop = loop;
      audio.currentTime = 0;
      audio.play().catch((e) => console.error('Audio play error:', e));
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }

  private get currentAudio(): HTMLAudioElement | null {
    return Object.values(this.audios).find((a) => !a.paused) || null;
  }
}
