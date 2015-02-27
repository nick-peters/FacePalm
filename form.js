$(function() {

  //Google autocomplete code for the location box
  var newLat;
  var newLng;
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById("userLocation"));
  google.maps.event.addListener(autocomplete, 'place_changed', function(e) {
      newLat = autocomplete.getPlace().geometry.location.lat();
      newLng = autocomplete.getPlace().geometry.location.lng();
    });

  selectedGroup = getSelectedGroup();

  enableSubmitCheck();

  for (var i = 0; i < selectedGroup.members.length; i++ ) {
    $('#nameChoice').append( $('<option>')
      .text(selectedGroup.members[i].memberName)
      .attr('value',selectedGroup.members[i].memberName.toLowerCase()) );
    if(selectedGroup.members[i].voted) {
      $('#voted').append($('<li>').text(selectedGroup.members[i].memberName).addClass('highlight'));
    }
  }

  $('#placeVote').on( 'click', function(e) {
    e.preventDefault();
    var name = $('#nameChoice :selected').text();
    var cuisine = $('#cuisineChoice :selected').text();
    var cost = parseInt($('[type=radio]:checked').attr('data-cost'));
    var currentMember = selectedGroup.findMember(name);
    if(!currentMember.voted) {
      $('#voted').append($('<li>').text(name).addClass('highlight'));
    }
    currentMember.cuisine = cuisine;
    currentMember.lat = newLat;
    currentMember.lng = newLng;
    currentMember.targetCost = cost;
    currentMember.voted = true;
    storeGroups();
    enableSubmitCheck();
  })

  $('#submit').on( 'click', function(e) {
    e.preventDefault();

    var calcSearch = {};

    calcSearch.cuisine = cuisineCalc();
    calcSearch.targetCost = costCalc();
    calcSearch.loc = locationCalc();

    mapOptions = {
      center: calcSearch.loc,
      zoom: 17
    };

    var map = new google.maps.Map(document.getElementById('map-search'),
        mapOptions);

    var search = new google.maps.places.PlacesService(map);

    google.maps.event.addListenerOnce(map, 'idle', function() {

      search.nearbySearch({keyword: calcSearch.cuisine, types: ["restaurant", "food"],
        location: map.getCenter(), radius: 6000, minPriceLevel: calcSearch.targetCost,
        maxPriceLevel: calcSearch.targetCost}, function(data, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            localStorage.setItem("resultsLocation", data[0].place_id)
            window.location = "lunchspot.html";
          }
          else {
            console.log("Place Your Face Into Your Palm, Error: " + status);
          }
      });
    });
  });

  var $nameDrop = $("#nameChoice");
  var $cuisineDrop = $("#cuisineChoice");
  var $userLocation = $("#userLocation");
  var $priceRadio = $("[type=radio]");
  var $voteButton = $("#placeVote");

  $nameDrop.on('change', validateVoteButton);
  $cuisineDrop.on('change', validateVoteButton);
  $userLocation.on('change', validateVoteButton);
  $priceRadio.on('change', validateVoteButton);

  function validateVoteButton() {
    if(
        $nameDrop.val() &&
        $cuisineDrop.val() &&
        $userLocation.val() != "" &&
        $('[type=radio]:checked').length > 0)
    {
      $voteButton.removeAttr('disabled');
    }
    else {
      $voteButton.attr('disabled', 'disabled');
    }
  }

  function enableSubmitCheck() {
    for (var i = 0; i < selectedGroup.members.length; i++) {
      if (!selectedGroup.members[i].voted) {
        return
      }
    }
    $('#submit').removeAttr('disabled');
  }

  function cuisineCalc(){
    var mostVotes = 0;
    var sameArr = [];
    var votes = {}
          //if cuisine exists in the object votes, increment its value
    for (var i =0; i < selectedGroup.members.length; i++){
      if (votes[selectedGroup.members[i].cuisine]){
          votes[selectedGroup.members[i].cuisine]++;
          //if cuisine is not preset add and set its value to 1
      } else {
          votes[selectedGroup.members[i].cuisine] = 1;
        }
    }
        //get most votes for the cuisine
    for (var j =0; j < selectedGroup.members.length; j++){
      if (votes[selectedGroup.members[j].cuisine] > mostVotes){
          mostVotes = votes[selectedGroup.members[j].cuisine];
      }
    }
        //check key in votes object, if there are any key with simlar votes
        //push it to array
    for (key in votes){
      if (mostVotes == votes[key]){
          sameArr.push(key);
      }
    }
        //get the random number using the array length and
        //use it as an index of arr to diplay the cuisine
    var result = sameArr[Math.floor((Math.random()* sameArr.length))];
    return result;
  }

  function costCalc(){
    var sum = 0;
    for (var i = 0; i < selectedGroup.members.length; i ++){
      sum += selectedGroup.members[i].targetCost;
    }
    var avg = Math.round(sum/selectedGroup.members.length);
    return avg;
  }

  function locationCalc() {
    var avgLat = 0,
        avgLng = 0;

    for(var i = 0; i < selectedGroup.members.length; i++) {

      avgLat += selectedGroup.members[i].lat;
      avgLng += selectedGroup.members[i].lng;

    }

    avgLat /= selectedGroup.members.length;
    avgLng /= selectedGroup.members.length;

    return new google.maps.LatLng(avgLat, avgLng);

  }

});
