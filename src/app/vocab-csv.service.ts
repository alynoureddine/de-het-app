import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Papa from 'papaparse';
import { map, Observable } from 'rxjs';
import { DeOrHet, Word } from './app.component';

@Injectable({
  providedIn: 'root',
})
export class VocabCsvService {
  private csvFile$?: Observable<string>;
  parsedCsvFile?: Observable<Array<Word>>;

  constructor(private readonly httpClient: HttpClient) {
    this.csvFile$ = this.fetchCsvFile();
    this.parsedCsvFile = this.csvFile$.pipe(
      map((value) => this.parseCsvFile(value)),
    );
  }

  private fetchCsvFile() {
    return this.httpClient.get('assets/Dutch-Vocabulary-Het-De.csv', {
      responseType: 'text',
    });
  }

  private parseCsvFile(csvFile: string) {
    let parsedCsvData: Array<Word> = [];

    Papa.parse<Array<string>>(csvFile).data.forEach((item, index) => {
      if (index === 0) return;
      if (item[0] === '***') return;

      const word: Word = {
        name: item[1],
        deOrHet: item[0] as DeOrHet,
        translation: item[3],
      };

      parsedCsvData.push(word);
    });

    return parsedCsvData;
  }
}
