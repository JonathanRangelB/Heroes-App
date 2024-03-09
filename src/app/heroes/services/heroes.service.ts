import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../../environments/environment';
import { Observable, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getHeroes() {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string) {
    return this.http
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(catchError(() => of(undefined)));
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query} `);
  }
}
