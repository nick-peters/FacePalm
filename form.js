$(function(){

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
