import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, switchMap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

type Publishers = {
  id: string;
  desc: string;
};

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  private _heroesService = inject(HeroesService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);

  heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  publishers: Publishers[] = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  ngOnInit(): void {
    if (!this._router.url.includes('edit')) return;

    this._activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this._heroesService.getHeroById(id);
        })
      )
      .subscribe((hero) => {
        if (!hero) return this._router.navigateByUrl('/');
        return this.heroForm.reset(hero);
      });
  }

  onSumit() {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this._heroesService.updateHero(this.currentHero).subscribe((hero) => {
        // TODO: Show snackbar
        this.showSnackBar(`${hero.superhero} ha sido actualizado`);
      });
      return;
    }

    this._heroesService.addHero(this.currentHero).subscribe((hero) => {
      // TODO: Show snackbar and redirect to /heroes/edit/:id
      this.showSnackBar(`${hero.superhero} ha sido creado`);
      this._router.navigate(['/heroes/edit', hero.id]);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id)
      throw new Error('No se puede eliminar un heroe sin id');

    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap(() =>
          this._heroesService.deleteHeroById(this.currentHero.id)
        ),
        filter((wasDeleted) => !!wasDeleted)
      )
      .subscribe(() => {
        this.showSnackBar(`${this.currentHero.superhero} ha sido eliminado`);
        this._router.navigate(['/heroes']);
      });
  }

  showSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
