# Technical Assessment: Angular & NgRx "SpaceX Explorer" v1.0

Welcome! The goal of this technical assessment is to refactor, debug, and finalize an Angular application built for exploring SpaceX rocket launches. 

The application uses **Angular Material** for the UI and **NgRx** for global state management. However, the previous developer rushed the initial implementation. The current codebase contains memory leaks, performance bottlenecks, a critical architectural flaw inside the NgRx Reducer, and missing core async features.


## 🎯 Your Missions

1. **Implement the Missing NgRx Effect:**
   - Currently, the component triggers raw HTTP calls directly via the service. Refactor this logic so the component dispatches a `loadLaunches` action instead.
   - Create a **NgRx Effect** from scratch to handle the asynchronous stream fetching data from the SpaceX API.
2. **Feature Development (Details View & Favorites):**
   - Implement the launch details view, mapped to the `/launch/:id` route.
   - Leverage the NgRx store to manage the "Favorite" state of a launch. This state must persist seamlessly when navigating back and forth between the list and details views.
3. **Project configuration :** 
    - Configure the project to be production ready

## 🛠️ Technical Specifications
- **List Endpoint:** `https://api.spacexdata.com/v4/launches/past`
- **Details Endpoint:** `https://api.spacexdata.com/v4/launches/{id}`
- Angular Material is pre-installed. Baseline layouts and grid styling can be found in the component's SCSS file.

## 📋 Evaluation Criteria
- **Clean Architecture:** Proper separation of concerns (Smart vs. Presentational components, encapsulating logic away from templates).
- **RxJS & NgRx Mastery:** Clean stream manipulation, avoiding nesting subscriptions, keeping the state strictly immutable, and leveraging memoized selectors.
- **Modern Angular Standards:** Proper usage of Standalone components and modern control flow (or Signals if you choose to introduce them).
- **TypeScript Rigor:** Explicit interface definitions for API payloads. The use of `any` is strictly prohibited.
- **Git Hygiene:** Clean, atomic, and descriptive commit history.

## Bonus
- Setup a docker production ready for this app

## 📦 Submission Guidelines
1. Push your code to a public GitHub repository.
2. Ensure your `README.md` includes straightforward instructions to install and run the project locally 

Good luck! We look forward to reviewing your code.