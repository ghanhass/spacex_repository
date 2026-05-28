import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { LaunchDetails } from "./launch-details";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { LaunchState } from "../../state/launch.reducer";
import { selectAllLaunches, selectFavoriteIds } from "../../state/launch.selectors";
import { Launch, Links, Patch, Reddit, Flickr, Failure, Core, Fairings } from "../../interfaces/interfaces";
import { addLaunchToFavorites, loadFavoriteLaunches, loadLaunchDetail, removeLaunchFromFavorites } from "../../state/launch.actions";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from '@angular/material/grid-list';
import { signal } from "@angular/core";

describe("LaunchDetails", () => {
  let component: LaunchDetails;
  let fixture: ComponentFixture<LaunchDetails>;
  let store: MockStore<{ launches: LaunchState; }>;
  let router: Router;
  let mockActivatedRoute: any;

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

  const mockLaunch: Launch = {
    fairings: mockFairings,
    links: mockLinks,
    static_fire_date_utc: "2023-01-01T00:00:00Z",
    static_fire_date_unix: 1672531200,
    net: false,
    window: 0,
    rocket: "5e9d0d95eda69955f709d1eb",
    success: true,
    failures: mockFailures,
    details: "Test launch details",
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
    ...mockLaunch,
    id: "2",
    name: "Starship Test Launch",
    flight_number: 2,
    success: false
  };

  const mockLaunches: Launch[] = [mockLaunch];
  const mockFavoriteIds: string[] = [];

  const initialState = {
    launches: {
      launches: [],
      favoriteIds: [],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: "1"
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        JsonPipe,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
        MatGridListModule,
        LaunchDetails
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy("navigate")
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<{ launches: LaunchState; }>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LaunchDetails);
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

  describe("Constructor and Initialization", () => {

    it("should call prepareCurrentLaunchSignal in constructor", () => {
      const prepareSpy = spyOn(LaunchDetails.prototype, "prepareCurrentLaunchSignal");
      const newComponent = new LaunchDetails(store, mockActivatedRoute, router);
      expect(prepareSpy).toHaveBeenCalled();
    });
  });

  describe("prepareCurrentLaunchSignal", () => {
    it("should dispatch loadLaunchDetail with launch id from route params", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.prepareCurrentLaunchSignal();
      
      expect(dispatchSpy).toHaveBeenCalledWith(loadLaunchDetail({ launchId: "1" }));
    });

    it("should dispatch loadFavoriteLaunches", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.prepareCurrentLaunchSignal();
      
      expect(dispatchSpy).toHaveBeenCalledWith(loadFavoriteLaunches());
    });

    it("should create a computed signal for currentLaunchSignal", () => {
      expect(component.currentLaunchSignal()).toBeDefined();
      expect(component.currentLaunchSignal()).toEqual(mockLaunch);
    });

    it("should handle undefined launch when no launch found", () => {
      store.overrideSelector(selectAllLaunches, []);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()).toBeUndefined();
    });

  });

  describe("goBack", () => {
    it("should navigate to empty path", () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith([""]);
    });

    it("should call router.navigate exactly once", () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe("refreshData", () => {
    it("should dispatch loadLaunchDetail with current launch id", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.refreshData();
      
      expect(dispatchSpy).toHaveBeenCalledWith(loadLaunchDetail({ launchId: mockLaunch.id }));
    });

    it("should handle undefined currentLaunchSignal", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      store.overrideSelector(selectAllLaunches, []);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      component.refreshData();
      
    });

    it("should dispatch action when currentLaunchSignal has id", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      expect(component.currentLaunchSignal()?.id).toBe("1");
      
      component.refreshData();
      
      expect(dispatchSpy).toHaveBeenCalledWith(loadLaunchDetail({ launchId: "1" }));
    });
  });

  describe("addToFavorite", () => {
    it("should dispatch addLaunchToFavorites action with current launch id", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.addToFavorite();
      
      expect(dispatchSpy).toHaveBeenCalledWith(addLaunchToFavorites({ launchId: mockLaunch.id }));
    });

    it("should dispatch action exactly once when called", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      component.addToFavorite();
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeFromFavorite", () => {
    it("should dispatch removeLaunchFromFavorites action with current launch id", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.removeFromFavorite();
      
      expect(dispatchSpy).toHaveBeenCalledWith(removeLaunchFromFavorites({ launchId: mockLaunch.id }));
    });

    it("should dispatch action exactly once when called", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      component.removeFromFavorite();
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("isFavouriteLaunch", () => {
    it("should return true when launch is in favorites", () => {
      store.overrideSelector(selectFavoriteIds, ["1"]);
      store.refreshState();
      
      const result = component.isFavouriteLaunch();
      
      expect(result).toBe(true);
    });

    it("should return false when launch is not in favorites", () => {
      store.overrideSelector(selectFavoriteIds, ["2", "3"]);
      store.refreshState();
      
      const result = component.isFavouriteLaunch();
      
      expect(result).toBe(false);
    });

    it("should handle undefined currentLaunchSignal", () => {
      store.overrideSelector(selectAllLaunches, []);
      store.overrideSelector(selectFavoriteIds, ["1"]);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      const result = component.isFavouriteLaunch();
      
      expect(result).toBe(false);
    });

    it("should return false when current launch id is undefined", () => {
      store.overrideSelector(selectAllLaunches, []);
      store.refreshState();
      component.prepareCurrentLaunchSignal();
      
      const result = component.isFavouriteLaunch();
      expect(result).toBe(false);
    });

    it("should update when favorite ids change", () => {
      expect(component.isFavouriteLaunch()).toBe(false);
      
      store.overrideSelector(selectFavoriteIds, ["1"]);
      store.refreshState();
      
      expect(component.isFavouriteLaunch()).toBe(true);
    });
  });

  describe("Signal Reactivity", () => {
    it("should update currentLaunchSignal when store selectors change", fakeAsync(() => {
      store.overrideSelector(selectAllLaunches, [mockLaunch2]);
      store.refreshState();
      
      tick();
      fixture.detectChanges();
      
      expect(component.currentLaunchSignal()).toEqual(mockLaunch2);
    }));

    it("should reflect favorite status changes in real-time", () => {
      expect(component.isFavouriteLaunch()).toBe(false);
      
      store.overrideSelector(selectFavoriteIds, ["1"]);
      store.refreshState();
      fixture.detectChanges();
      
      expect(component.isFavouriteLaunch()).toBe(true);
      
      store.overrideSelector(selectFavoriteIds, []);
      store.refreshState();
      fixture.detectChanges();
      
      expect(component.isFavouriteLaunch()).toBe(false);
    });

    it("should handle multiple launches in store and always return first", () => {
      const multipleLaunches: Launch[] = [mockLaunch, mockLaunch2];
      
      store.overrideSelector(selectAllLaunches, multipleLaunches);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      // Should always return first launch from the array
      expect(component.currentLaunchSignal()).toEqual(mockLaunch);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty launches array", () => {
      store.overrideSelector(selectAllLaunches, []);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()).toBeUndefined();
      expect(component.isFavouriteLaunch()).toBe(false);
    });

    it("should handle launches with null/undefined optional properties", () => {
      const launchWithNulls: Launch = {
        ...mockLaunch,
        fairings: null,
        links: {
          ...mockLinks,
          patch: undefined
        },
        static_fire_date_utc: null,
        static_fire_date_unix: null,
        details: null,
        launch_library_id: null
      };
      
      store.overrideSelector(selectAllLaunches, [launchWithNulls]);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()).toBeDefined();
      expect(component.currentLaunchSignal()?.fairings).toBeNull();
      expect(component.currentLaunchSignal()?.links.patch).toBeUndefined();
    });

    it("should handle launch with failures array", () => {
      const launchWithFailures: Launch = {
        ...mockLaunch,
        success: false,
        failures: [
          { time: 10, altitude: 100, reason: "First failure" },
          { time: 20, altitude: 200, reason: "Second failure" }
        ]
      };
      
      store.overrideSelector(selectAllLaunches, [launchWithFailures]);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()?.failures.length).toBe(2);
      expect(component.currentLaunchSignal()?.success).toBeFalse();
    });

    it("should handle launch with cores array having null values", () => {
      const launchWithNullCores: Launch = {
        ...mockLaunch,
        cores: [{
          ...mockCores[0],
          gridfins: null,
          legs: null,
          landing_attempt: null,
          landing_success: null,
          landing_type: null,
          landpad: null
        }]
      };
      
      store.overrideSelector(selectAllLaunches, [launchWithNullCores]);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()?.cores[0].gridfins).toBeNull();
      expect(component.currentLaunchSignal()?.cores[0].landing_type).toBeNull();
    });

    it("should handle upcoming launch", () => {
      const upcomingLaunch: Launch = {
        ...mockLaunch,
        upcoming: true,
        success: null,
        date_utc: "2025-01-01T00:00:00Z"
      };
      
      store.overrideSelector(selectAllLaunches, [upcomingLaunch]);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()?.upcoming).toBeTrue();
      expect(component.currentLaunchSignal()?.success).toBeNull();
    });

    it("should handle launch with empty arrays", () => {
      const launchWithEmptyArrays: Launch = {
        ...mockLaunch,
        crew: [],
        ships: [],
        capsules: [],
        payloads: [],
        failures: [],
        cores: []
      };
      
      store.overrideSelector(selectAllLaunches, [launchWithEmptyArrays]);
      store.refreshState();
      
      component.prepareCurrentLaunchSignal();
      
      expect(component.currentLaunchSignal()?.crew.length).toBe(0);
      expect(component.currentLaunchSignal()?.failures.length).toBe(0);
    });
  });

  describe("Complete Launch Data Validation", () => {
    it("should have all required Launch properties", () => {
      const launch = component.currentLaunchSignal();
      
      expect(launch).toBeDefined();
      expect(launch?.id).toBeDefined();
      expect(launch?.name).toBeDefined();
      expect(launch?.flight_number).toBeDefined();
      expect(launch?.date_utc).toBeDefined();
      expect(launch?.links).toBeDefined();
      expect(launch?.links.patch).toBeDefined();
      expect(launch?.links.reddit).toBeDefined();
      expect(launch?.links.flickr).toBeDefined();
      expect(launch?.cores).toBeDefined();
      expect(launch?.cores.length).toBeGreaterThan(0);
    });

    it("should handle nested optional properties correctly", () => {
      const launch = component.currentLaunchSignal();
      
      // Optional properties should be handled gracefully
      expect(launch?.links.patch?.small).toBeDefined();
      expect(launch?.links.webcast).toBeDefined();
      expect(launch?.fairings?.reused).toBeDefined();
    });
  });

  describe("Multiple Method Calls", () => {
    it("should handle multiple addToFavorite calls", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.addToFavorite();
      component.addToFavorite();
      component.addToFavorite();
      
      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(addLaunchToFavorites({ launchId: mockLaunch.id }));
    });

    it("should handle multiple removeFromFavorite calls", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.removeFromFavorite();
      component.removeFromFavorite();
      component.removeFromFavorite();
      
      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(dispatchSpy).toHaveBeenCalledWith(removeLaunchFromFavorites({ launchId: mockLaunch.id }));
    });

    it("should handle refreshData after favorite changes", () => {
      const dispatchSpy = spyOn(store, "dispatch");
      
      component.addToFavorite();
      component.refreshData();
      component.removeFromFavorite();
      component.refreshData();
      
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
    });
  });
});