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
 
// Domains view controller
arkit.controller('ARDomainsController', 
       ['$scope', '$routeParams', 'REDHAWK', 'ARSelectedDomain', 'ARPathConfig', 'ARBreadCrumb',
  function($scope, $routeParams, REDHAWK, ARSelectedDomain, ARPathConfig, ARBreadCrumb) {
    $scope.crumbs = [ARBreadCrumb.crumb('Domains', '#' + ARPathConfig.domains)];
    $scope.viewingDomain = null;
    $scope.collapseGrid = false;

    // If the routeparams for domainId was passed in, use it.
    if (!!$routeParams[ARPathConfig.domainId]) {
      $scope.collapseGrid = true;
      var domain = REDHAWK.getDomain($routeParams[ARPathConfig.domainId]);
      domain.$promise.then(function () {
        $scope.viewingDomain = domain;
        $scope.crumbs.push(ARBreadCrumb.crumb($scope.viewingDomain.name, ''));
      });
    }

    // Expose the ARSelectedDomain to the scope
    $scope.ARSelectedDomain = ARSelectedDomain;
    $scope.selected = false;
    $scope.$watchGroup(['ARSelectedDomain.inst', 'domain'], function(insts) {
      $scope.selected = insts[0] == insts[1];
    });
  }]);

/*
  A widget for the domain specified by the ID given to "item"
  Just a reminder, the ID is actually REDHAWK_DEV, not the UUID which is also
  required to be unique.  We're keeping the "ID" term for consistency 
  with the other UI elements.
 */
arkit.directive('arWidgetDomain', function (REDHAWK, ARSelectedDomain, ARPathConfig) {
  return {
    templateUrl   : 'ar-kit/domains/ar-widget-domain.html',
    restrict      : 'E',
    scope : {
      domainId  : "=item",
    },
    link : function (scope, element, attrs, ctrls) {
      scope.domain = null;
      scope.domainPath = '#' + ARPathConfig.domains;
      scope.$watch('domainId', function (id) {
        if (!!id) {
          var domain = REDHAWK.getDomain(id);
          domain.$promise.then(function() { 
            scope.domain = domain;

            var param = {};
            param[ARPathConfig.domainId] = id; 
            scope.domainPath = ARPathConfig.interpolate(ARPathConfig.domain, param);
          });
        }
      });

      // Watch the instance to determine if we're selected.
      scope._ARSelectedDomain = ARSelectedDomain;
      scope.$watch('_ARSelectedDomain.inst', function(inst) {
        if (!!inst) {
          scope.selected = scope.domainId == inst.name;
        }
        else {
          scope.selected = false;
        }
      });

      // Forward the function to the UI.
      scope.setAsSelectedDomain = function() { 
        ARSelectedDomain.setSelectedDomain(scope.domainId); 
      }
    }
  }
});

// A domain's detail view
arkit.directive('arDetailDomain', function (REDHAWK, ARSelectedDomain) {
  return {
    templateUrl     : 'ar-kit/domains/ar-detail-domain.html',
    restrict        : 'E',
    scope           : {
      domainId  : "="
    },
    link            : function(scope) {
      scope.$watch('domainId', function (id) {
        if (!!id) {
          var domain = REDHAWK.getDomain(id);
          domain.$promise.then(function() { scope.domain = domain; });
        }
        else {
          scope.domain = null;
        }
      });

      // Watch the instance to determine if we're selected.
      scope._ARSelectedDomain = ARSelectedDomain;
      scope.$watch('_ARSelectedDomain.inst', function(inst) {
        if (!!inst && !!scope.domain) {
          scope.selected = scope.domain.name == inst.name;
        }
        else {
          scope.selected = false;
        }
      });

      // Forward the function to the UI.
      scope.setAsSelectedDomain = function() { 
        ARSelectedDomain.setSelectedDomain(scope.domain.name); 
      }
    }
  }
});