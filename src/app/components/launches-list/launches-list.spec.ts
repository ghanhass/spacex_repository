import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { LaunchState } from "../../state/launch.reducer";
import { selectAllLaunches, selectFavoriteIds } from "../../state/launch.selectors";
import { Launch, Links, Patch, Reddit, Flickr, Failure, Core, Fairings } from "../../interfaces/interfaces";
import { addLaunchToFavorites, loadFavoriteLaunches, loadLaunches, removeLaunchFromFavorites } from "../../state/launch.actions";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { signal } from "@angular/core";
import {LaunchesListComponent} from "./launches-list";

describe("LaunchesListComponent", () => {
  let component: LaunchesListComponent;
  let fixture: ComponentFixture<LaunchesListComponent>;
  let store: MockStore;
  let router: Router;

  // Mock data with complete interface implementation
  const mockLinks: Links = {
    patch: {
      small: "https://images2.imgbox.com/94/f2/NN6Ph45r_o.png",
      large: "https://images2.imgbox.com/5b/02/QcxHUb5V_o.png"
    },
    reddit: {
      campaign: "https://www.reddit.com/r/spacex/comments/123456/campaign/",
      launch: "https://www.reddit.com/r/spacex/comments/123456/launch/",
      media: "https://www.reddit.com/r/spacex/comments/123456/media/",
      recovery: "https://www.reddit.com/r/spacex/comments/123456/recovery/"
    },
    flickr: {
      small: ["https://live.staticflickr.com/1234/1_small.jpg"],
      original: ["https://live.staticflickr.com/1234/1_original.jpg"]
    },
    presskit: "https://www.spacex.com/presskit.pdf",
    webcast: "https://www.youtube.com/watch?v=test123",
    youtube_id: "test123",
    article: "https://www.spacex.com/news/2023/01/01/launch-article",
    wikipedia: "https://en.wikipedia.org/wiki/Falcon_9"
  };

  const mockFailures: Failure[] = [
    {
      time: 120,
      altitude: 10000,
      reason: "Engine failure"
    }
  ];

  const mockCores: Core[] = [
    {
      core: "5e9e289df35918033d3b2623",
      flight: 1,
      gridfins: true,
      legs: true,
      reused: false,
      landing_attempt: true,
      landing_success: true,
      landing_type: "ASDS",
      landpad: "5e9e3032383ecb267a34e7c7"
    }
  ];

  const mockFairings: Fairings = {
    reused: false,
    recovery_attempt: true,
    recovered: false,
    ships: ["5ea6ed2e080df4000697c907"]
  };

  const mockLaunch1: Launch = {
    fairings: mockFairings,
    links: mockLinks,
    static_fire_date_utc: "2023-01-01T00:00:00Z",
    static_fire_date_unix: 1672531200,
    net: false,
    window: 0,
    rocket: "5e9d0d95eda69955f709d1eb",
    success: true,
    failures: mockFailures,
    details: "Test launch details 1",
    crew: [],
    ships: ["5ea6ed2e080df4000697c907"],
    capsules: ["5e9e2c5df35918333d3b2624"],
    payloads: ["5eb0e4b5b6c3bb0006aebd1e"],
    launchpad: "5e9e4502f509094188566f88",
    flight_number: 1,
    name: "Falcon 9 Test Launch",
    date_utc: "2023-01-01T00:00:00Z",
    date_unix: 1672531200,
    date_local: "2023-01-01T00:00:00-05:00",
    date_precision: "hour",
    upcoming: false,
    cores: mockCores,
    auto_update: true,
    tbd: false,
    launch_library_id: "123",
    id: "1"
  };

  const mockLaunch2: Launch = {
    ...mockLaunch1,
    id: "2",
    name: "Starship Test Launch",
    flight_number: 2,
    success: false,
    details: "Test launch details 2",
    failures: [{
      time: 60,
      altitude: 5000,
      reason: "Engine anomaly"
    }]
  };

  const mockLaunch3: Launch = {
    ...mockLaunch1,
    id: "3",
    name: "Dragon Cargo Mission",
    flight_number: 3,
    success: true,
    details: "Test launch details 3"
  };

  const mockLaunches: Launch[] = [mockLaunch1, mockLaunch2, mockLaunch3];
  const mockFavoriteIds: string[] = [mockLaunch1.id, mockLaunch3.id];

  const initialState = {
    launch: {
      launches: [],
      favoriteIds: [],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        LaunchesListComponent
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy("navigate")
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LaunchesListComponent);
    component = fixture.componentInstance;

    // Override selectors
    store.overrideSelector(selectAllLaunches, mockLaunches);
    store.overrideSelector(selectFavoriteIds, mockFavoriteIds);

    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("Constructor and Signal Initialization", () => {
    it("should initialize searchTerm signal with empty string", () => {
      expect(component.searchTerm()).toBe("");
    });

    it("should initialize favoritesOnly signal with false", () => {
      expect(component.favoritesOnly()).toBe(false);
    });

    it("should create filteredLaunches computed signal", () => {
      expect(component.filteredLaunches).toBeDefined();
      expect(component.filteredLaunches()).toEqual(mockLaunches);
    });
  });

  describe("ngOnInit", () => {
    it("should call loadLaunches on initialization", () => {
      const loadSpy = spyOn(component, "loadLaunches");
      component.ngOnInit();
      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe("loadLaunches", () => {
    it("should dispatch loadLaunches and loadFavoriteLaunches actions", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.loadLaunches();
      
      expect(dispatchSpy).toHaveBeenCalledWith(loadLaunches());
      expect(dispatchSpy).toHaveBeenCalledWith(loadFavoriteLaunches());
    });
  });

  describe("goToLaunch", () => {
    it("should navigate to launch detail page with launch id", () => {
      component.goToLaunch(mockLaunch1);
      
      expect(router.navigate).toHaveBeenCalledWith(["launch", mockLaunch1.id]);
    });
  });

  describe("addToFavorite", () => {
    it("should dispatch addLaunchToFavorites action and stop event propagation", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      const mockEvent = jasmine.createSpyObj("MouseEvent", ["stopPropagation"]);
      
      component.addToFavorite(mockEvent, mockLaunch2);
      
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(addLaunchToFavorites({ launchId: mockLaunch2.id }));
    });
  });

  describe("removeFromFavorite", () => {
    it("should dispatch removeLaunchFromFavorites action and stop event propagation", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      const mockEvent = jasmine.createSpyObj("MouseEvent", ["stopPropagation"]);
      
      component.removeFromFavorite(mockEvent, mockLaunch1);
      
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(removeLaunchFromFavorites({ launchId: mockLaunch1.id }));
    });
  });

  describe("isFavouriteLaunch", () => {
    it("should return true when launch is in favorites", () => {
      const result = component.isFavouriteLaunch(mockLaunch1);
      expect(result).toBe(true);
    });

    it("should return false when launch is not in favorites", () => {
      const result = component.isFavouriteLaunch(mockLaunch2);
      expect(result).toBe(false);
    });

    it("should update when favorite ids change", () => {
      expect(component.isFavouriteLaunch(mockLaunch2)).toBe(false);
      
      store.overrideSelector(selectFavoriteIds, [mockLaunch2.id]);
      store.refreshState();
      fixture.detectChanges();
      
      expect(component.isFavouriteLaunch(mockLaunch2)).toBe(true);
    });
  });

  describe("refreshData", () => {
    it("should call loadLaunches", () => {
      const loadSpy = spyOn(component, "loadLaunches");
      component.refreshData();
      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe("isCardHidden", () => {
    it("should return false when favoritesOnly is false", () => {
      component.favoritesOnly.set(false);
      const result = component.isCardHidden(mockLaunch1);
      expect(result).toBe(false);
    });

    it("should return false when launch is favorite and favoritesOnly is true", () => {
      component.favoritesOnly.set(true);
      const result = component.isCardHidden(mockLaunch1);
      expect(result).toBe(false);
    });

    it("should return true when launch is not favorite and favoritesOnly is true", () => {
      component.favoritesOnly.set(true);
      const result = component.isCardHidden(mockLaunch2);
      expect(result).toBe(true);
    });
  });

  describe("Filtered Launches - Search Functionality", () => {
    it("should filter launches by search term", () => {
      component.searchTerm.set("Falcon");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(1);
      expect(component.filteredLaunches()[0].name).toContain("Falcon");
    });

    it("should filter launches case-insensitively", () => {
      component.searchTerm.set("falcon");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(1);
      expect(component.filteredLaunches()[0].name).toContain("Falcon");
    });

    it("should filter launches with whitespace", () => {
      component.searchTerm.set("  Falcon  ");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(1);
    });

    it("should return all launches when search term is empty", () => {
      component.searchTerm.set("");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(3);
    });

    it("should return empty array when no launches match search term", () => {
      component.searchTerm.set("NonExistentRocket");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(0);
    });
  });

  describe("Signal Reactivity", () => {
    it("should update filtered launches when search term changes", () => {
      expect(component.filteredLaunches().length).toBe(3);
      
      component.searchTerm.set("Starship");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(1);
      expect(component.filteredLaunches()[0].name).toBe("Starship Test Launch");
    });

    it("should update filtered launches when store data changes", () => {
      const newLaunch: Launch = {
        ...mockLaunch1,
        id: "4",
        name: "New Launch"
      };
      
      store.overrideSelector(selectAllLaunches, [...mockLaunches, newLaunch]);
      store.refreshState();
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(4);
    });

    it("should update filtered launches when favoritesOnly signal changes", () => {
      component.favoritesOnly.set(true);
      fixture.detectChanges();
      
      // Should only show favorite launches (mockLaunch1 and mockLaunch3)
      expect(component.filteredLaunches().length).toBe(2);
      expect(component.filteredLaunches()).toContain(mockLaunch1);
      expect(component.filteredLaunches()).toContain(mockLaunch3);
      expect(component.filteredLaunches()).not.toContain(mockLaunch2);
    });

    it("should combine search term and favorites only filters", () => {
      component.searchTerm.set("Dragon");
      component.favoritesOnly.set(true);
      fixture.detectChanges();
      
      // Dragon is a favorite and matches search term
      expect(component.filteredLaunches().length).toBe(1);
      expect(component.filteredLaunches()[0].name).toBe("Dragon Cargo Mission");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty launches array", () => {
      store.overrideSelector(selectAllLaunches, []);
      store.refreshState();
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(0);
    });

    it("should handle undefined launch names in search", () => {
      const launchWithUndefinedName = {
        ...mockLaunch1,
        name: undefined as any
      };
      
      store.overrideSelector(selectAllLaunches, [launchWithUndefinedName]);
      store.refreshState();
      fixture.detectChanges();
      
      component.searchTerm.set("test");
      fixture.detectChanges();
      
      // Should handle gracefully without throwing error
      expect(component.filteredLaunches()).toBeDefined();
    });

    it("should handle null launch names in search", () => {
      const launchWithNullName = {
        ...mockLaunch1,
        name: null as any
      };
      
      store.overrideSelector(selectAllLaunches, [launchWithNullName]);
      store.refreshState();
      fixture.detectChanges();
      
      component.searchTerm.set("test");
      fixture.detectChanges();
      
      // Should handle gracefully without throwing error
      expect(component.filteredLaunches()).toBeDefined();
    });

    it("should handle special characters in search term", () => {
      component.searchTerm.set("!@#$%^&*()");
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(0);
    });

    it("should handle very long search terms", () => {
      const longSearchTerm = "a".repeat(1000);
      component.searchTerm.set(longSearchTerm);
      fixture.detectChanges();
      
      expect(component.filteredLaunches().length).toBe(0);
    });
  });

  describe("Favorites Toggle Functionality", () => {
    it("should toggle favoritesOnly signal", () => {
      expect(component.favoritesOnly()).toBe(false);
      
      component.favoritesOnly.set(true);
      expect(component.favoritesOnly()).toBe(true);
      
      component.favoritesOnly.set(false);
      expect(component.favoritesOnly()).toBe(false);
    });

    it("should update filtered launches when toggling favorites only", () => {
      expect(component.filteredLaunches().length).toBe(3);
      
      component.favoritesOnly.set(true);
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(2);
      
      component.favoritesOnly.set(false);
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(3);
    });
  });

  describe("Real-time Filtering", () => {
    it("should update filtered launches as user types", () => {
      component.searchTerm.set("F");
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(1);
      
      component.searchTerm.set("Fa");
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(1);
      
      component.searchTerm.set("Falcon");
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(1);
    });

    it("should be case-insensitive with mixed case search", () => {
      component.searchTerm.set("fAlCoN");
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(1);
      
      component.searchTerm.set("STARSHIP");
      fixture.detectChanges();
      expect(component.filteredLaunches().length).toBe(1);
    });
  });

  describe("Multiple Launches Display", () => {
    it("should display all launches when no filters applied", () => {
      expect(component.filteredLaunches().length).toBe(3);
      expect(component.filteredLaunches()).toContain(mockLaunch1);
      expect(component.filteredLaunches()).toContain(mockLaunch2);
      expect(component.filteredLaunches()).toContain(mockLaunch3);
    });

    it("should maintain launch order", () => {
      const launches = component.filteredLaunches();
      expect(launches[0].flight_number).toBe(1);
      expect(launches[1].flight_number).toBe(2);
      expect(launches[2].flight_number).toBe(3);
    });
  });
});