import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;

  private audioUrls = {
    startBgm: '/audio/start_bgm.mp3',
    quizBgm: '/audio/quiz_bgm.mp3',
    correctAnswer: '/audio/correct_answer.mp3',
    wrongAnswer: '/audio/wrong_answer.mp3',
    transitionMusic: '/audio/transition.mp3',
    selectionMusic: '/audio/selection.mp3',
    finishMusic: '/audio/finish.mp3',
    finalQuizBgm: '/audio/final_quiz_bgm.mp3',
  };

  play(audioKey: keyof typeof this.audioUrls, loop = false) {
    this.stop();
    const url = this.audioUrls[audioKey];
    this.currentAudio = new Audio(url);
    this.currentAudio.loop = loop;
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
