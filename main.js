var groups;

readGroups();

if(!groups["FacePalm"]) {
    groups["FacePalm"] = new Group("FacePalm", [
    new Member("Lamson"),
    new Member("Matt"),
    new Member("Naveed"),
    new Member("Nick")
    ]);
}
if(!groups["BuckSnort"]) {

  groups["BuckSnort"] = new Group("BuckSnort", [
    new Member("Ron", 'chinese', 2, 45.522855, -122.673067, true),
    new Member("Dane", 'chinese', 1, 45.522658, -122.682575, true),
    new Member("Fan", 'thai', 1, 45.517630, -122.682954, true),
    new Member("Daniel", 'mexican', 3, 45.516638, -122.673770, true)
    ]);

}

var selectedGroup = getSelectedGroup();

function Group(groupName, members) {
  this.groupName = groupName;
  this.members = members || [];
  this.addMember = function(member) {
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

function Member(memberName, cuisine, targetCost, lat, lng, voted) {
  this.memberName = memberName;
  this.cuisine = cuisine || "";
  this.targetCost = targetCost || 0;
  this.lat = lat || 0;
  this.lng = lng || 0;
  this.voted = voted || false;

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
  groups = JSON.parse(localStorage.getItem("groups")) || {};
  for (var i in groups) {
    for (var j=0; j < groups[i].members.length; j++) {
      groups[i].members[j] = new Member(groups[i].members[j].memberName,
      groups[i].members[j].cuisine, groups[i].members[j].targetCost,
      groups[i].members[j].lat, groups[i].members[j].lng,
      groups[i].members[j].voted);
    }
      groups[i] = new Group(groups[i].groupName, groups[i].members);
  }
}

function getSelectedGroup() {
   return groups[localStorage.getItem("selectedGroup")];
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

$(function() {

    if ($("body").attr("id") == "frontPage") {
          listGroupsDropDownFP();
      $('#groupSelector').on('click', function(){
          var dropDown = document.getElementById("groupNames");
          localStorage.setItem("selectedGroup", dropDown.value);
          window.location = "form.html";
      })

      $('#createGroupButton').on('click', function(){
        $('#createGroupButton').hide();
        $('#newGroup').append($('<label>').text("Enter New Group Name: "))
          .append($('<input>').attr('type', 'text').attr('id', 'enterNewGroup'))
          .append($('<br>'))
          .append($('<label>').text("Enter New Member Name: "))
          .append($('<input>').attr('type', 'text').attr('class', 'enterNewMembers'))
          .append($('<br>'))
          .append($('<button>').attr('class', 'btn btn-success').text("Add Member").attr('id', 'addMemberButton'))
          .append($('<button>').attr('class', 'btn btn-primary').text("Submit").attr('id', 'submitNewGroup'));

          $('#addMemberButton').on('click', function() {
            $('#addMemberButton')
              .before($('<label>').text("Enter New Member Name: "))
              .before($('<input>').attr('type', 'text').attr('class', 'enterNewMembers'))
              .before($('<br>'))
          });

          $('#submitNewGroup').on('click', function() {
            var newGroup = new Group($('#enterNewGroup').val());
            $('.enterNewMembers').each(function() {
              newGroup.addMember(new Member($(this).val()));
            });
            groups[newGroup.groupName] = newGroup;
            storeGroups();
            localStorage.setItem("selectedGroup", newGroup.groupName);
            window.location = "form.html";
          });
      });


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
            location: map.getCenter(), radius: 2000, minPriceLevel: calcSearch.targetCost,
            maxPriceLevel: calcSearch.targetCost}, function(data, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                localStorage.setItem("resultsLocation", data[0].place_id)
                // search.getDetails( {placeId: data[0].place_id}, placeDetailsCallback );
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
            $nameDrop.text() != '--Please Select--' &&
            $cuisineDrop.text() != '--Please Select--' &&
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
    }



    else if ($("body").attr("id") == "resultPage") {
      // var loc = localStorage.resultsLocation;
      // console.log(loc);
      // console.log('hello');
    }

    function listGroupsDropDownFP(){
      var dropDown = document.getElementById("groupNames");
      for (var i in groups){
        var opt = groups[i].groupName;
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dropDown.appendChild(el);
      }
    }

});


