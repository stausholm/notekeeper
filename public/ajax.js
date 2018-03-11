document.querySelectorAll('li').forEach((e) => {
  e.onclick = () => {
    var item = e.getAttribute('data-id');

    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "keep/requestSpecificDocument/" + item, true);
    xhttp.send();

    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.response);
        console.log(data);
        // populate modal with data
        var created = new Date(data.created);
        var updated = new Date(data.updated);
        var now = new Date();
        //var dateDiff = Math.floor((now - updated) / (1000*60*60*24)); //get the diff in days
        var dateDiff = now - updated;
        if (dateDiff < 1000*60) {
          //diff is less than 1 minute
          dateDiff = "less than 1 minute";

        } else if (dateDiff < 1000*60*60) {
          //diff is less than 1 hour
          dateDiff = Math.floor((dateDiff) / (1000*60)) + " minute(s)";

        } else if (dateDiff < 1000*60*60*24) {
          //diff is less than 24 hours
          dateDiff = Math.floor((dateDiff) / (1000*60*60)) + " hour(s)";

        } else {
          dateDiff = Math.floor((dateDiff) / (1000*60*60*24)) + " day(s)";
        }

        document.querySelector('.modal-editor').innerHTML = data.noteBody;
        document.getElementById('modal-title').textContent = data.noteBody.substr(0,15) + "...";
        document.getElementById('modal-word-count').textContent = data.noteBody.length + " characters";
        document.getElementById('modal-read-time').textContent = "TBD min read";
        document.getElementById('modal-update-info').textContent = "Saved " + dateDiff + " ago";
        document.getElementById('modal-editor-created').textContent = "Created: " + formatDate(created);
        document.getElementById('modal-editor-updated').textContent = "Last Updated: " + formatDate(updated);
        document.getElementById('save-btn').setAttribute("data-id", data._id);
        document.getElementById('delete-btn').setAttribute("data-id", data._id);
      }
    };

    editModal();
    return false;
  }
});

document.querySelector('#new-item-btn').onclick = function() {
  editModal();
  document.querySelector('.modal-editor').innerHTML = "";
  document.querySelector('.modal-editor').focus();
  document.getElementById('modal-title').textContent = "New Item...";
  document.getElementById('modal-word-count').textContent = "0 words";
  document.getElementById('modal-read-time').textContent = "0 min read";
  document.getElementById('modal-update-info').textContent = "Item not saved yet!";
  document.getElementById('modal-editor-created').textContent = "Item not saved yet!";
  document.getElementById('modal-editor-updated').textContent = "";
  document.getElementById('save-btn').removeAttribute("data-id");
  document.getElementById('delete-btn').removeAttribute("data-id");
}








function editModal() {
  const modal = document.getElementById('edit-modal');
  modal.style.display = "block";
  modal.scrollTo(0,0);
  document.body.style.overflow = "hidden";


  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = "initial";
    }
  }

  //get the amount of pixels, the bottom of modal-header-body is from the top of the window = 330
  //const bottomPos = document.getElementsByClassName('modal-header-body')[0].getBoundingClientRect().bottom;

  modal.onscroll = function() {
    if (modal.scrollTop > 330 ){
      modal.classList.add('scrolled');
    } else {
      modal.classList.remove('scrolled');
    }
  }

  console.log('edit modal opened');
}







function formatDate(date) {
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hours + ':' + minutes;
}

for (var i = 0; i < document.getElementsByTagName('ul')[0].children.length; i++) {
  var x = new Date(document.getElementsByTagName('ul')[0].children[i].children[1].textContent);
  document.getElementsByTagName('ul')[0].children[i].children[1].textContent = formatDate(x);
}





document.querySelector('.modal-editor').onblur = function() {
  console.log('unfocused');
  //add ajax call to update the current item on blur
};










document.querySelector('#delete-btn').onclick = function() {
  if (document.getElementById('delete-btn').hasAttribute("data-id")) {
    var item = document.getElementById('delete-btn').getAttribute("data-id");
    var xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", "/keep/requestSpecificDocument/" + item, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.responseText);
        console.log(data);
      }
    }
  } else {
    console.log('you cant remove an item you havent even added to the db');
  }
}
















document.querySelector('#save-btn').onclick = function() {
  var inputValue = document.querySelector('.modal-editor').innerHTML;

  if (document.getElementById('save-btn').hasAttribute("data-id")) {
    // there is a data-id data attribute, so we must be editing an existing item in the db
    var item = document.getElementById('save-btn').getAttribute("data-id");
    var xhttp = new XMLHttpRequest();

    xhttp.open("PUT", "/keep/requestSpecificDocument/" + item, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      noteBody: inputValue,
      updated: Date()
    }));

    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.responseText);
        console.log(data);
      }
    }

  } else {
    // no data-attribute detected, so create a new item in the db
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/keep", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      noteBody: inputValue
    }));

    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.responseText);
        console.log(data);
      }
    }
  }


  document.getElementById('edit-modal').style.display = "none";
  document.body.style.overflow = "initial";
  return false;
};
