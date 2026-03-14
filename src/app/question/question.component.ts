import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

type QuestionType = 'normal' | 'timed' | 'music';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type: QuestionType = 'normal';
  @Input() text = '';
  @Input() choices: string[] = [];
  @Input() musicSrc = 'assets/music.mp3';
  @Input() correctAnswer: number | undefined;
  @Input() allCorrect = false;
  @Output() answerSubmitted = new EventEmitter<number>();

  selectedChoice: number | null = null;
  isAnswered = false;
  isCorrect = false;
  showResult = false;
  timer = 60;
  bars: number[] = [];
  private sub?: Subscription;
  private resultTimeout: any;

  ngOnInit() {
    // touch point: log for rebuild
    console.log('QuestionComponent init');

    // initialize an array of 60 indices for rendering the bar segments
    this.bars = Array(60)
      .fill(0)
      .map((_, i) => i);

    if (this.type === 'timed') {
      this.startTimer();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['text'] && !changes['text'].firstChange) {
      this.reset();
      if (this.type === 'timed') {
        this.timer = 60;
        this.sub?.unsubscribe();
        this.startTimer();
      }
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.resultTimeout) {
      clearTimeout(this.resultTimeout);
    }
  }

  startTimer() {
    this.sub = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.sub?.unsubscribe();
      }
    });
  }

  isFilled(index: number) {
    // bars fill from left to right as time decreases
    return index < this.timer;
  }

  selectChoice(index: number) {
    if (this.isAnswered) return; // prevent multiple selections

    this.selectedChoice = index;
    this.isAnswered = true;
    this.answerSubmitted.emit(index);

    // After 3 seconds, show result animation
    this.resultTimeout = setTimeout(() => {
      // For allCorrect questions, any selection is correct (green blinking)
      this.isCorrect = this.allCorrect || index === this.correctAnswer;
      this.showResult = true;
    }, 2800);
  }

  reset() {
    this.selectedChoice = null;
    this.isAnswered = false;
    this.isCorrect = false;
    this.showResult = false;
    if (this.resultTimeout) {
      clearTimeout(this.resultTimeout);
    }
  }
}
