$(function(){

  var mapOptions = {
            center: { lat: 45.535849, lng: -122.620622 },
            zoom: 12
          };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  function PrintName (name) {
    $('#name').text(name);
  }

  function PrintLoc (address) {
    $('#address').text(address);
  }

  function Marker (lat, lng, name, desc) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
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

  PrintName('MEXI-THAI-YAKI');
  PrintLoc('12345 Burnside Bridge, PDX')
  Marker(45.522927, -122.673008, 'VooDoo', 'FOODMONGER yo');

});
