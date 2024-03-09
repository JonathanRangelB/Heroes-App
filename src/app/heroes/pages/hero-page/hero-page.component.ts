import { Component, OnInit, inject } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``,
})
export class HeroPageComponent implements OnInit {
  heroesService = inject(HeroesService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  hero?: Hero;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/heroes/list');
        return (this.hero = hero);
      });
  }

  goBack() {
    this.router.navigate(['/heroes/list']);
  }
}
