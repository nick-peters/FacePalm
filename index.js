var groups = readGroups();
var dropDown = document.getElementById("memberNames");

function listGroupsDropDownFP(){
  for (var i = 0; i < groups.length; i++){
    var opt = groups[i].groupName;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    dropDown.appendChild(el);
  }
}

listGroupsDropDownFP();


