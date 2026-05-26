import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchesListComponent } from './launches-list';

describe('LaunchesList', () => {
  let component: LaunchesListComponent;
  let fixture: ComponentFixture<LaunchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
