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

arkit.directive('arViewPorts', function() {
  return {
    restrict : 'E',
    templateUrl : 'ar-kit/ports/ar-view-ports.html',
    scope : { ports : '=' }
  }
});

/* 
 * Maintains a list of ports that can be either individually selected 
 * or multiple-selected.  Use allowMultiple=true to select multiple items.
 * 'selected' must be either an object ({}) or an array ([]).  The latter 
 * will allow selection of multiple elements.
 */
arkit.directive('arListPorts', function () {
  return { 
    restrict : 'E',
    replace  : true,
    scope : {
      ports    : '=',
      selected : '='
    },
    template   : 
      '<div class="list-group">\
        <a class="list-group-item" \
            ng-class="{\'active\' : port in selected}"\
            ng-click="toggle(port)" \
            ng-repeat="port in ports">\
          <ar-span-port port="port"></ar-span-port>\
        </a>\
      </div>',
    link : function (scope) {
      var allowMultiple = Array.isArray(selected);

      if (allowMultiple) {
        scope.toggle = function (port) {
          var idx = -1;
          for (var i = 0, len = scope.selected.length; i < len; i++) {
            if (port.name == scope.selected[i].name) {
              idx = i;
              break;
            }
          }

          if (-1 == idx) {
            if (false == allowMultiple)
              scope.selected.clear();
            scope.selected.push(port);
          }
          else {
            scope.selected.splice(idx, 1);
          }
        }
      }
      else {
        scope.toggle = function (port) {
          if (port.name == scope.selected.name)
            scope.selected = {};
          else
            scope.selected = port;
        }
      }
    }
  }
});

arkit.directive('arSpanPort', function () {
  return {
    restrict : 'E',
    scope : {
      'port' : '=',
    },
    templateUrl : 'ar-kit/ports/ar-span-port.html',
  }
});