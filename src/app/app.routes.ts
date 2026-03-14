import { Routes } from '@angular/router';
import { StartComponent } from './start.component';
import { QuizComponent } from './quiz.component';
import { QuestionComponent } from './question/question.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'question', component: QuestionComponent }, // legacy/test route
];
