import { Component, Input, OnInit, inject } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: ``,
})
export class CardComponent implements OnInit {
  @Input() hero!: Hero;
  router = inject(Router);

  ngOnInit(): void {
    if (!this.hero) throw new Error('Hero property is required.');
  }
}
