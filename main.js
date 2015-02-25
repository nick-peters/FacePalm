var groups = [
  new Group("FacePalm", [
    new Member("Lamson"),
    new Member("Matt"),
    new Member("Naveed"),
    new Member("Nick")
    ]),

  new Group("BuckSnort", [
    new Member("Ron", 'thai', 2, 45.522855, -122.673067),
    new Member("Dane", 'thai', 1, 45.522658, -122.682575),
    new Member("Fan", 'chinese', 1, 45.517630, -122.682954),
    new Member("Daniel", 'mexican', 3, 45.516638, -122.673770)
    ])
  ];

var selectedGroup = getSelectedGroup();
var calcSearch = {};

function Group(groupName, members) {
  this.groupName = groupName;
  this.members = members || [];
  this.addMembers = function(member) {
    this.members.push(member);
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
      })
    }
    else if ($("body").attr("id") == "formPage") {
      selectedGroup = getSelectedGroup();
      for (i=0; i<selectedGroup.members.length; i++) {
        $('#nameChoice').append($('<option>').text(selectedGroup.members[i].memberName)
          .attr('value',selectedGroup.members[i].memberName.toLowerCase()));
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

        calcSearch.cuisine = cuisineCalc();
        calcSearch.targetCost = costCalc();
        calcSearch.loc = locationCalc();

        console.log(calcSearch);

        mapOptions = {
          center: calcSearch.loc,
          zoom: 17
        };

        var map = new google.maps.Map(document.getElementById('map-search'),
            mapOptions);

        var search = new google.maps.places.PlacesService(map);

        google.maps.event.addListenerOnce(map, 'idle', function() {

          search.textSearch({query: calcSearch.cuisine, types: ["restaurant"],
           location: map.getCenter(), radius: 2000}, function(data, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                localStorage.setItem("resultsLocation", data[0].place_id)
                // search.getDetails( {placeId: data[0].place_id}, placeDetailsCallback );
              }
              else {
                console.log("Place Your Face Into Your Palm, Error: " + status);
              }
          });
        });
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
