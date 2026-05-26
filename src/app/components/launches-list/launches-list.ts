import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpacexService } from '../../services/spacex';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-launches-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatButtonModule],
  templateUrl: './launches-list.html'
})
export class LaunchesListComponent implements OnInit {
  allLaunches: any[] = [];
  filteredLaunches: any[] = [];
  searchTerm: string = '';
  
  private sub! : Subscription; 

  constructor(private spacexService: SpacexService) {}


  ngOnInit(): void {
    this.loadLaunches();
  }

  loadLaunches() {
    this.sub = this.spacexService.getPastLaunches().subscribe(data => {
      this.allLaunches = data;
      this.filteredLaunches = data;
    });
  }

  onSearchChange() {    
    this.filteredLaunches = this.allLaunches.filter(launch => 
      launch.name.includes(this.searchTerm)
    );
  }
}