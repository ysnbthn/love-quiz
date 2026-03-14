import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-indicator.component.html',
  styleUrls: ['./question-indicator.component.scss'],
})
export class QuestionIndicatorComponent {
  @Input() currentIndex: number = 0;
  @Input() totalQuestions: number = 0;
  @Input() kisses: number[] = [];

  getNumbers() {
    return Array.from({ length: this.totalQuestions }, (_, i) => i);
  }

  getKisses(index: number): number {
    return this.kisses[index] || 0;
  }
}
