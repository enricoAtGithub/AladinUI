// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { timeInterval } from 'rxjs/operators';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);


// Test all unit tests.
// const context = require.context('./', true, /\.spec\.ts$/);

// test only one spec file (https://stackoverflow.com/questions/40683673/how-to-execute-only-one-test-spec-with-angular-cli)
// const context = require.context('./', true, /jmeleon-actions-permission.service\.spec\.ts$/);
// const context = require.context('./', true, /jmeleon-actions.utils\.spec\.ts$/);
const context = require.context('./', true, /permission-check-test.component\.spec\.ts$/);




// And load the modules.
context.keys().map(context);
