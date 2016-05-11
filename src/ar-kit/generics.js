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
  Lays out a navigation bar at the top of the screen.

  Insert arNavbarItem to populate the collapsable menu.

  The default navbar provides a link to the domains view
  for selecting the domain to use for the menus.

  The selected domain can be retrieved using the ARSelectedDomain
  service.
 */
arkit.directive('arNavbar', 
    function (ARSelectedDomain, ARPathConfig, ARTransclusionHelper, $route) {
      return {
        templateUrl:  'ar-kit/generics/ar-navbar.html',
        restrict:     'E',
        replace:      true,
        transclude:   {
          'menu'  : 'arNavbarMenu',
          'right' : '?arNavbarRight'
        },
        scope:  {
          brandImage          : '@?', // Defaults to the REDHAWK icon
          invert              : '@?' // Invert navbar color scheme, default false
        },
        // Set defaults
        link: function(scope, element) {
          scope.ARSelectedDomain    = ARSelectedDomain;
          // One-way binding w/ default value
          var defaultBrandImage = arkit.distURL + 'images/redhawk_icon_150px.png';
          scope._brandImage         = scope.brandImage || defaultBrandImage;
          scope._invert             = scope.invert ? scope.invert ===  'true' : false;

          // For the link back to the domain page
          scope.domainsPath = '#' + ARPathConfig.domains;

          // Detect if the domain route is in the user's configuration or not.
          scope.allowDomainLink = $route.routes.hasOwnProperty(ARPathConfig.domain);

          // Cleanup the transcluded dom
          ARTransclusionHelper.postTransclude(element, '.menu', 'ar-navbar-menu');
          ARTransclusionHelper.postTransclude(element, '.right', 'ar-navbar-right');
        }
      }
  });

/* 
 * Insert these within the arNavbar directive tags to add menu elements
 * for when a domain is selected.  Use the arDefault attribute to select
 * default routes for the 'applications', 'deviceManagers', or 'allocations'
 * views that are included by default with arKit.  Otherwise use title and 
 * route along with the $routeConfig to handle your additional views.
 */
arkit.directive('arNavbarItem', function (ARIndicatorService, ARPathConfig, $route) { 
  return { 
    restrict : 'E', 
    replace  : true, 
    transclude : true,
    template : 
      '<li ng-class="{active: isViewLocationActive(route)}" ng-click="clearIndications()"> \
        <a ng-attr-href="{{routeValid && route || undefined}}">\
          <ng-transclude><!-- title --></ng-transclude>\
          <span class="badge">{{ getIndications() }}</span>\
        </a> \
      </li>',
    scope : {
      route     : "@?",
      arDefault : "@?"
    },
    link : function (scope) {
      if (!!scope.arDefault) {
        switch (scope.arDefault) {
          case 'applications' :
            scope.title = 'Applications';
            scope.route = '#' + ARPathConfig.applications;
            break;
          case 'deviceManagers' :
            scope.title = 'Device Managers';
            scope.route = '#' + ARPathConfig.deviceManagers;
            break;
          case 'allocations' : 
            scope.title = 'Allocations';
            scope.route = '#' + ARPathConfig.allocations;
            break;
          default:
            console.warn('Unknown arDefault: ' + scope.arDefault);
            break;
        }
      }

      scope.$watch('route', function() {
        scope.routeValid = false;
        for (var route in $route.routes) {
          if ($route.routes.hasOwnProperty(route)) {
            if (route.match('^'+scope.route.replace('#',''))) {
              scope.routeValid = true;
              break;
            }
          }
        }
        if (!scope.routeValid)
          console.warn('arNavbarItem indicates $routeProvider is not configured for route: ' + scope.route);
      });

      scope.getIndications = function () {
        var value = ARIndicatorService.getIndication(scope.route).value;
        if (0 == value)
          return null;
        return value;
      }

      scope.clearIndications = function() {
        ARIndicatorService.setIndication(scope.route, 0);
      }
    }
  } });

/* Lays out a generic repeater of whatever elements are inside.
 * Set the columnWidths attribute to override the default which
 * automatically transitions to a mobile-friendly list of elements
 * when the screen is too narrow.
 * 
 * If designing your own element to go in the gridView, you need to:
 *
 *    require: "?^^arGridview"
 *
 *    // Within link:
 *    link: function(scope, el, attr, ctrl) { if (!!ctrl) ctrl.register(el); }
 */
arkit.directive('arGridview', function () {
  return {
    template      : 
      '<div class="row" ng-transclude>\
      </div>',
    replace       : true,
    restrict      : 'E',
    transclude    : true,
    scope         : {
      columnWidths : '@?'
    },
    controller: function($scope) {
      $scope.columnWidths = $scope.columnWidths || 'col-lg-3 col-md-4 col-sm-5 col-xs-12';
      
      // Inheritable API for contained elements
      this.register = function (child) {
        child.addClass('slide');
        child.addClass($scope.columnWidths); 
      };
    }
  }
});

// Attribute that makes the panel as tall as it is wide and then over-stuffs it with
// the logo provided by arLogo.  This is basically a giant watermark.
arkit.directive('arLogoBackground', function () {
  return {
    restrict :  'A',
    replace  :  false,
    scope    : {
      arLogo : '@?arLogoBackground'
    },
    link     : function(scope, element) {
      scope.arLogo = scope.arLogo || arkit.distURL + 'images/redhawk-background.svg';

      // For some reason this only works a few times in resizing and then quits.
      // FIXME: Use $interval to do this?
      scope.$watch(
        function () { return element[0].offsetWidth; },
        function (width) {
          var widthOversize = width * 1.1;
          var offset = width * 0.05;
          element.css({
            background            : 'url(' + scope.arLogo + ')',
            'background-size'     : widthOversize + 'px ' + widthOversize + 'px',
            'background-repeat'   : 'no-repeat',
            'background-position' : offset + 'px ' + 0 + 'px'
          });
        },
        true);
    }
  }
});

/*
  Easy breadcrumb manager
  crumbs should be a list of elements: { name: 'NameToDisplay', action: '#/link path' }
  Use the ARBreadCrumb provider to quickly make these structures.
  The action can be a function.
 */
arkit.directive('arBreadCrumbs', function ($location) {
  return {
    templateUrl : 'ar-kit/generics/ar-bread-crumbs.html',
    restrict : 'E',
    replace  : true,
    transclude : true,
    scope : {
      crumbs            : "=",  // a list of bread crumbs to translate
      gridButtonState   : "=?", // Variable for observing the toggled state of the grid button
      disableGridButton : "=?"  // Disables the button that would toggle gridButtonState
    },
    link : function(scope) {
      scope.do = function (action) {
        if (typeof action == 'function')
          action();
        else
          $location.path(action.replace('#','').replace('?',''));
      }
    }
  }
});

/* 
 * Creates the "crumb" structure for use with arBreadCrumbs' crumbs list.
 */
arkit.provider('ARBreadCrumb', function () {
  this.$get = function () {
    return {
      crumb : function (name, action) { return {name: name, action: action}; }
    }
  }
});


/* 
 * When doing multi-slot transclusion it might be handy to use special tags
 * as placeholders to keep from accidentally using some non-specific directive.
 * 
 * The postTransclude function will lift the contents (or children) out of the
 * special tag, optionally pass them to a callback, and then attach them to the
 * parent element whose class matches the named class.  Then the original 
 * special tags are removed and the parent's special class is stripped.
 * 
 * See the behavior of ar-widget vs. ar-widget-device.
 */
arkit.provider('ARTransclusionHelper', function() {
  this.$get = function() {
    return {
      postTransclude : function (element, parentSelectorClass, targetSelector, callback) {
        var parent = element.find(parentSelectorClass);
        var targets = parent.children().filter(targetSelector);
        angular.forEach(targets, function(target) {
          var el = angular.element(target);
          var insertees = null;

          // If the element has no tags it will only have contents
          // otherewise it has children.
          if (el.children().length == 0)
            insertees = el.contents();
          else
            insertees = el.children();

          // Forward to the callback if defined
          if (typeof callback == 'function')
            callback(insertees);

          // Move the elements to the parent
          parent.append(insertees);
        });
        // Blow away the original targets
        targets.remove();

        // Remove that special class
        parent.removeClass(parentSelectorClass.replace('.',''));
      }
    }
  }
});

/* 
 * The ar-widget can be thought of as a base implementation of a widget for use in
 * container elements.
 */
arkit.directive('arWidget', function ($location, ARTransclusionHelper) {
  return {
    restrict    : 'E',
    require     : ['?^^arGridview'],
    scope       : {
      titleHref     : '@?',
      titleCallback : '&?',
      panelStatus   : '=?',
    },
    transclude  : {
      'title'     : 'arWidgetTitle',
      'content'   : 'arWidgetContent',
      'shortcuts' : '?arWidgetButtons',
    },
    templateUrl : 'ar-kit/generics/ar-widget.html',
    link : function(scope, element, attrs, ctrls) {
      scope.panelStatus = scope.panelStatus || 'panel-default';

      angular.forEach(ctrls, function(c) { if (!!c) c.register(element); });

      // Use the callback provided or use location to redirect using the href.
      scope.titleCallback = scope.titleCallback || function () {
        $location.path(scope.titleHref);
      }

      // Clean up the dom.
      element.parent().addClass('ar-widget');
      ARTransclusionHelper.postTransclude(element, '.title', 'ar-widget-title');
      ARTransclusionHelper.postTransclude(element, '.shortcuts', 'ar-widget-buttons', function(buttons) {
        buttons.addClass('btn btn-link');
      });
      ARTransclusionHelper.postTransclude(element, '.content', 'ar-widget-content', function(lis) {
        lis.addClass('list-group-item');
      });
    }
  }
});