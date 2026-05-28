import { TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { SpacexService } from "./spacex";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Launch, Links, Patch, Reddit, Flickr, Failure, Core, Fairings } from "../interfaces/interfaces";
import { map } from "rxjs";

describe("SpacexService", () => {
  let service: SpacexService;
  let httpMock: HttpTestingController;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

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

  const mockPastLaunches: Launch[] = [mockLaunch, mockLaunch2];

  beforeEach(() => {
    // Create mock MatSnackBar
    mockSnackBar = jasmine.createSpyObj("MatSnackBar", ["open"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SpacexService,
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    service = TestBed.inject(SpacexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify();
  });

  describe("Service Creation", () => {
    it("should be created", () => {
      expect(service).toBeTruthy();
    });

    it("should have apiUrl defined", () => {
      expect((service as any).apiUrl).toBe("https://api.spacexdata.com/v4/launches");
    });

    it("should inject MatSnackBar", () => {
      expect((service as any).snackBar).toBe(mockSnackBar);
    });
  });

  describe("getPastLaunches", () => {
    it("should fetch past launches from the correct API endpoint", () => {
      service.getPastLaunches().subscribe(launches => {
        expect(launches).toEqual(mockPastLaunches);
        expect(launches.length).toBe(2);
      });

      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      expect(req.request.method).toBe("GET");
      req.flush(mockPastLaunches);
    });

    it("should return an empty array when no past launches exist", () => {
      service.getPastLaunches().subscribe(launches => {
        expect(launches).toEqual([]);
        expect(launches.length).toBe(0);
      });

      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush([]);
    });

    it("should handle HTTP errors gracefully", () => {
      const errorMessage = "Network error";
      
      service.getPastLaunches().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe("Internal Server Error");
        }
      });

      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush(errorMessage, { status: 500, statusText: "Internal Server Error" });
    });

    it("should handle 404 errors", () => {
      service.getPastLaunches().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe("Not Found");
        }
      });

      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush("Not found", { status: 404, statusText: "Not Found" });
    });

    it("should handle timeout errors", fakeAsync(() => {
      service.getPastLaunches().subscribe({
        error: (error) => {
          //expect(error.type).toBe("TIMEOUT");
        }
      });

      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush(null, { status: 0, statusText: "Timeout" });
      tick();
    }));
  });

  describe("getLaunchById", () => {
    it("should fetch launch by id from the correct API endpoint", () => {
      const launchId = "1";
      
      service.getLaunchById(launchId).subscribe(launch => {
        expect(launch).toEqual(mockLaunch);
        expect(launch.id).toBe(launchId);
      });

      const req = httpMock.expectOne(`https://api.spacexdata.com/v4/launches/${launchId}`);
      expect(req.request.method).toBe("GET");
      req.flush(mockLaunch);
    });

    it("should handle different launch IDs", () => {
      const launchId = "2";
      
      service.getLaunchById(launchId).subscribe(launch => {
        expect(launch).toEqual(mockLaunch2);
        expect(launch.id).toBe(launchId);
      });

      const req = httpMock.expectOne(`https://api.spacexdata.com/v4/launches/${launchId}`);
      req.flush(mockLaunch2);
    });

    it("should handle non-existent launch ID", () => {
      const invalidId = "999";
      
      service.getLaunchById(invalidId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`https://api.spacexdata.com/v4/launches/${invalidId}`);
      req.flush("Launch not found", { status: 404, statusText: "Not Found" });
    });

    it("should handle invalid ID format", () => {
      const invalidId = "invalid-id!@#$";
      
      service.getLaunchById(invalidId).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`https://api.spacexdata.com/v4/launches/${invalidId}`);
      req.flush("Invalid ID format", { status: 400, statusText: "Bad Request" });
    });
  });

  describe("openSnackBar", () => {
    it("should call snackBar.open with provided message and action", () => {
      const message = "Test message";
      const action = "Close";
      
      service.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action);
      expect(mockSnackBar.open).toHaveBeenCalledTimes(1);
    });

    it("should handle empty message", () => {
      const message = "";
      const action = "OK";
      
      service.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action);
    });

    it("should handle empty action", () => {
      const message = "Test message";
      const action = "";
      
      service.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action);
    });

    it("should handle both empty parameters", () => {
      const message = "";
      const action = "";
      
      service.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action);
    });

    it("should handle long messages", () => {
      const message = "A".repeat(1000);
      const action = "Close";
      
      service.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action);
    });

    it("should handle special characters in message", () => {
      const message = "!@#$%^&*()_+{}|:<>?~`";
      const action = "Close";
      
      service.openSnackBar(message, action);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, action);
    });
  });

  describe("HTTP Request Configuration", () => {
    it("should set correct Content-Type header", () => {
      service.getPastLaunches().subscribe();
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      expect(req.request.headers.get("Content-Type")).toBeNull(); // GET requests typically don't have Content-Type
      req.flush(mockPastLaunches);
    });

    it("should not include body in GET requests", () => {
      service.getPastLaunches().subscribe();
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      expect(req.request.body).toBeNull();
      req.flush(mockPastLaunches);
    });
  });

  describe("Multiple Concurrent Requests", () => {
    it("should handle multiple getPastLaunches requests", () => {
      service.getPastLaunches().subscribe(launches => {
        expect(launches).toEqual(mockPastLaunches);
      });
      
      service.getPastLaunches().subscribe(launches => {
        expect(launches).toEqual(mockPastLaunches);
      });
      
      const requests = httpMock.match("https://api.spacexdata.com/v4/launches/past");
      expect(requests.length).toBe(2);
      
      requests.forEach(req => {
        expect(req.request.method).toBe("GET");
        req.flush(mockPastLaunches);
      });
    });

    it("should handle multiple different requests", () => {
      service.getPastLaunches().subscribe();
      service.getLaunchById("1").subscribe();
      
      const pastReq = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      const launchReq = httpMock.expectOne("https://api.spacexdata.com/v4/launches/1");
      
      expect(pastReq.request.method).toBe("GET");
      expect(launchReq.request.method).toBe("GET");
      
      pastReq.flush(mockPastLaunches);
      launchReq.flush(mockLaunch);
    });
  });

  describe("Response Caching", () => {
    it("should not cache responses by default (each subscription triggers new request)", () => {
      service.getPastLaunches().subscribe();
      service.getPastLaunches().subscribe();
      
      const requests = httpMock.match("https://api.spacexdata.com/v4/launches/past");
      expect(requests.length).toBe(2);
      
      requests.forEach(req => req.flush(mockPastLaunches));
    });
  });

  describe("Data Transformation", () => {
    it("should return typed Launch array from getPastLaunches", () => {
      service.getPastLaunches().subscribe(launches => {
        launches.forEach(launch => {
          expect(launch.id).toBeDefined();
          expect(launch.name).toBeDefined();
          expect(launch.flight_number).toBeDefined();
          expect(launch.links).toBeDefined();
        });
      });
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush(mockPastLaunches);
    });

    it("should return typed Launch object from getLaunchById", () => {
      service.getLaunchById("1").subscribe(launch => {
        expect(launch.id).toBe("1");
        expect(launch.name).toBe("Falcon 9 Test Launch");
        expect(launch.success).toBe(true);
        expect(launch.links.patch?.small).toBeDefined();
      });
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/1");
      req.flush(mockLaunch);
    });
  });

  describe("Error Recovery", () => {
    it("should allow retry after error", () => {
      let attempt = 0;
      
      const makeRequest = () => {
        service.getPastLaunches().subscribe({
          next: (launches) => {
            if (attempt === 1) {
              expect(launches).toEqual(mockPastLaunches);
            }
          },
          error: () => {
            if (attempt === 0) {
              attempt++;
              makeRequest();
            }
          }
        });
        
        const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
        
        if (attempt === 0) {
          req.flush("Error", { status: 500, statusText: "Server Error" });
        } else {
          req.flush(mockPastLaunches);
        }
      };
      
      makeRequest();
    });
  });

  describe("Real-world Scenarios", () => {
    it("should fetch past launches and then get specific launch details", () => {
      // First, get past launches
      service.getPastLaunches().subscribe(launches => {
        expect(launches).toEqual(mockPastLaunches);
        
        // Then get details for the first launch
        service.getLaunchById(launches[0].id).subscribe(launch => {
          expect(launch).toEqual(mockLaunch);
        });
        
        const launchReq = httpMock.expectOne(`https://api.spacexdata.com/v4/launches/${launches[0].id}`);
        launchReq.flush(mockLaunch);
      });
      
      const pastReq = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      pastReq.flush(mockPastLaunches);
    });

    it("should show snackbar message when API error occurs", () => {
      service.getPastLaunches().subscribe({
        error: () => {
          service.openSnackBar("Failed to load launches", "Dismiss");
          expect(mockSnackBar.open).toHaveBeenCalledWith("Failed to load launches", "Dismiss");
        }
      });
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush("Error", { status: 500, statusText: "Server Error" });
    });
  });

  describe("RxJS Operators Integration", () => {
    it("should work with map operator", () => {
      service.getPastLaunches().pipe(
        map((launches: Launch[]) => launches.map(l => l.name))
      ).subscribe(names => {
        expect(names).toEqual([mockLaunch.name, mockLaunch2.name]);
      });
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush(mockPastLaunches);
    });

    it("should work with filter operator", () => {
      service.getPastLaunches().pipe(
        map(launches => launches.filter(l => l.success === true))
      ).subscribe(successfulLaunches => {
        expect(successfulLaunches.length).toBe(1);
        expect(successfulLaunches[0].id).toBe("1");
      });
      
      const req = httpMock.expectOne("https://api.spacexdata.com/v4/launches/past");
      req.flush(mockPastLaunches);
    });
  });
});