$(function(){

  var mapOptions = {
            center: { lat: 45.535849, lng: -122.620622 },
            zoom: 12
          };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  function PrintName (name) {
    $('#name').text(name);
  }

  function marker(lat, lng, name){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: name,
        // icon:
      });
    marker.setMap(map);
  }

  alert('todo');
  PrintName('MEXI-THAI-YAKI');

});
