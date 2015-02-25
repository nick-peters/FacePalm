var groups = [
  new Group("FacePalm", [
    new Member("Lamson", "thai", 2),
    new Member("Matt"),
    new Member("Naveed"),
    new Member("Nick")
    ]),
  new Group("BuckSnort", [
    new Member("Ron"),
    new Member("Dane"),
    new Member("Fan"),
    new Member("Daniel")
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

function Member(memberName, cuisine, cost) {
  this.memberName = memberName;
  this.cuisine = cuisine || "";
  this.targetCost = cost || 0;
  this.lat = 0;
  this.lng = 0;

  this.setMemberName = function(name) {
    this.memberName = name;
  }

  this.setCuisine = function(type) {
    this.cuisine = type;
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

function textSearchCallback(data, status) {

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    search.getDetails({placeId: data[0].place_id}, placeDetailsCallback);
  }

  else {
    console.log("Place Your Face Into Your Palm, Error: " + status);
  }

}

function placeDetailsCallback(data, status) {

  if (status == google.maps.places.PlacesServiceStatus.OK) {

  }

  else {
    console.log("Place Your Face Into Your Palm, Error: " + status);
  }

}

function cuisineCalc(){
  var mostVotes = 0;
  var sameArr = [];
  var votes = {}
  for (var i =0; i < selectedGroup.members.length; i++){
    if (votes[selectedGroup.members[i].cuisine]){
        votes[selectedGroup.members[i].cuisine]++;
    } else {
        votes[selectedGroup.members[i].cuisine] = 1;
      }
  }

  for (var j =0; j < selectedGroup.members.length; j++){
    if (votes[selectedGroup.members[j].cuisine] > mostVotes){
        mostVotes = votes[selectedGroup.members[j].cuisine];
    }
  }

  for (key in votes){
    if (mostVotes == votes[key]){
        sameArr.push(key);
    }
  }
    var result = sameArr[Math.floor((Math.random()* sameArr.length))];

  return result;
}

$(function() {

    // mapOptions = {
    //   center: { lat: 45.516250, lng: -122.676610},
    //   zoom: 17
    // };

    // var map = new google.maps.Map(document.getElementById('map-canvas'),
    //     mapOptions);

    // var search = new google.maps.places.PlacesService(map)

    // google.maps.event.addListenerOnce(map, 'idle', function() {

    //   search.textSearch({query: "thai", types: ["restaurant"], location: map.getCenter(), radius: 1000}, textSearchCallback);

    // });

    storeGroups();

    if ($("body").attr("id") == "frontPage") {
          listGroupsDropDownFP();
      $('#groupSelector').on('click', function(){
          var dropDown = document.getElementById("groupNames");
          localStorage.setItem("selectedGroup", dropDown.value);
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
        // var cost = $('costChoice :selected').text();
        // var loc = $('#locChoice :selected').text();
        $('#voted').append($('<li>').text(name).addClass('highlight'));
      })
    }
    else if ($("body").attr("id") == "resultPage") {
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


      }

    }


// $( "#submit" ).prop( "disabled", true );

// $('#submit').attr('disabled', true);


// $('input[type=text],input[type=password]').keyup(function() {

//     if ($('#nameChoice').val() !=''&&
//         $('#cuisineChoice').val() != '' &&
//         $('#target3').val() != ''&&
//         $('#target4').val() != '') {

//         $('#submit').removeAttr('disabled');
//     } else {
//         $('#submit').attr('disabled', 'disabled');
//     }
// });


});
