import { Component, computed, Signal } from "@angular/core";
import { LaunchState } from "../../state/launch.reducer";
import { Store } from "@ngrx/store";
import { selectAllLaunches } from "../../state/launch.selectors";
import { Launch } from "../../interfaces/interfaces";
import { ActivatedRoute, Router } from "@angular/router";
import { loadLaunchDetail, loadLaunches } from "../../state/launch.actions";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from '@angular/material/grid-list';



@Component({
  selector: "app-launch-details",
  imports: [JsonPipe, CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatButtonModule, MatGridListModule],
  templateUrl: "./launch-details.html",
  styleUrl: "./launch-details.scss",
})
export class LaunchDetails {
  currentLaunchSignal: Signal<Launch | undefined>;

  constructor(private store: Store<{ launches: LaunchState }>, private activatedRoute: ActivatedRoute, private router: Router) {
    this.currentLaunchSignal = this.prepareCurrentLaunchSignal();
  }

  prepareCurrentLaunchSignal(): Signal<Launch | undefined> {
    let launchId = this.activatedRoute.snapshot.params["id"];
    this.store.dispatch(loadLaunchDetail({ launchId: launchId }));

    let currentLaunchSignal = computed(() => {
      let launchesSignal = this.store.selectSignal(selectAllLaunches);
      return launchesSignal()[0] || undefined
    })

    return currentLaunchSignal;
  }

  ngOnInit(){
    
  }

  goBack() {
    this.router.navigate([""]);
  }
}
