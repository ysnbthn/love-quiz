import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit, OnDestroy {
  isPlayingMusic = false;

  constructor(
    private router: Router,
    private audioService: AudioService,
  ) {}

  ngOnInit() {
    this.audioService.play('startBgm', false);
    this.isPlayingMusic = false;
  }

  ngOnDestroy() {
    this.audioService.stop();
  }

  toggleMusic() {
    if (this.isPlayingMusic) {
      this.audioService.stop();
      this.isPlayingMusic = false;
    } else {
      this.audioService.play('startBgm', true);
      this.isPlayingMusic = true;
    }
  }

  beginQuiz() {
    this.router.navigate(['/quiz']);
  }
}
