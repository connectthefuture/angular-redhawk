/*
 * This file is protected by Copyright. Please refer to the COPYRIGHT file
 * distributed with this source distribution.
 *
 * This file is part of Angular-REDHAWK.
 *
 * Angular-REDHAWK is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Angular-REDHAWK is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 */
var ARExplorer = angular.module('ARExplorerApp', ['redhawk', 'redhawk.ar-kit']);

/* Setup the route provider and mess with the routes if you want.
 * Also using the default view controllers that match the navbar entries
 * in the index.html
 */
ARExplorer.config(
  function ($routeProvider, ARDefaultViews, ARPathConfigProvider) {
    /* Setup ARKit default paths.  One could also first configure
     * ARPathConfig's routes and then apply them to the routeProvider
     * thus allowing ARKit's views to inherit those preferred paths.
     */
    $routeProvider
      .when('/', {
        template: '<div></div>',
      })
      .otherwise({ redirectTo: '/' })
      
      /* 
       * Could instantiate other views and then give those details 
       * to the ar-navbar in the index.html.
       */

      // Instantiating 4 default views
      .when(ARPathConfigProvider.domain(),        ARDefaultViews.domains)
      .when(ARPathConfigProvider.application(),   ARDefaultViews.applications)
      .when(ARPathConfigProvider.deviceManager(), ARDefaultViews.deviceManagers)
      .when(ARPathConfigProvider.allocation(),    ARDefaultViews.allocations)
    ;
  });