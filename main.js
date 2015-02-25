var groups = [
  new Group("FacePalm", [
    new Member("Lamson"),
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
}

function Member(memberName, cuisine) {
  this.memberName = memberName;
  this.cuisine = cuisine || "";

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
      selectedGroup = getSelectedGroup();
      for (i=0; i<selectedGroup.members.length; i++) {
        $('#nameChoice').append($('<option>').text(selectedGroup.members[i].memberName)
          .attr('value',selectedGroup.members[i].memberName.toLowerCase()));
      }
      $('#placeVote').on('click', function() {
        var testname = $('#nameChoice :selected').text();
        var othertestname = $('#cuisineChoice :selected').text();
        console.log(testname)
        console.log(othertestname)

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
});
