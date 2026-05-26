import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { LaunchState } from './state/launch.reducer';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isLoading$: Observable<boolean>;

  constructor(private store: Store<{ launch: LaunchState }>) {
    this.isLoading$ = this.store.select((state) => state.launch).pipe(
      map((res) => res.loading)
    );
  }
}
