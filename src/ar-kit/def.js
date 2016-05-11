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
var arkit = angular.module('redhawk.ar-kit', ['redhawk.sockets', 'ngRoute', 'ngAnimate', 'ui.router', 'ui.bootstrap']);

// Give it a root path for importing other files
var rh = angular.module('redhawk');
arkit.distURL = rh.distURL + 'ar-kit/';

/* 
  ARKit path config.  Users can configure these paths and the rest of the ARKit
  UI elements will inherit the changes.  For example: 

  angular.configure(function(ARPathConfigProvider) {
    ARPathConfig.setApplications('/myApps');
    ARPathConfig.setApplicationId('myAppIdKey');
  }]);

  And then in a directive:
  
  angular.directive('MyDirective', function (ARPathConfig) { etc. });

  Note the 'configure' call using ARPathConfigProvider, and the directive (injected)
  is ARPathConfig.
 */
arkit.provider('ARPathConfig', function() {
  // Helper function to take "/domains" and "domainId" => "/domains/:domainId?"
  var apply = function (base, id, required) { 
    return base + '/:' + id + (required ? '' : '?'); 
  }

  // Top-level paths that can be configured and their $routeParameters tokens
  var domains         = '/domains';
  var domainId        = 'domainId';
  var deviceManagers  = '/deviceManagers';
  var deviceManagerId = 'deviceManagerId';
  var applications    = '/applications';
  var applicationId   = 'applicationId';
  var devices         = '/devices';
  var deviceId        = 'deviceId';
  var services        = '/services';
  var serviceId       = 'serviceId';
  var components      = '/components';
  var componentId     = 'componentId';
  var allocations     = '/allocations';
  var allocationId    = 'allocationId';

  this.setDomains         = function (v) { domains         = v; }
  this.setDomainId        = function (v) { domainId        = v; }
  this.setDeviceManagers  = function (v) { deviceManagers  = v; }
  this.setDeviceManagerId = function (v) { deviceManagerId = v; }
  this.setApplications    = function (v) { applications    = v; }
  this.setApplicationId   = function (v) { applicationId   = v; }
  this.setDevices         = function (v) { devices         = v; }
  this.setDeviceId        = function (v) { deviceId        = v; }
  this.setServices        = function (v) { services        = v; }
  this.setServiceId       = function (v) { serviceId       = v; }
  this.setComponents      = function (v) { components      = v; }
  this.setComponentId     = function (v) { componentId     = v; }
  this.setAllocations     = function (v) { allocations     = v; }
  this.setAllocationId    = function (v) { allocationId    = v; }

  // Compiled routes
  this.domain        = function () { return apply(domains, domainId); }
  this.deviceManager = function () { return apply(deviceManagers, deviceManagerId); }
  this.application   = function () { return apply(applications, applicationId); }
  this.device        = function () { return apply(deviceManagers, deviceManagerId, true) + apply(devices,  deviceId); }
  this.service       = function () { return apply(deviceManagers, deviceManagerId, true) + apply(services, serviceId); }
  this.component     = function () { return apply(applications, applicationId, true) +  apply(components, componentId); }
  this.allocation    = function () { return apply(allocations, allocationId); }
  var self = this;

  this.$get = function () {
    return {
      // Individual parameters
      domains         : domains,
      deviceManagers  : deviceManagers,
      applications    : applications,
      devices         : devices,
      services        : services,
      components      : components,
      allocations     : allocations,
      domainId        : domainId,
      deviceManagerId : deviceManagerId,
      applicationId   : applicationId,
      deviceId        : deviceId,
      serviceId       : serviceId,
      componentId     : componentId,
      allocationId    : allocationId,

      // Compiled routes (interpolatable)
      domain          : self.domain(),
      deviceManager   : self.deviceManager(),
      application     : self.application(),
      device          : self.device(),
      service         : self.service(),
      component       : self.component(),
      allocation      : self.allocation(),

      // Interpolator, pass a compiled route and list of parameters to inject, in order.
      // Adapted from: http://www.bennadel.com/blog/2613-using-url-interpolation-with-http-in-angularjs.htm
      //
      // params is a map of IDs (above) to user-defined values.
      //     var params = {};
      //     params(ARPathConfig.domainId, 'REDHAWK_DEV');
      //     var path = ARPathConfig.interpolate(ARPathConfig.domain, params);
      //     // Result is /domains/REDHAW_DEV?
      interpolate     : function (route, params) {
        localParams = (angular.extend({}, params) || {});

        route = route.replace( /(\(\s*|\s*\)|\s*\|\s*)/g, "" );

        // Replace each label in the URL (ex, :domainId).
        route = route.replace(
          /:([a-z]\w*)/gi,
          function( $0, label ) {
            return( popFirstKey( localParams, label ) || "" );
          }
        );

        // Strip out any repeating slashes (but NOT the http:// version).
        route = route.replace( /(^|[^:])[\/]{2,}/g, "$1/" );

        // Strip out any trailing slash.
        route = route.replace( /\/+$/i, "" );

        // Take 1...N objects and key and perform popKey on the first object
        // that has the given key. All others with the same key are ignored.
        function popFirstKey( object1, objectN, key ) {
          // Convert the arguments list into a true array so we can easily
          // pluck values from either end.
          var objects = Array.prototype.slice.call( arguments );

          // The key will always be the last item in the argument collection.
          var key = objects.pop();

          var object = null;

          // Iterate over the arguments, looking for the first object that
          // contains a reference to the given key.
          while ( object = objects.shift() ) {
            if ( object.hasOwnProperty( key ) ) {
              return( popKey( object, key ) );
            }
          }
        }
        
        // Delete the key from the given object and return the value.
        function popKey( object, key ) {
          var value = object[ key ];
          delete( object[ key ] );
          return( value );
        }

        return( route.replace('?','') );
      }
    }
  }
});

/* 
  Data for the top-level view controllers that can be used 
  when configuring $routeProvider.
 */
arkit.constant('ARDefaultViews', {
    domains : {
      templateUrl : 'ar-kit/domains/ar-view-domains.html',
      controller  : 'ARDomainsController'
    },
    deviceManagers : {
      templateUrl : 'ar-kit/deviceManagers/ar-view-device-managers.html',
      controller  : 'ARDeviceManagersController'
    },
    applications : {
      templateUrl : 'ar-kit/applications/ar-view-applications.html',
      controller  : 'ARApplicationsController'
    },
    allocations : {
      templateUrl : 'ar-kit/allocations/ar-view-allocations.html',
      controller  : 'ARAllocationsController'
    }
  });

// Provider related to the ARSelectedDomain service
// This controls whether or not the ARSelectedDomain service attempts to automatically
// connect to the first domain it sees (the default).  Usage example:
// 
// mymodule.configure(['ARSelectedDomainOptionsProvider', 
//   function(ARSelectedDomainOptionsProvider) {
//     ARSelectedDomainOptionsProvider.disableAutoSelect();
//   }])

arkit.provider('ARSelectedDomainOptions', function() {
  var autoSelect = true;
  this.disableAutoSelect = function () { autoSelect = false; }
  this.enableAutoSelect = function () { autoSelect = true; }

  this.$get = function () {
    return {
      autoSelect : autoSelect,
    }
  }
});

// Simple service for holding the presently-selected domain factory instance
arkit.service('ARSelectedDomain', ['REDHAWK', 'ARSelectedDomainOptions',
  function (REDHAWK, ARSelectedDomainOptions) {
    var self = this;

    // Kick off the main listener and expose the list of IDs
    REDHAWK.enablePush();
    self.availableDomainIds = REDHAWK.domainIds;

    // Domain selection
    self.inst = null;
    self.setSelectedDomain = function(id, factory) {
      if (!!id)
        self.inst = REDHAWK.getDomain(id, factory);
      else
        self.inst = null;
    }

    // If autoSelect is enabled, attach a listener to facilitate
    if (ARSelectedDomainOptions.autoSelect == true) {
      REDHAWK.addListener(function (msg) {
        if (!!msg && msg.domains && 0 < msg.domains.length && null == self.inst) {
          self.setSelectedDomain(msg.domains[0]);
        }
      });
    }
  }]);

/*
  ARIndicatorService service provides a means to track a value
  based on a common identifier for use in badges, etc.

  For example, the arNavbarItem directive uses it with the "route"
  to establish if indications should be showing for that navbar item.
 */
arkit.service('ARIndicatorService', 
  function () {
    var indicators = [];

    this.getIndication = function (identifier) {
      return findIndication(identifier).value;
    }

    this.setIndication = function (identifier, value) {
      var indicator = findIndication(identifier);
      indicator.value = value;
    }

    var findIndication = function (identifier) {
      var indicator = null;

      for (var i = 0, len = indicators.length; i < len; i++) {
        if (identifier == indicators[i].identifier) {
          indicator = indicators[i];
          break;
        }
      }
      // Create a new one.
      if (!indicator) {
        indicator = { identifier: identifier, value: 0 };
        indicators.push(indicator);
      }
      return indicator;
    }
  });

// Tacking on a helper function to all scopes for determining if a location (path) is
// the presently viewed path according to the router.
arkit.run(['$rootScope', '$location', 
  function($rootScope, $location) {
    $rootScope.isViewLocationActive = function (viewLocation) {
      return viewLocation === $location.path();
    }
  }]);