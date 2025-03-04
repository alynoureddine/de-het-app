import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { VocabCsvService } from './vocab-csv.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

export interface Word {
  name: string;
  deOrHet: DeOrHet;
  translation: string;
}

export type DeOrHet = 'de' | 'het';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  providers: [VocabCsvService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'de-het-app';
  words: Word[] = [];
  displayedWord?: Word;
  wordsViewedCount = 0;

  showCorrect = false;
  showWrong = false;

  isFlipped = false;

  ngOnInit() {
    this.vocabCsvService.parsedCsvFile?.subscribe((value) => {
      this.words = value;
      this.displayedWord = this.getUniqueRandomWord();
      this.wordsViewedCount = 1;
    });
  }

  getUniqueRandomWord(): Word | undefined {
    if (this.wordsViewedCount === this.words.length) return undefined;

    const index = Math.floor(
      Math.random() * (this.words.length - this.wordsViewedCount),
    );
    const resultWord = this.words[index];
    this.words[index] =
      this.words[this.words.length - this.wordsViewedCount - 1];
    this.words[this.words.length - this.wordsViewedCount - 1] = resultWord;
    return resultWord;
  }

  submitAnswer(answer: DeOrHet) {
    if (this.displayedWord?.deOrHet === answer) {
      this.showCorrect = true;
    } else {
      this.showWrong = true;
    }

    setTimeout(() => {
      this.showCorrect = false;
      this.showWrong = false;
      this.displayedWord = this.getUniqueRandomWord();
      this.wordsViewedCount++;
    }, 1000);

    this.speakWord(
      `${this.displayedWord?.deOrHet} ${this.displayedWord?.name}`,
    );
  }

  speakWord(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'nl-NL';

    document.defaultView?.speechSynthesis.speak(utterance);
  }

  constructor(
    private readonly vocabCsvService: VocabCsvService,
    @Inject(DOCUMENT) public document: Document,
  ) {}
}
