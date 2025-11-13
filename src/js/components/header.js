import { _slideToggle } from "/src/js/files/functions";
import { mmd2 } from "/src/js/consts/window";
import { headerScroll } from "/src/js/files/scroll/scroll";

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  if (menu) {
    menuActions(menu)
  }
})

function menuActions(menu) {
  if (mmd2.matches) {
    const menuSubItems = document.querySelectorAll('.menu__subitem');
    if (!menuSubItems.length) return;
    
    menu.addEventListener('mouseover', (e) => {
      const menuItem = e.target.closest('.menu__item');
      if (menuItem) {
        const menuSubItem = menuItem.querySelector('.menu__subitem');
        menuSubItems.forEach(e => e.hidden = true);

        if (!menuSubItem) return;
        menuSubItem.hidden = false;
      }
    })

    menu.addEventListener('mouseleave', () => {
      menuSubItems.forEach(e => e.hidden = true);
    })
  } else {
    const menuItems = document.querySelectorAll('.menu__item');
    menuItems?.length>0 && menuItems.forEach(e => e.innerHTML.trim() === '' && (e.hidden = true))

    const menuSubLinks = document.querySelectorAll('.subitem-menu__link');
    menuSubLinks?.length>0 && menuSubLinks.forEach(e => {e.classList.remove('btn-white-blue'); e.classList.add('btn-grey')})

    menu.addEventListener('click', (e) => {
      const menuItem = e.target.closest('.menu__item');
      if (menuItem) {
        const menuLink = e.target.closest('.menu__link');
        if (!menuLink) return;

        const menuSubitem = menuItem.querySelector('.menu__subitem');
        if (!menuSubitem) return;

        const href = menuLink.getAttribute('href');
        const currentLink = menuSubitem.querySelector(`[href="${href}"]`);
        if (!currentLink) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.className = 'subitem-menu__link btn btn-smalltext btn-grey';
          a.innerHTML = menuLink.innerHTML;
          menuSubitem.append(a);
        }

        e.preventDefault();
        _slideToggle(menuSubitem);
      }
    })
  }
}

headerScroll()