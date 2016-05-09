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
var arkit = angular.module('redhawk.ar-kit');

// DeviceManagers view controller
arkit.controller('ARDeviceManagersController', 
         ['$scope', '$routeParams', 'ARSelectedDomain', 'ARPathConfig','ARBreadCrumb',
  function($scope, $routeParams, ARSelectedDomain, ARPathConfig, ARBreadCrumb) {
    var deviceManagersPath = ARPathConfig.deviceManagers;
    $scope.crumbs = [ARBreadCrumb.crumb('Device Managers', deviceManagersPath)];

    $scope.collapseGrid = false;
    $scope.viewingDeviceManager = null;
    $scope.ARSelectedDomain = ARSelectedDomain;

    // Automatically load the device manager if it's in the route parameters
    if (!!$routeParams[ARPathConfig.deviceManagerId] && !!ARSelectedDomain.inst) {
      var viewingDeviceManager = ARSelectedDomain.inst.getDeviceManager($routeParams[ARPathConfig.deviceManagerId]);
      viewingDeviceManager.$promise.then(function() {
        $scope.viewingDeviceManager = viewingDeviceManager;

        $scope.crumbs.push(
          ARBreadCrumb.crumb(
            $scope.viewingDeviceManager.name, 
            function () { $scope.clearViewingDevice(); })
          );
      });
    }

    // Controls for setting/clearing the viewingDevice and managing the change to the crumbs.
    $scope.viewingDevice = null;
    $scope.setViewingDevice = function (device) {
      $scope.viewingDevice = device;
      $scope.crumbs.push(ARBreadCrumb.crumb(device.name, ''));
    }
    $scope.clearViewingDevice = function () {
      $scope.viewingDevice = null;
      $scope.crumbs.pop();
    }
  }]);

/*
  A widget for the domain specified by the ID given to "item"
  Just a reminder, the ID is actually REDHAWK_DEV, not the UUID which is also
  required to be unique.  We're keeping the "ID" term for consistency 
  with the other UI elements.
 */
arkit.directive('arWidgetDeviceManager', function (ARSelectedDomain, ARPathConfig) {
  return {
    templateUrl   : 'ar-kit/deviceManagers/ar-widget-device-manager.html',
    restrict      : 'E',
    scope : {
      deviceManagerId : "=item",
      selected : "=?"
    },
    link : function (scope, element, attrs, ctrls) {
      scope.selected = scope.selected || false;
      scope.deviceManager = null;
      scope.$watch('deviceManagerId', function (id) {
        if (!!id && !!ARSelectedDomain.inst) {
          var deviceManager = ARSelectedDomain.inst.getDeviceManager(id);
          deviceManager.$promise.then(function () {
            scope.deviceManager = deviceManager;

            // Build an interpolator mapping to build the url.
            var mapping = {};
            mapping[ARPathConfig.deviceManagerId] = scope.deviceManagerId;

            scope.deviceManagerPath = ARPathConfig.interpolate(
              ARPathConfig.deviceManager, mapping);
          });
        }
        else {
          scope.deviceManager = null;
          scope.deviceManagerPath = ARPathConfig.deviceManagers;
        }
      });

      scope.shutdown = function () {
        console.warn("Shutdown feature not implemented in this release.");
      }
    }
  }
});

/* 
 * A Device manager's detail view
 * hideDevices and hide
 */
arkit.directive('arDetailDeviceManager', function (ARSelectedDomain) {
  return {
    templateUrl     : 'ar-kit/deviceManagers/ar-detail-device-manager.html',
    restrict        : 'E',
    scope           : {
      deviceManagerId : "=",
      hideDevices     : "=?",
      hideServices    : "=?",
      deviceCallback  : "&?",
      serviceCallback : "&?"
    },
    link : function (scope) {
      scope.hideDevices = scope.hideDevices || false;
      scope.hideServices = scope.hideServices || false;

      scope.deviceManager = null;
      scope.$watch('deviceManagerId', function (id) {
        if (!!id && !!ARSelectedDomain.inst) {
          var deviceManager = ARSelectedDomain.inst.getDeviceManager(id);
          deviceManager.$promise.then(function () {
            scope.deviceManager = deviceManager;
          });
        }
        else {
          scope.deviceManager = null;
        }
      });
    }
  }
});