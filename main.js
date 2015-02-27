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
