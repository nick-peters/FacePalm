$(function(){

  var mapOptions = {
            center: { lat: 0, lng: 0 },
            zoom: 15
          };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  google.maps.event.addListenerOnce(map, 'idle', function() {

    var search = new google.maps.places.PlacesService(map);

    var loc = {
      placeId:localStorage.getItem('resultsLocation')
    };

    search.getDetails(loc, function(place) {
      $('#name').text(place.name);
      $('#address').text(place.formatted_address);
      $('#phone').text(place.international_phone_number);
      $('#rating').text(place.rating);
      map.setCenter(place.geometry.location);
      Marker(place.geometry.location, place.name, openingHours(place) );
    });
    google.maps.event.trigger(map, 'resize');
  });

  function Marker (loc, name, desc) {
    var marker = new google.maps.Marker({
        position: loc,
        title: name
        // icon:
    });
    var infowindow = new google.maps.InfoWindow({
        content: desc
    });

    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
  }

  function openingHours(place) {
    var text = "";
    this.place = place;
    for( i = 0; i < place.opening_hours.weekday_text.length; i++ ) {
      text += place.opening_hours.weekday_text[i] + "\n" + "</br>";
    }
    return text;
  }

});
