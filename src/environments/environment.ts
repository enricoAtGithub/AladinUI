// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loadPlayground: true,
  // Story #1733: https://redmine.simply4it.de/issues/1733
  productiveFrontendBackendCheck: false,


  baseUrl: 'http://splylnx2.simply.local:8023/jmeleon/rest/api',
  companyName: 'DOT-IT GmbH',
  companyStreet: 'Alte Landstr. 23',
  companyCity: '85521 Ottobrunn',
  appName: 'JMeleon',
  companyEmail:  'info@dot-it.de',
  companyPhone: '+49 8888 88888888'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
