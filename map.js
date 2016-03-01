define(['facade', './markerclusterer', 'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyBhe3Z0Fw7UTUBxoIWcSqsU5Z6Qux5i078&callback=initMap'], function(facade) {
  
  var addedMarkers = [];
  var infowindow = new google.maps.InfoWindow();
  var map = null;
  var markers = [];
  var markersHash = {};
  var mc = null;

  infowindow.addListener('closeclick', function() {
    facade.publish('map:infowindow:close');
  });

  var initMap = function(useGeolocation, defaultZoomLvl, defaultLocationLat, defaultLocationLng, mobile){

    // Revert to default values if no paramaters are passed
    if(useGeolocation == null) { useGeolocation = false; }
    if(defaultZoomLvl == null) { defaultZoomLvl = 12; }
    if(defaultLocationLat == null || defaultLocationLng == null) {
      defaultLocationLat = 56.0924;
      defaultLocationLng = 10.1238;
    }
    if(mobile == null) { mobile = true; }

    // Instantiate the map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: defaultLocationLat, lng: defaultLocationLng},
      zoom: defaultZoomLvl,
      mapTypeControl: false,
      streetViewControl: false,
      scrollwheel: false
    });

    // Center map to users position according to their geolocation
    if(useGeolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        if(!mobile) {
          offsetMap(position.coords.latitude, position.coords.longitude, 350);
        }else {
          map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }
      });
    }

    mc = new MarkerClusterer(map);

    return map;
  };

  var createMarkers = function(locations) {
    for (var item in locations) {  
      var infowindowContent = ('<h2 class="common-map__marker__title">' + locations[item].Name + '</h2>' +
                               '<p class="common-map__marker__text">' + locations[item].Address + '</p>');

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[item].Latitude, locations[item].Longitude),
        id: locations[item].ID,
        icon: '/Components/Aeldresagen/Project/Design/Dist/images/marker.png',
        info: infowindowContent,
        animation: google.maps.Animation.DROP
      });

      marker.addListener('click', function() {
        infowindow.setContent(this.info);
        infowindow.open(map, this);
        facade.publish('map:marker:selected', this.id);
      });
      
      marker.addListener('mouseover', function() {
        facade.publish('map:marker:mouseover', this.id);
      });

      marker.addListener('mouseout', function() {
        facade.publish('map:marker:mouseout', this.id);
      });

      markersHash[marker.id] = marker;
      markers.push(marker);
    }

    map.addListener('idle', function() {
      updateMarkers();
    });
  };

  var updateMarkers = function() {
    var visibleMarkers = [];

    for(var i = 0; i < markers.length; i++) {
      if(map.getBounds().contains(markers[i].getPosition()) && addedMarkers.indexOf(markers[i]) == -1) {
        visibleMarkers.push(markers[i]);
      }
    }

    addedMarkers.push.apply(addedMarkers, visibleMarkers);
    mc.addMarkers(visibleMarkers, false);

    facade.publish('map:markers:update');
  };

  var offsetMap = function(lat, lng, offsetx, offsety) {
    var latlng = new google.maps.LatLng(lat, lng, false);
    var point1 = map.getProjection().fromLatLngToPoint(
        (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
    );

    var point2 = new google.maps.Point(
        ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
        ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
    );  

    map.panTo(map.getProjection().fromPointToLatLng(new google.maps.Point(
        point1.x - point2.x,
        point1.y + point2.y
    )));
  };

  var clearMarkers = function() {
    facade.publish('map:markers:removed');
    mc.clearMarkers();
    addedMarkers.length = 0;
  };

  var clearAllMarkers = function() {
    facade.publish('map:markers:removed');
    mc.clearMarkers();
    addedMarkers.length = 0;
    markers.length = 0;
    markersHash.length = 0;
  };

  var search = function(searchString) {
    if(searchString == null || searchString == '') { return false; }

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { address: searchString, componentRestrictions: { country: 'DK' } }, function(results, status){

      if(status == google.maps.GeocoderStatus.OK) {
        clearMarkers();

        map.panTo(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
      } else {
        // Handle error
      }

    });
  };

  return {
    init: initMap,
    createMarkers: createMarkers,
    clearAllMarkers: clearAllMarkers,
    markersHash: markersHash,
    addedMarkers: addedMarkers,
    infowindow: infowindow,
    search: search
  }
  
});
