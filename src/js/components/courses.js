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

  const coursesFilter = document.querySelector('[data-courses-filters]');
  if (coursesFilter && !coursesFilter.hidden) {
    document.documentElement.classList.add('filters-open')
  }

  const courseCounter = document.getElementById('courseCounter');
  if (courseCounter) {
    const courseCount = document.querySelectorAll('.courses__item.item-courses').length;
    const words = JSON.parse(courseCounter.parentElement.dataset.words.replace(/'/g, '"'));
    const lastTwoDigits = courseCount % 100;
    const lastDigit = courseCount % 10;
    const wordIndex = lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? 2
      : lastDigit === 1 ? 0 : lastDigit >= 2 && lastDigit <= 4 ? 1 : 2;

    courseCounter.textContent = courseCount;
    courseCounter.nextSibling.textContent = ` ${words[wordIndex]}`;
  }
})

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-courses-filtertrigger]')) {
    const coursesFilter = document.querySelector('[data-courses-filters]');
    if (!coursesFilter) return;
    const isFiltersOpen = document.documentElement.classList.toggle('filters-open');
    if (isMobile.any()) {
      coursesFilter.hidden = !isFiltersOpen;
      bodyLockToggle();
    } else {
      _slideToggle(coursesFilter)
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
