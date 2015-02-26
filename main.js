var groups = [
  new Group("FacePalm", [
    new Member("Lamson", 'thai', 2, 45.522855, -122.673067),
    new Member("Matt", 'thai', 1, 45.522658, -122.682575),
    new Member("Naveed", 'chinese', 1, 45.517630, -122.682954),
    new Member("Nick", 'mexican', 3, 45.516638, -122.673770)
    ]),

  new Group("BuckSnort", [
    new Member("Ron", 'chinese', 2, 45.522855, -122.673067),
    new Member("Dane", 'chinese', 1, 45.522658, -122.682575),
    new Member("Fan", 'thai', 1, 45.517630, -122.682954),
    new Member("Daniel", 'mexican', 3, 45.516638, -122.673770)
    ])
  ];

var selectedGroup = getSelectedGroup();

function Group(groupName, members) {
  this.groupName = groupName;
  this.members = members || [];
  this.addMembers = function(member) {
    this.members.push(member);
  }

  this.findMember = function(findThisName) {
    for(var i=0; i < this.members.length; i++) {
      if (this.members[i].memberName == findThisName) {
        return this.members[i];
      }

    }
    console.log("Error: member not found in this group.");
  }
}

function Member(memberName, cuisine, targetCost, lat, lng) {
  this.memberName = memberName;
  this.cuisine = cuisine || "";
  this.targetCost = targetCost || 0;
  this.lat = lat || 0;
  this.lng = lng || 0;

  this.setMemberName = function(name) {
    this.memberName = name;
  }
  this.setCuisine = function(type) {
    this.cuisine = type;
  }
  this.settargetCost = function(targetCost){
    this.targetCost = targetCost;
  }
}

function storeGroups() {
  localStorage.setItem("groups", JSON.stringify(groups));
}

function readGroups() {
  groups = JSON.parse(localStorage.getItem("groups"));
  for (var i=0; i < groups.length; i++) {
    for (var j=0; j < groups[i].members.length; j++) {
      groups[i].members[j] = new Member(groups[i].members[j].memberName,
      groups[i].members[j].cuisine);
    }
      groups[i] = new Group(groups[i].groupName, groups[i].members);
  }
}

function getSelectedGroup() {
 var selectedGroup = localStorage.getItem("selectedGroup");
  for (var i = 0; i < groups.length; i++) {
    if (groups[i].groupName == selectedGroup) {
     return groups[i];
    }
  }
}


function placeDetailsCallback(data, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log(data)
  }
  else {
    console.log("Place Your Face Into Your Palm, Error: " + status);
  }
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

$(function() {

    storeGroups();

    if ($("body").attr("id") == "frontPage") {
          listGroupsDropDownFP();
      $('#groupSelector').on('click', function(){
          var dropDown = document.getElementById("groupNames");
          localStorage.setItem("selectedGroup", dropDown.value);
          window.location = "form.html"
      })
    }
    else if ($("body").attr("id") == "formPage") {

      //Google autocomplete code for the location box
      var newLat;
      var newLng;
      var autocomplete = new google.maps.places.Autocomplete(document.getElementById("userLocation"));
      google.maps.event.addListener(autocomplete, 'place_changed', function(e) {
          newLat = autocomplete.getPlace().geometry.location.lat();
          newLng = autocomplete.getPlace().geometry.location.lng();
        });

      selectedGroup = getSelectedGroup();
      for ( i = 0; i < selectedGroup.members.length; i++ ) {
        $('#nameChoice').append( $('<option>')
          .text(selectedGroup.members[i].memberName)
          .attr('value',selectedGroup.members[i].memberName.toLowerCase()) );
      }

      $('#placeVote').on( 'click', function(e) {
        e.preventDefault();
        var name = $('#nameChoice :selected').text();
        var cuisine = $('#cuisineChoice :selected').text();
        var cost = $('[type=radio]:checked').attr('data-cost');
        $('#voted').append($('<li>').text(name).addClass('highlight'));
        var currentMember = selectedGroup.findMember(name);
        currentMember.cuisine = cuisine;
        currentMember.lat = newLat;
        currentMember.lng = newLng;
        currentMember.targetCost = cost;
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
            location: map.getCenter(), radius: 2000, minPriceLevel: calcSearch.targetCost,
            maxPriceLevel: calcSearch.targetCost}, function(data, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                localStorage.setItem("resultsLocation", data[0].place_id)
                // search.getDetails( {placeId: data[0].place_id}, placeDetailsCallback );
                window.location = "lunchspot.html"
              }
              else {
                console.log("Place Your Face Into Your Palm, Error: " + status);
              }
          });
        });
      });

    }
    else if ($("body").attr("id") == "resultPage") {
      // var loc = localStorage.resultsLocation;
      // console.log(loc);
      // console.log('hello');
    }

    function listGroupsDropDownFP(){
      var dropDown = document.getElementById("groupNames");
      for (var i = 0; i < groups.length; i++){
        var opt = groups[i].groupName;
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dropDown.appendChild(el);
      }
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


// vote button should be disabled until form filled out
// submit button disabled until everyone has placed vote








    // $('#placeVote').attr('disabled', true);

    // $(form:input).change(function() {

    //     if ($('#nameChoice').val() != '' &&
    //         $('#cuisineChoice').val() != '' &&
    //         $('#userLocation').val() != '' &&
    //         $('#costChoice').val() != '') {

    //         $('#placeVote').removeAttr('disabled');
    //     }
    //     else {
    //         $('#placeVote').attr('disabled', false);
    //     }
    // });


});

    // var nameDrop = $("#nameChoice");
    // var cuisineDrop = $("#cuisineChoice");
    var $userLocation = $("#userLocation");
    // var priceRadio = $("#costChoice");
    var $voteButton = $("#placeVote");


    // $nameDrop.on('select', validateVoteButton);
    // $cuisineDrop.on('select', validateVoteButton);
    $userLocation.on('blur', validateVoteButton);
    // $radioButton.on('checked', validateVoteButton);

    function validateVoteButton() {
      alert('test');
      if(
          // nameDrop.selectIndex() != 0 &&
          // cuisineDrop.selectIndex() != 0 &&
          $userLocation.val() != ""
          // radioButton.selectIndex() > -1 )
      ){
          $voteButton.enabled = true;
      } else {
          $voteButton.enabled = false;
      }
    };
