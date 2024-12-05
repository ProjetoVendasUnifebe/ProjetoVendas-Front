/*===== EXPANDER MENU  =====*/
const showMenu = (toggleId, navbarId, bodyId) => {
  const toggle = document.getElementById(toggleId),
    navbar = document.getElementById(navbarId),
    bodypadding = document.getElementById(bodyId)

  if (toggle && navbar) {
    toggle.addEventListener('click', () => {
      navbar.classList.toggle('expander')

      bodypadding.classList.toggle('body-pd')
    })
  }
}
showMenu('nav-toggle', 'navbar', 'body-pd')

/*===== LINKS  =====*/
const linkColor = document.querySelectorAll('.nav__link')
function colorLink() {
  linkColor.forEach(l => l.classList.remove('active'))
  this.classList.add('active')
}
linkColor.forEach(l => l.addEventListener('click', colorLink))


/*===== MENU  =====*/
const linkCollapse = document.querySelectorAll('.nav__link.collapse.collapse__link');

for (let i = 0; i < linkCollapse.length; i++) {
  linkCollapse[i].addEventListener('click', function () {
    const collapseMenu = this.querySelector('.collapse__menu');
    collapseMenu.classList.toggle('showCollapse');

    const rotate = collapseMenu.previousElementSibling
    rotate.classList.toggle('rotate')
  });
}

/*===== TOAST  =====*/
function toast(tipoToast, mensagem) {
  switch (tipoToast) {
    case "success":

      Toastify({
        text: mensagem,
        className: "success",
        style: {
          background: "linear-gradient(to right,  #711e92, #5b087c)",
        }
      }).showToast();

      break;
    case "error":

      Toastify({
        text: mensagem,
        className: "error",
        style: {
          background: "linear-gradient(to right, #ff0000, #b30000, #800000)"
        }
      }).showToast();

      break;
  }

}






