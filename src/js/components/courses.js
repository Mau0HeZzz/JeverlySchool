import { 
  _slideToggle,
  bodyLockToggle, 
  isMobile 
} from "../files/functions";

document.addEventListener('DOMContentLoaded', () => {
  const coursesTippies = document.querySelectorAll('[data-courses] [data-tippy]');
  if (coursesTippies.length) {
    coursesTippiesInit(coursesTippies)
  }
})

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-courses-filtertrigger]')) {
    document.documentElement.classList.toggle('filters-open');
    if (isMobile.any()) {
      bodyLockToggle();
    } else if (document.querySelector('[data-courses-filters]')) {
      _slideToggle(document.querySelector('[data-courses-filters]'))
    }
  }
})

function coursesTippiesInit(coursesTippies) {
  for (let index = 0; index < coursesTippies.length; index++) {
    const element = coursesTippies[index];
    const content = element.getAttribute('data-tippy')
    
    const div = document.createElement('div');
    div.classList.add('mhz-tippy');
    div.innerHTML = content;
    element.appendChild(div);
  }
}