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
        var created = new Date(data.thisDoc.created);
        var updated = new Date(data.thisDoc.updated);


        document.querySelector('.modal-editor').setAttribute('data-id', data.thisDoc._id);
        document.querySelector('.modal-editor').innerHTML = data.thisDoc.noteBody;
        document.getElementById('modal-title').textContent = data.thisDoc.noteBody.replace(/<(\/)?[a-zA-Z0-9\s"=-]+>/g, " ").substr(0,15) + "...";
        document.getElementById('modal-word-count').textContent = data.stats.words + " words";
        document.getElementById('modal-word-count').setAttribute('title', data.thisDoc.noteBody.replace(/<(\/)?[a-zA-Z0-9\s"=-]+>/g, " ").length + " characters"); // length also counts newline as a character, so a doc with 19 letters spaced out on 6 lines, will have a length of 19+6
        document.getElementById('modal-read-time').textContent = data.stats.text;
        document.getElementById('modal-update-info').textContent = "Saved " + timeSince(updated) + " ago";
        document.getElementById('modal-editor-created').textContent = "Created: " + formatDate(created);
        document.getElementById('modal-editor-updated').textContent = "Last Updated: " + formatDate(updated);
        document.querySelector('#star-btn img').setAttribute("src", data.thisDoc.favorite ? "/images/star-full.svg" : "/images/star-border.svg");
        // document.getElementById('save-btn').setAttribute("data-id", data._id);
        // document.getElementById('delete-btn').setAttribute("data-id", data._id);
        addListenerToListItems();
      }
    };

    editModal();
    return false;
  }
});

document.querySelector('#new-item-btn').onclick = function() {
  editModal();
  document.querySelector('.modal-editor').innerHTML = "";
  document.querySelector('.modal-editor').removeAttribute('data-id');
  document.querySelector('.modal-editor').focus();
  document.getElementById('modal-title').textContent = "New Item...";
  document.getElementById('modal-word-count').textContent = "0 words";
  document.getElementById('modal-read-time').textContent = "0 min read";
  document.getElementById('modal-update-info').textContent = "Item not saved yet!";
  document.getElementById('modal-editor-created').textContent = "Item not saved yet!";
  document.getElementById('modal-editor-updated').textContent = "";
  // document.getElementById('save-btn').removeAttribute("data-id");
  // document.getElementById('delete-btn').removeAttribute("data-id");
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




function timeSince(date) {
  var now = new Date();
  var dateDiff = now - date;
  if (dateDiff < 1000*60) {
    //diff is less than 1 minute
    dateDiff = "less than 1 minute";

  } else if (dateDiff < 1000*60*60) {
    //diff is less than 1 hour
    dateDiff = Math.floor((dateDiff) / (1000*60));
    dateDiff = dateDiff > 1 ? dateDiff + " minutes" : dateDiff + " minute";

  } else if (dateDiff < 1000*60*60*24) {
    //diff is less than 24 hours
    dateDiff = Math.floor((dateDiff) / (1000*60*60));
    dateDiff = dateDiff > 1 ? dateDiff + " hours" : dateDiff + " hour";

  } else {
    dateDiff = Math.floor((dateDiff) / (1000*60*60*24));
    dateDiff = dateDiff > 1 ? dateDiff + " days" : dateDiff + " day";
  }
  return dateDiff;
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

if (document.getElementsByTagName('ul')[0].children.length > 0) {
  for (var i = 0; i < document.getElementsByTagName('ul')[0].children.length; i++) {
    var x = new Date(document.getElementsByTagName('ul')[0].children[i].children[1].textContent);
    document.getElementsByTagName('ul')[0].children[i].children[1].textContent = formatDate(x);
  }
}





document.querySelector('.modal-editor').onblur = function() {
  console.log('unfocused');
  //add ajax call to update the current item on blur
};



document.execCommand("defaultParagraphSeparator", false, "p");

document.querySelectorAll('.modal-editor-modifiers button').forEach((e) => {
  e.onclick = () => {
    console.log(window.getSelection().anchorNode.parentElement.tagName);

    if (e.value == 'ul') {return makeList();}

    var x = window.getSelection().anchorNode.parentElement.tagName;
    if( x == "UL" || x == "LI") {
      //we're inside a list, don't allow any elements to be nested in here
      document.getElementsByClassName('modal-editor')[0].focus();
    } else {
      document.execCommand('formatblock', false, e.value);
      document.getElementsByClassName('modal-editor')[0].focus();
    }
  }
});

function makeList() {
  document.execCommand('insertHTML', false, '<ul><li></li></ul>');
}

function addListenerToListItems() {
  document.querySelectorAll('.modal-editor li').forEach( function(e) {
    e.onclick = function() {
      if (e.getAttribute('data-checked')) {
        e.removeAttribute('data-checked');
        e.classList.remove('list-checked');
      } else {
        e.setAttribute('data-checked', 'checked');
        e.classList.add('list-checked');
      }
      console.log(e);
    }
  })
}

document.getElementsByClassName('modal-editor')[0].addEventListener('keyup', function(e) {
  document.getElementById('modal-editor-updated').textContent = "changes not saved!";
  document.getElementById('modal-update-info').textContent = "changes not saved!";
  addListenerToListItems();
});





document.querySelector('#star-btn').onclick = function() {
  if (document.querySelector('.modal-editor').hasAttribute("data-id")) {
    var inputValue = document.querySelector('.modal-editor').innerHTML;
    var item = document.querySelector('.modal-editor').getAttribute("data-id");
    var fav;

    document.querySelector('#star-btn img').getAttribute("src") == "/images/star-full.svg" ? fav = false : fav = true;

    var xhttp = new XMLHttpRequest();

    xhttp.open("PUT", "/keep/requestSpecificDocument/" + item, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
      noteBody: inputValue,
      favorite: fav,
      updated: Date()
    }));

    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.responseText);
        console.log(data);
        location.reload();
      }
    }
  } else {
    console.log('you are trying to star an item you havent saved yet');
  }
}




document.querySelector('#delete-btn').onclick = function() {
  if (document.querySelector('.modal-editor').hasAttribute("data-id")) {
    var item = document.querySelector('.modal-editor').getAttribute("data-id");
    var xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", "/keep/requestSpecificDocument/" + item, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.responseText);
        console.log(data);
        location.reload();
      }
    }
  } else {
    console.log('you cant remove an item you havent even added to the db');
  }
}






document.getElementById('delete-user-btn').onclick = function() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/keep", true);
  // xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  xhttp.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(xhttp.responseText);
      console.log(data);
      location.reload();
    }
  }
}










document.querySelector('#save-btn').onclick = function() {
  var inputValue = document.querySelector('.modal-editor').innerHTML;

  if (document.querySelector('.modal-editor').hasAttribute("data-id")) {
    // there is a data-id data attribute, so we must be editing an existing item in the db
    var item = document.querySelector('.modal-editor').getAttribute("data-id");
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
        location.reload();
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
        location.reload();
      }
    }
  }


  document.getElementById('edit-modal').style.display = "none";
  document.body.style.overflow = "initial";
  return false;
};
