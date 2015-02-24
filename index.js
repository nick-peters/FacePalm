var groups = [
  {
    groupName:"facepalm",
    members:[
      {memberName:"nick"},
      {memberName:"naveed"},
      {memberName:"lamson"},
      {memberName:"matt"}
    ]
  },


  {
    groupName:"bucksnort",
    members:[
      {memberName:"Ron"},
      {memberName:"Fan"},
      {memberName:"daniel"},
      {memberName:"dane"}
    ]
  }
]



var dropDown = document.getElementById("memberNames");
  for (var i = 0; i < groups.length; i++){
    console.log(groups[i].groupName);
    var opt = groups[i].groupName;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    dropDown.appendChild(el);
  }


