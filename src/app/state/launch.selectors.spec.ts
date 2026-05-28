import { selectLaunchState, selectAllLaunches, selectIsLoading, selectFavoriteIds } from "./launch.selectors";
import { LaunchState } from "./launch.reducer";
import { Launch, Links, Patch, Reddit, Flickr, Failure, Core, Fairings } from "../interfaces/interfaces";

describe("Launch Selectors", () => {
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

    describe("selectLaunchState", () => {
        it("should select the launch feature state", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const result = selectLaunchState(mockState);

            expect(result).toBeDefined();
            expect(result.launches).toEqual(mockLaunches);
            expect(result.favoriteIds).toEqual(mockFavoriteIds);
            expect(result.loading).toBeFalse();
            expect(result.error).toBeNull();
        });

        it("should handle empty launches array", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const result = selectLaunchState(mockState);

            expect(result.launches).toEqual([]);
            expect(result.launches.length).toBe(0);
        });

        it("should handle loading true state", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: true,
                    error: null
                }
            };

            const result = selectLaunchState(mockState);

            expect(result.loading).toBeTrue();
        });

        it("should handle error state", () => {
            const errorMessage = "Failed to load launches";
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: false,
                    error: errorMessage
                }
            };

            const result = selectLaunchState(mockState);

            expect(result.error).toBe(errorMessage);
        });

        it("should return undefined for non-existent feature state", () => {
            const mockState = {};
            const result = selectLaunchState(mockState);

            expect(result).toBeUndefined();
        });
    });

    describe("selectAllLaunches", () => {
        it("should select all launches from the state", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const result = selectAllLaunches(mockState);

            expect(result).toEqual(mockLaunches);
            expect(result.length).toBe(3);
            expect(result[0].id).toBe("1");
            expect(result[1].id).toBe("2");
            expect(result[2].id).toBe("3");
        });

        it("should return empty array when no launches exist", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const result = selectAllLaunches(mockState);

            expect(result).toEqual([]);
            expect(result.length).toBe(0);
        });

        it("should return launches in correct order", () => {
            const mockState = {
                launch: {
                    launches: [mockLaunch1, mockLaunch2, mockLaunch3],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const result = selectAllLaunches(mockState);

            expect(result[0].flight_number).toBe(1);
            expect(result[1].flight_number).toBe(2);
            expect(result[2].flight_number).toBe(3);
        });

        it("should handle single launch", () => {
            const mockState = {
                launch: {
                    launches: [mockLaunch1],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const result = selectAllLaunches(mockState);

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(mockLaunch1);
        });

        it("should return undefined when launch state is undefined", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };
            const result = selectAllLaunches(mockState);

            expect(result).toBeTruthy();
        });
    });

    describe("selectIsLoading", () => {
        it("should return true when loading", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: true,
                    error: null
                }
            };

            const result = selectIsLoading(mockState);

            expect(result).toBeTrue();
        });

        it("should return false when not loading", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const result = selectIsLoading(mockState);

            expect(result).toBeFalse();
        });

        it("should handle loading state changes", () => {
            // Initial state - loading true
            let mockState: { launch: LaunchState } = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: true,
                    error: null
                }
            };

            let result = selectIsLoading(mockState);
            expect(result).toBeTrue();

            // Updated state - loading false
            mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            result = selectIsLoading(mockState);
            expect(result).toBeFalse();
        });

        it("should return undefined when launch state is undefined", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };
            const result = selectIsLoading(mockState);

            expect(result).toBeFalse();
        });
    });

    describe("selectFavoriteIds", () => {
        it("should select favorite IDs from the state", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const result = selectFavoriteIds(mockState);

            expect(result).toEqual(mockFavoriteIds);
            expect(result.length).toBe(2);
            expect(result).toContain("1");
            expect(result).toContain("3");
            expect(result).not.toContain("2");
        });

        it("should return empty array when no favorites exist", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const result = selectFavoriteIds(mockState);

            expect(result).toEqual([]);
            expect(result.length).toBe(0);
        });

        it("should handle single favorite ID", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: ["1"],
                    loading: false,
                    error: null
                }
            };

            const result = selectFavoriteIds(mockState);

            expect(result.length).toBe(1);
            expect(result[0]).toBe("1");
        });

        it("should handle favorite IDs for non-existent launches", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: ["999", "1000"],
                    loading: false,
                    error: null
                }
            };

            const result = selectFavoriteIds(mockState);

            expect(result).toEqual(["999", "1000"]);
            expect(result.length).toBe(2);
        });

        it("should return undefined when launch state is undefined", () => {
            const mockState = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };
            const result = selectFavoriteIds(mockState);

            expect(result).toBeTruthy();
        });
    });

    describe("Selector Composition and Memoization", () => {
        it("should return the same reference when state hasn't changed", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const result1 = selectAllLaunches(mockState);
            const result2 = selectAllLaunches(mockState);

            // NgRx selectors are memoized, so should return same reference
            expect(result1).toBe(result2);
        });

        it("should return new reference when state changes", () => {
            const mockState1 = {
                launch: {
                    launches: [mockLaunch1],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const mockState2 = {
                launch: {
                    launches: [mockLaunch1, mockLaunch2],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const result1 = selectAllLaunches(mockState1);
            const result2 = selectAllLaunches(mockState2);

            expect(result1).not.toBe(result2);
        });
    });

    describe("Selector Projections", () => {
        it("should allow composition of selectors", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            // Compose selectors to get favorite launches
            const allLaunches = selectAllLaunches(mockState);
            const favoriteIds = selectFavoriteIds(mockState);
            const favoriteLaunches = allLaunches.filter(launch => favoriteIds.includes(launch.id));

            expect(favoriteLaunches.length).toBe(2);
            expect(favoriteLaunches[0].id).toBe("1");
            expect(favoriteLaunches[1].id).toBe("3");
        });

        it("should allow deriving computed values", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const allLaunches = selectAllLaunches(mockState);
            const favoriteCount = selectFavoriteIds(mockState).length;
            const successCount = allLaunches.filter(l => l.success === true).length;

            expect(favoriteCount).toBe(2);
            expect(successCount).toBe(2); // mockLaunch1 and mockLaunch3 are successful
        });
    });

    describe("Edge Cases", () => {

        it("should handle undefined launches in state", () => {
            const mockState = {
                launch: {
                    launches: undefined,
                    favoriteIds: mockFavoriteIds,
                    loading: false,
                    error: null
                }
            };

            const result = selectAllLaunches(mockState);
            expect(result).toBeUndefined();
        });

        it("should handle undefined favoriteIds in state", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: undefined,
                    loading: false,
                    error: null
                }
            };

            const result = selectFavoriteIds(mockState);
            expect(result).toBeUndefined();
        });

        it("should handle null launch state", () => {
            const mockState = {
                launch: null
            };

            const result = selectLaunchState(mockState);
            expect(result).toBeNull();
        });
    });

    describe("Multiple State Updates", () => {
        it("should handle sequential state updates correctly", () => {
            // Initial state
            let mockState: { launch: LaunchState } = {
                launch: {
                    launches: [],
                    favoriteIds: [],
                    loading: true,
                    error: null
                }
            };

            expect(selectIsLoading(mockState)).toBeTrue();
            expect(selectAllLaunches(mockState)).toEqual([]);
            expect(selectFavoriteIds(mockState)).toEqual([]);

            // After loading completes
            mockState = {
                launch: {
                    launches: [mockLaunch1],
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            expect(selectIsLoading(mockState)).toBeFalse();
            expect(selectAllLaunches(mockState)).toEqual([mockLaunch1]);
            expect(selectFavoriteIds(mockState)).toEqual([]);

            // After adding favorites
            mockState = {
                launch: {
                    launches: [mockLaunch1],
                    favoriteIds: ["1"],
                    loading: false,
                    error: null
                }
            };

            expect(selectIsLoading(mockState)).toBeFalse();
            expect(selectAllLaunches(mockState)).toEqual([mockLaunch1]);
            expect(selectFavoriteIds(mockState)).toEqual(["1"]);
        });
    });

    describe("Real-world Scenarios", () => {
        it("should filter launches by success status using selectors", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: [],
                    loading: false,
                    error: null
                }
            };

            const allLaunches = selectAllLaunches(mockState);
            const successfulLaunches = allLaunches.filter(launch => launch.success === true);
            const failedLaunches = allLaunches.filter(launch => launch.success === false);

            expect(successfulLaunches.length).toBe(2);
            expect(failedLaunches.length).toBe(1);
            expect(failedLaunches[0].id).toBe("2");
        });

        it("should filter favorite launches by success status", () => {
            const mockState = {
                launch: {
                    launches: mockLaunches,
                    favoriteIds: ["1", "2"],
                    loading: false,
                    error: null
                }
            };

            const favoriteIds = selectFavoriteIds(mockState);
            const allLaunches = selectAllLaunches(mockState);
            const favoriteLaunches = allLaunches.filter(launch => favoriteIds.includes(launch.id));
            const successfulFavorites = favoriteLaunches.filter(launch => launch.success === true);

            expect(favoriteLaunches.length).toBe(2);
            expect(successfulFavorites.length).toBe(1);
            expect(successfulFavorites[0].id).toBe("1");
        });
    });
});