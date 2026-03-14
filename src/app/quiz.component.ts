import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { QuestionIndicatorComponent } from './question-indicator.component';
import { QuestionTransitionComponent } from './question-transition.component';
import { AudioService } from './audio.service';

interface QuizQuestion {
  type: 'normal' | 'timed' | 'music';
  text: string;
  choices: string[];
  musicSrc?: string;
  correctAnswer?: number;
  allCorrect?: boolean; // flag for questions where all answers are correct
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    QuestionComponent,
    QuestionIndicatorComponent,
    QuestionTransitionComponent,
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: QuizQuestion[] = [
    {
      type: 'normal',
      text: 'İlk nerede buluşmuştuk?',
      choices: ['Ümraniye', 'Bebek', 'Afganistan', 'Kadıköy'],
      correctAnswer: 3,
    },
    {
      type: 'normal',
      text: 'Ben seni neyim diyerek sevmem?',
      choices: ['Prensesim', 'Gergedanım', 'Fıstıklı baklavam', 'Sincabım'],
      correctAnswer: 1,
    },
    {
      type: 'normal',
      text: 'İlk telefon konuşmamız kaç dk sürdü?',
      choices: ['30 sn', '11 saat', '35dk', '2 gün'],
      correctAnswer: 2,
    },
    {
      type: 'normal',
      text: 'İlk buluşmamızda sana hangi hediyeyi vermiştim?',
      choices: [
        '3D ile basılmış Mavi kedi',
        'Kırmızı gül',
        'Mercedes-Benz S-Class Maybach S680 4MATIC',
        'Gül Lego',
      ],
      correctAnswer: 0,
    },
    {
      type: 'normal',
      text: 'Favori buluşma yerimiz?',
      choices: [
        'Taksim Meydanı',
        'Madagaskar Cami',
        'Çamlıca Tepesi',
        'Üsküdar Fethi Paşa Korusu',
      ],
      correctAnswer: 3,
    },
    {
      type: 'normal',
      text: 'Ben bir hayvan olsam aşağıdakilerden hangisi olurdum?',
      choices: ['Merzifon Öküzü', 'Koala', 'Makak Maymunu', 'Panda'],
      correctAnswer: 1,
    },
    {
      type: 'normal',
      text: 'İlk Buluşma Günü ve saati?',
      choices: [
        '21 Aralık 2025 13:05',
        '21 Aralık 2026 13:05',
        '11 Aralık 2025 20:49',
        '3 Mayıs 1956 9:30',
      ],
      correctAnswer: 0,
    },
    {
      type: 'normal',
      text: 'Evine kargo ile gönderdiğim ilk hediye?',
      choices: ['Kitap ayracı', 'Tirbüşon', '160cm Oyuncak Ayı', 'El Blenderı'],
      correctAnswer: 2,
    },
    {
      type: 'normal',
      text: 'Ben senin en çok nerene bakarım?',
      choices: ['Azı dişlerine', 'Gözlerine', 'Ellerine', 'Zatı ardına'],
      correctAnswer: 1,
    },
    // {
    //   type: 'timed',
    //   text: '60s süreli soru',
    //   choices: ['A', 'B', 'C', 'D'],
    //   correctAnswer: 1,
    // },
    // {
    //   type: 'music',
    //   text: 'Bu müzik hangisi?',
    //   choices: ['X', 'Y', 'Z'],
    //   musicSrc: 'assets/music.mp3',
    //   correctAnswer: 0,
    // },
    {
      type: 'normal',
      text: 'Benimle Evlenir misin?',
      choices: ['Evet', 'Tabiki', 'Seve seve', 'Memnuniyetle'],
      correctAnswer: 0,
      allCorrect: true,
    },
  ];

  currentIndex = 0;
  showTransition = true;
  isAnswered = false;
  isAnswerCorrect = false;
  showNextButton = false;
  isGameFinished = false;
  // Kisses points for each question
  kisses: number[] = [5, 10, 15, 25, 50, 75, 100, 150, 250, 500];
  // Manages the timeout for transition screen display
  private transitionTimeout: any;

  get current() {
    return this.questions[this.currentIndex];
  }

  constructor(
    private audioService: AudioService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.showNextButton = false;
    this.showTransition = true;
    this.transitionTimeout = setTimeout(() => {
      this.showTransition = false;
      this.audioService.play('quizBgm', true);
    }, 3200);
  }

  ngOnDestroy() {
    this.audioService.stop();
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
  }

  onAnswerSubmit(selectedIndex: number) {
    const current = this.current;
    this.isAnswered = true;
    // If allCorrect flag is true, any selection is correct
    this.isAnswerCorrect =
      current.allCorrect || selectedIndex === current.correctAnswer;

    // Stop quiz background music and play selection music (3s)
    this.audioService.stop();
    this.audioService.playOnce('selectionMusic');

    // After 3 seconds, play correct/wrong sound
    setTimeout(() => {
      if (this.isAnswerCorrect) {
        this.audioService.playOnce('correctAnswer');

        // If this is last question and correct, auto-trigger finish screen after 3 more seconds
        if (this.currentIndex === this.questions.length - 1) {
          this.transitionTimeout = setTimeout(() => {
            this.next();
          }, 3000);
        } else {
          this.showNextButton = true;
        }
      } else {
        this.audioService.playOnce('wrongAnswer');
        this.showNextButton = true;
      }
    }, 3200);
  }

  next() {
    // If answer is wrong, go back to start
    if (!this.isAnswerCorrect) {
      this.currentIndex = 0;
      this.router.navigate(['/']);
      return;
    }

    // If answer is correct and this is the last question
    if (this.currentIndex === this.questions.length - 1) {
      // Show finish screen
      this.isGameFinished = true;
      this.audioService.stop();
      this.audioService.playOnce('finishMusic');

      // After 10 seconds, go back to start
      this.transitionTimeout = setTimeout(() => {
        this.currentIndex = 0;
        this.router.navigate(['/']);
      }, 10000);
      return;
    }

    // If answer is correct, go to next question
    this.isAnswered = false;
    this.isAnswerCorrect = false;
    this.showNextButton = false;
    this.showTransition = true;
    this.currentIndex++;
    this.transitionTimeout = setTimeout(() => {
      this.showTransition = false;
      // Use finalQuizBgm for the last question, otherwise use normal quizBgm
      const bgmTrack =
        this.currentIndex === this.questions.length - 1
          ? 'finalQuizBgm'
          : 'quizBgm';
      console.log('Playing BGM:', bgmTrack);
      this.audioService.play(bgmTrack, true);
    }, 3000);
  }
}
