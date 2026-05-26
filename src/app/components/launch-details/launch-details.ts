import { Component, computed, Signal } from "@angular/core";
import { LaunchState } from "../../state/launch.reducer";
import { Store } from "@ngrx/store";
import { selectAllLaunches } from "../../state/launch.selectors";
import { Launch } from "../../interfaces/interfaces";
import { ActivatedRoute } from "@angular/router";
import { loadLaunches } from "../../state/launch.actions";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";


@Component({
  selector: "app-launch-details",
  imports: [JsonPipe, CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatButtonModule],
  templateUrl: "./launch-details.html",
  styleUrl: "./launch-details.scss",
})
export class LaunchDetails {
  currentLaunchSignal: Signal<Launch | undefined>;

  constructor(private store: Store<{ launches: LaunchState }>, private activatedRoute: ActivatedRoute) {
    let launchesSignal = this.store.selectSignal(selectAllLaunches);
    if(!launchesSignal().length){//ask the store to populate the launches list in case the user opened the details page directly in the browser
      this.store.dispatch(loadLaunches());
    }

    this.currentLaunchSignal = computed(() => { //build computed signal of the current launch from the lanches list signal after list retrieval
      let id = this.activatedRoute.snapshot.params["id"];
      return launchesSignal().find((launch) => {
        return launch.id == id
      })
    })

  }
}
