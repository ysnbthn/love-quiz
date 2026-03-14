import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache: Record<string, HTMLAudioElement> = {};

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
    // sadece hızlı efekt seslerini preload et
    ['correctAnswer', 'wrongAnswer'].forEach((key) => {
      const url = this.audioUrls[key as keyof typeof this.audioUrls];
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audioCache[key] = audio;
    });
  }

  play(audioKey: keyof typeof this.audioUrls, loop = false) {
    this.stop();

    // cache'te varsa onu kullan, yoksa yeni Audio yarat
    const audio =
      this.audioCache[audioKey] || new Audio(this.audioUrls[audioKey]);
    audio.loop = loop;
    audio.currentTime = 0;

    this.currentAudio = audio;
    this.currentAudio
      .play()
      .catch((e) => console.error('Audio play error:', e));
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  playOnce(audioKey: keyof typeof this.audioUrls) {
    this.play(audioKey, false);
  }
}
