document.querySelector('nav div a:last-of-type').onclick = () => {
  loginModal();
  return false;
}


function loginModal() {
  const modal = document.getElementById('login-modal');
  modal.style.display = "block";

  const closeEdit = document.getElementsByClassName('modal-close')[0];
  closeEdit.onclick = function() {
    modal.style.display = "none";
  }


  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  console.log('modal opened');
}
