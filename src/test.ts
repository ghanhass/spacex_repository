// Test entry point file
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import "zone.js/testing";

// First, initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true
  }
);

// Test files
import "../src/app/components/launches-list/launches-list.spec";
import "../src/app/components/launch-details/launch-details.spec";
import "../src/app/app.spec";