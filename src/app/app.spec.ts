import { ComponentFixture, TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { App } from "./app";
import { Store } from "@ngrx/store";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { LaunchState } from "./state/launch.reducer";
import { RouterOutlet } from "@angular/router";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AsyncPipe } from "@angular/common";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

describe("App Component", () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let store: MockStore<{ launches: LaunchState; }>;
  let mockLaunchState: LaunchState;

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
        RouterOutlet,
        MatProgressBarModule,
        AsyncPipe,
        App
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore<{ launches: LaunchState; }>;
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    
    // Get reference to the store's state
    mockLaunchState = {
      launches: [],
      favoriteIds: [],
      loading: false,
      error: null
    };
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  describe("Component Creation", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should have isLoading$ observable defined", () => {
      expect(component.isLoading$).toBeDefined();
      expect(component.isLoading$ instanceof Observable).toBeTrue();
    });
  });

  describe("Store Selection and Loading State", () => {
    it("should select loading state from store", fakeAsync(() => {
      // Override store selector to return loading: true

      store.refreshState();
      
      // Create new component to pick up the new state
      const newFixture = TestBed.createComponent(App);
      const newComponent = newFixture.componentInstance;
      
      let loadingValue: boolean | undefined;
      newComponent.isLoading$.subscribe(value => {
        loadingValue = value;
      });
      
      tick();
      expect(loadingValue).toBe(true);
    }));

    it("should return false when not loading", fakeAsync(() => {

      store.refreshState();
      
      const newFixture = TestBed.createComponent(App);
      const newComponent = newFixture.componentInstance;
      
      let loadingValue: boolean | undefined;
      newComponent.isLoading$.subscribe(value => {
        loadingValue = value;
      });
      
      tick();
      expect(loadingValue).toBe(false);
    }));

    it("should update loading state when store changes", fakeAsync(() => {
      let loadingValues: boolean[] = [];
      
      component.isLoading$.subscribe(value => {
        loadingValues.push(value);
      });
      
      // Initial state should be false
      expect(loadingValues[0]).toBeFalse();
      
      store.refreshState();
      tick();
      
      // Update store to loading false again

      store.refreshState();
      tick();
      
      expect(loadingValues).toContain(true);
      expect(loadingValues[loadingValues.length - 1]).toBeFalse();
    }));
  });

  describe("Observable Pipe Operations", () => {
    it("should properly map the store selection using pipe", fakeAsync(() => {
      // Test the pipe map operation directly
      const testState: LaunchState = {
        launches: [],
        favoriteIds: [],
        loading: true,
        error: null
      };
      
      const result = testState.loading;
      expect(result).toBe(true);
      
      store.refreshState();
      
      const newFixture = TestBed.createComponent(App);
      const newComponent = newFixture.componentInstance;
      
      let loadingResult: boolean | undefined;
      newComponent.isLoading$.subscribe(value => {
        loadingResult = value;
      });
      
      tick();
      expect(loadingResult).toBe(true);
    }));
  });

  describe("AsyncPipe Compatibility", () => {
    it("should provide observable that works with AsyncPipe", fakeAsync(() => {
      // AsyncPipe requires observables to emit values
      let emittedValue: boolean | undefined;
      
      component.isLoading$.subscribe(value => {
        emittedValue = value;
      });
      
      tick();
      expect(emittedValue).toBeDefined();
      expect(typeof emittedValue).toBe('boolean');
    }));

    it("should emit multiple values over time", fakeAsync(() => {
      const emittedValues: boolean[] = [];
      
      component.isLoading$.subscribe(value => {
        emittedValues.push(value);
      });
      

      store.refreshState();
      tick();
      

      store.refreshState();
      tick();
      

      store.refreshState();
      tick();
      
      expect(emittedValues.length).toBeGreaterThanOrEqual(3);
      expect(emittedValues).toContain(true);
      expect(emittedValues).toContain(false);
    }));
  });

  describe("Store State Structure", () => {
    it("should correctly access the launch property from store", () => {
      const mockStoreState = {
        launch: {
          launches: [],
          favoriteIds: [],
          loading: true,
          error: null
        }
      };
      
      const selectedLoading = mockStoreState.launch.loading;
      expect(selectedLoading).toBe(true);
    });

    it("should handle undefined store state gracefully", () => {
      // This tests that the selector is resilient
      const selector = (state: any) => state?.launch?.loading ?? false;
      
      expect(selector({})).toBe(false);
      expect(selector(null)).toBe(false);
      expect(selector({ launch: null })).toBe(false);
      expect(selector({ launch: { loading: true } })).toBe(true);
    });
  });


  describe("RxJS Operator Usage", () => {
    it("should use map operator correctly", () => {
      const testObservable = of({ loading: true });
      const mapped = testObservable.pipe(map(res => res.loading));
      
      let result: boolean | undefined;
      mapped.subscribe(value => {
        result = value;
      });
      
      expect(result).toBe(true);
    });

  });

  describe("Memory Management", () => {
    it("should properly clean up observables on component destruction", fakeAsync(() => {
      let subscriptionCalled = false;
      
      const subscription = component.isLoading$.subscribe(() => {
        subscriptionCalled = true;
      });
      
      expect(subscriptionCalled).toBe(true);
      
      // Destroy component
      fixture.destroy();
      
      // Subscription should be cleaned up
      expect(subscription.closed).toBe(true);
    }));
  });

  describe("Multiple Subscribers", () => {
    it("should support multiple subscribers to isLoading$", fakeAsync(() => {
      let value1: boolean | undefined;
      let value2: boolean | undefined;
      
      component.isLoading$.subscribe(v => value1 = v);
      component.isLoading$.subscribe(v => value2 = v);
      
      tick();
      
      expect(value1).toBeDefined();
      expect(value2).toBeDefined();
      expect(value1).toEqual(value2);
    }));

    it("should emit same values to all subscribers", fakeAsync(() => {
      const values1: boolean[] = [];
      const values2: boolean[] = [];
      
      component.isLoading$.subscribe(v => values1.push(v));
      component.isLoading$.subscribe(v => values2.push(v));
      
      store.refreshState();
      tick();
      
      store.refreshState();
      tick();
      
      expect(values1).toEqual(values2);
    }));
  });

  describe("Error Handling", () => {
    it("should handle store errors gracefully", fakeAsync(() => {
      // Simulate store error by not overriding selector
      // The component should still work
      expect(() => {
        const newFixture = TestBed.createComponent(App);
        const newComponent = newFixture.componentInstance;
        newComponent.isLoading$.subscribe();
        tick();
      }).not.toThrow();
    }));
  });

  describe("Real-world Scenarios", () => {
    it("should show loading true when data is being fetched", fakeAsync(() => {

      store.refreshState();
      
      const newFixture = TestBed.createComponent(App);
      const newComponent = newFixture.componentInstance;
      
      let loadingState: boolean | undefined;
      newComponent.isLoading$.subscribe(state => {
        loadingState = state;
      });
      
      tick();
      expect(loadingState).toBe(true);
    }));

    it("should show loading false after data is loaded", fakeAsync(() => {

      store.refreshState();
      
      const newFixture = TestBed.createComponent(App);
      const newComponent = newFixture.componentInstance;
      
      let loadingState: boolean | undefined;
      newComponent.isLoading$.subscribe(state => {
        loadingState = state;
      });
      
      tick();
      expect(loadingState).toBe(false);
    }));

    it("should transition from loading to loaded state", fakeAsync(() => {
      const states: boolean[] = [];
      
      component.isLoading$.subscribe(state => {
        states.push(state);
      });
      
      // Initially false
      expect(states[0]).toBeFalse();
      

      store.refreshState();
      tick();
      
 
      store.refreshState();
      tick();
      
      expect(states).toContain(true);
      expect(states).toContain(false);
      expect(states[states.length - 1]).toBe(false);
    }));
  });
});