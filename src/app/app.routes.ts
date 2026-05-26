import { Routes } from '@angular/router';
import { LaunchesListComponent } from './components/launches-list/launches-list';
import { LaunchDetails } from './components/launch-details/launch-details';

export const routes: Routes = [
      { path: "", component: LaunchesListComponent, pathMatch: "full" },
      { path: "launch/:id", component: LaunchDetails}
];
