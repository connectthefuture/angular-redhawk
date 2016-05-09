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

/*
 * Widget for a Device
 * The deviceId and deviceManagerId are both required (item and parentId, respectively)
 * The callback is for a function to use for when clicking the device name in the panel
 * title in lieu of falling back to the paths defined in ARPathConfig (i.e., utilizing
 * the $routeProvider configuration the user specified).
 */
arkit.directive('arWidgetDevice', function($location, ARSelectedDomain, ARPathConfig) {
  return {
    templateUrl  : 'ar-kit/devices/ar-widget-device.html',
    restrict     : 'E',
    scope : {
      deviceId        : "=item",
      deviceManagerId : "=parentId",
      callback        : "&?"
    },
    link : function (scope, element, attrs, ctrls) {
      
      scope.$watchGroup(['deviceId', 'deviceManagerId'], function (old, ids) {
        var deviceId = ids[0];
        var deviceManagerId = ids[1];
        if (!!deviceId && !!deviceManagerId) {
          var device = ARSelectedDomain.inst.getDevice(deviceId, deviceManagerId);
          device.$promise.then(function() { scope.device = device; });
        }
        else {
          scope.device = null;
        }
      });

      scope.devicesPath = ARPathConfig.interpolate(
        ARPathConfig.device, 
        [scope.deviceManagerId, '']);

      scope.$watch('device', function(device) {
        scope.isFEI = false;
        scope.feiKind = '';
        if (!!device && device.hasOwnProperty('properties')) {
          var prop = null;
          for (var i=0, len=device.properties.length; i < len; i++) {
            prop = device.properties[i];
            if (prop.name == 'device_kind') {
              if (prop.value.match(/^FRONTEND/)) {
                scope.feiKind = prop.value;
                scope.isFEI = true;
                break;
              }
            }
          }
        }
      });

      // TODO: Implement these on the back-end, map through
      // the middleware and attach here.
      scope.start = function () {
        console.warn('Feature not supported');
      }
      scope.stop = scope.start;
    }
  }
});

arkit.directive('arDetailDevice', function(ARSelectedDomain, ARPathConfig) {
  return {
    templateUrl   : 'ar-kit/devices/ar-detail-device.html',
    restrict      : 'E',
    scope : {
      deviceId        : '=',
      deviceManagerId : '=',
    },
    link : function (scope) {
      scope.$watchGroup(['deviceId', 'deviceManagerId'], function (old, ids) {
        var deviceId = ids[0];
        var deviceManagerId = ids[1];

        if (!!deviceId && !!deviceManagerId) {
          var device = ARSelectedDomain.inst.getDevice(deviceId, deviceManagerId);
          device.$promise.then(function() { scope.device = device; });
        }
        else {
          scope.device = null;
        }
      });
    }
  }
});