$(function(){

  var mapOptions = {
            center: { lat: 45.535849, lng: -122.620622 },
            zoom: 12
          };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  function PrintName (name) {
    $('#name').text(name);
  }

  function marker(lat, lng, name, desc){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: name,
        // icon:
      });

    var infowindow = new google.maps.InfoWindow({
        content: desc
    });

    marker.setMap(map);
    infowindow.open(map);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
  }

  function details(){
    var infowindow = new google.maps.InfoWindow({
        content: 'Hello'
    });
    infowindow.open(map);
  }


  // alert('todo');
  PrintName('MEXI-THAI-YAKI');
  $('#address').text('10000 Burnside St, ' + 'Zip Code');
  alert('mark');
  marker(45.522927, -122.673008, 'VooDoo', 'FOODMONGER');



});
