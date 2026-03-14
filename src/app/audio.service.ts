import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;

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
