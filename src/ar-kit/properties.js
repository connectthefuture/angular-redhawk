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
  Widget for properties and an individual property
 */
arkit.directive('arWidgetProperties', function () {
  return {
    templateUrl     : 'ar-kit/properties/ar-widget-properties.html',
    restrict        : 'E',
    scope : {
      rhProperties  : "=item",
      // Special to this widget
      // Callback for when "submit" is pressed
      formCallback  : "&?",
    },
    link : function (scope) {
      scope.allowEdits = !(scope.formCallback === undefined);

      scope.submit = function () {
        if (scope.allowEdits) {
          var props = [];
          angular.forEach(scope.rhProperties, function(prop) {
            if (prop.canEdit)
              props.push(prop);
          });

          // Pass to the callback.
          scope.formCallback()(props);
        }

      }
    }
  }
});

/* 
  Helper directive that basically acts like an ng-switch that doesn't violate 
  HTML DOM rules for tables.
 */
arkit.directive('arWidgetPropertyTbody', function () {
  return {
    templateUrl  : 'ar-kit/properties/ar-widget-property-tbody.html',
    restrict     : 'A',
    scope : { 
      rhProperty : '=item',
      allowEdit  : '=?'
    }
  }
});

/*
  Widget for an individual simple property table data cells (2)
 */
arkit.directive('arWidgetPropertySimpleTr', function () {
  return {
    templateUrl     : 'ar-kit/properties/ar-widget-property-simple-tr.html',
    restrict        : 'E',
    replace         : true,
    scope           : {
      rhProperty : '=item',
      allowEdit  : '=?'
    },
    link : function(scope) {
      scope.booleanSelectOptions = [{ name: 'True', value: true }, { name: 'False', value: false }];
    }
  }
});
/*
  Widget for an individual simple sequence property table data cells (2)
 */
arkit.directive('arWidgetPropertySimpleSeqTr', function () {
  return {
    templateUrl     : 'ar-kit/properties/ar-widget-property-simple-seq-tr.html',
    restrict        : 'E',
    replace         : true,
    scope           : {
      rhProperty : '=item',
      allowEdit  : '=?'
    },
    link : function(scope) { 
      scope.isCollapsed = false; 
    }
  }
});
/*
  Widget for an individual struct property table data cells (2)
 */
arkit.directive('arWidgetPropertyStructTr', function () {
  return {
    templateUrl     : 'ar-kit/properties/ar-widget-property-struct-tr.html',
    restrict        : 'E',
    replace         : true,
    scope           : {
      rhProperty : '=item',
      allowEdit  : '=?'
    },
    link : function(scope) { 
      scope.isCollapsed = false; 
    }
  }
});
/*
  Widget for an individual struct sequence property table data cells (2)
 */
arkit.directive('arWidgetPropertyStructSeqTr', function () {
  return {
    templateUrl     : 'ar-kit/properties/ar-widget-property-struct-seq-tr.html',
    restrict        : 'E',
    replace         : true,
    scope           : {
      rhProperty : '=item',
      allowEdit  : '=?'
    },
    link : function(scope) { 
      scope.isCollapsed = false; 
    }
  }
});

/*
  Widget for an individual property's table data elements (i.e., a row)
  This displays the property name.  You should be looking to use the other
  arWidgetProperty* directives instead if you want a whole row.
 */
arkit.directive('arWidgetPropertyNameTd', function () {
  return {
    templateUrl     : 'ar-kit/properties/ar-widget-property-name-td.html',
    restrict        : 'A',
    replace         : true,
    scope           : {
      rhProperty : '=item',
    }
  }
});