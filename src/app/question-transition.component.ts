import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-question-transition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-transition.component.html',
  styleUrls: ['./question-transition.component.scss'],
})
export class QuestionTransitionComponent implements OnInit {
  @Input() questionNumber: number = 1;
  @Input() totalQuestions: number = 1;

  displayText: string = '';

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioService.playOnce('transitionMusic');
    if (this.questionNumber + 1 === this.totalQuestions) {
      this.displayText = `FİNAL SORUSU!!!`;
    } else {
      this.displayText = `Soru ${this.questionNumber + 1}`;
    }
  }
}
