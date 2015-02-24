$(function(){

  var face = new Group('FacePalm');
  var nick = new Member('Nick');
  var naveed = new Member('Naveed');
  var matt = new Member('Matt');
  var lamson = new Member('Lamson');
  var bucksnort = new Member('Adron');
  face.addMembers(nick);
  face.addMembers(naveed);
  face.addMembers(matt);
  face.addMembers(lamson);
  console.log(face);


//Appends name to dropdown menu for the selected group
$('#nameChoice').append($('<option>').text(bucksnort.memberName).attr('value',bucksnort.memberName.toLowerCase()));



  function Group(groupName, members) {
    this.groupName = groupName;
    this.members = [];

    this.addMembers = function(member) {
      this.members.push(member);
    }
  }

  function Member(memberName, cuisine) {
    this.memberName = memberName;
    this.cuisine = cuisine;

    this.setMemberName = function(name) {
      this.memberName = name;
    }

    this.setCuisine = function(type) {
      this.cuisine = type;
    }


  }

























});
