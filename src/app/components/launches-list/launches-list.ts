import { Component, computed, inject, model, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { LaunchState } from '../../state/launch.reducer';
import { addLaunchToFavorites, loadLaunches, removeLaunchFromFavorites } from '../../state/launch.actions';
import { Launch } from '../../interfaces/interfaces';
import { selectAllLaunches, selectFavoriteIds } from '../../state/launch.selectors';
import { Router } from '@angular/router';


@Component({
  selector: 'app-launches-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatButtonModule],
  templateUrl: './launches-list.html',
  styleUrl: "./launches-list.scss"
})
export class LaunchesListComponent implements OnInit {
  allLaunches: Signal<Launch[]>;
  filteredLaunches: Signal<Launch[]>;

  searchTerm: WritableSignal<string>  = model('');

  constructor(private store: Store<{ launch: LaunchState }>, private router: Router) {
    this.allLaunches = this.store.selectSignal(selectAllLaunches);

    this.filteredLaunches = computed(() => {
      let filteredList = this.store.selectSignal(selectAllLaunches)().filter(launch =>
        ( launch.name.toUpperCase().trim() ).includes(this.searchTerm().toUpperCase().trim())
      );
      return filteredList;
    });
    
  }


  ngOnInit(): void {
    this.loadLaunches();
  }

  loadLaunches():void {
    this.store.dispatch(loadLaunches());
  }

  goToLaunch(launch: Launch): void{
    let id: string = launch.id;
    this.router.navigate(["launch",id])
  }

  addToFavorite(event: MouseEvent, launch: Launch): void{
    event.stopPropagation();
    this.store.dispatch(addLaunchToFavorites({launchId: launch.id}));
  }

  removeFromFavorite(event: MouseEvent, launch: Launch): void{
    event.stopPropagation();
    this.store.dispatch(removeLaunchFromFavorites({launchId: launch.id}));
  }


  isFavouriteLaunch(launch: Launch): boolean{
    return this.store.selectSignal(selectFavoriteIds)().includes(launch.id);
  }

  refreshData(){
    this.loadLaunches();
  }
}