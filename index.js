$(function() {
  listGroupsDropDownFP();

  $('#groupSelector').on('click', function(){
      var dropDown = document.getElementById("groupNames");
      localStorage.setItem("selectedGroup", dropDown.value);
      window.location = "form.html";
  })

  $('#createGroupButton').on('click', function(){
    $('#createGroupButton').hide();
    $('#newGroup')
      .append($('<div>').attr('class', 'form-group')
        .append($('<label>').text("Enter New Group Name:").attr('class','col-sm-5 control-label'))
        .append($('<div>').attr('class', 'col-sm-2')
          .append($('<input>').attr('type', 'text').attr('id', 'enterNewGroup').attr('class', 'form-control'))))
      .append($('<div>').attr('class', 'form-group')
        .append($('<label>').text("Enter New Member Name:").attr('class','col-sm-5 control-label'))
        .append($('<div>').attr('class', 'col-sm-2')
          .append($('<input>').attr('type', 'text').attr('class', 'enterNewMembers form-control'))))
      .append($('<div>').attr('class', 'form-group').attr('id', 'buttonGroup')
        .append($('<div>').attr('class', 'col-sm-offset-2 col-sm-8')
          .append($('<button>').attr('class', 'btn btn-success').text("Add Member").attr('id', 'addMemberButton'))
          .append($('<button>').attr('class', 'btn btn-primary col-sm-offset-1').text("Submit").attr('id', 'submitNewGroup').attr('disabled', 'disabled'))));

      $('#addMemberButton').on('click', function(e) {
        e.preventDefault();
        $('#buttonGroup')
          .before($('<div>').attr('class', 'form-group')
            .append($('<label>').text("Enter New Member Name:").attr('class','col-sm-5 control-label'))
            .append($('<div>').attr('class', 'col-sm-2')
              .append($('<input>').attr('type', 'text').attr('class', 'enterNewMembers form-control'))))
      });

      $('#enterNewGroup').on('change', function(e) {
        if ($(this).val() == "") {
          $('#submitNewGroup').attr('disabled', 'disabled');
        }
        else {
          $('#submitNewGroup').removeAttr('disabled');
        }
      })

      $('#submitNewGroup').on('click', function(e) {
        e.preventDefault();
        var newGroup = new Group($('#enterNewGroup').val());
        $('.enterNewMembers').each(function() {
          if($(this).val() != "") {
            newGroup.addMember(new Member($(this).val()));
          }
        });
        groups[newGroup.groupName] = newGroup;
        storeGroups();
        localStorage.setItem("selectedGroup", newGroup.groupName);
        window.location = "form.html";
      });
  });

  $('#resetLocalStorage').on('click', function(e) {localStorage.clear();});

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
