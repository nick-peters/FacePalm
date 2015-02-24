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
      ]

    storeGroups();

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

});