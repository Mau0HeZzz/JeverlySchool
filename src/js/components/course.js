import { Splide } from '@splidejs/splide';

export const debounce = (callback, interval = 0) => {
  let prevTimeoutId;

  return (...args) => {
    clearTimeout(prevTimeoutId);
    prevTimeoutId = setTimeout(() => callback(...args), interval);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const worksCourse = document.querySelector('.works-course');
  if (worksCourse) {
    worksCourseInit(worksCourse)
  }

  const courseCircles = document.querySelectorAll('.learn-course__circle');
  courseCircles.length > 0 && setCourseCirclesZIndex(courseCircles)
})


function onWorksCourseSliderActive(splide) {
  splide?.root?.galleryClass?.refresh?.();
}

const onWorksCourseSliderActiveDebounced = debounce(onWorksCourseSliderActive, 200);

function worksCourseInit(worksCourse) {
  const splide = new Splide(worksCourse, {
    type: 'loop',
    autoWidth: true,
    perMove: 1,
    gap: 17,
    breakpoints: {
      767: {
        gap: 8
      }
    }
  })

  splide.on('active', () => {
    onWorksCourseSliderActiveDebounced(splide);
  })

  splide.mount();
}

function setCourseCirclesZIndex(courseCircles) {
  if (!courseCircles.length) return;

  courseCircles.forEach((courseCircle, index) => {
    const zIndex = courseCircles.length - index;
    courseCircle.style.setProperty('--z-index', zIndex);

    const title = courseCircle.querySelector('h1,h2,h3,h4,h5');
    if (title) {
      courseCircle.style.setProperty('--max-width', `${title.offsetWidth}px`);
    }
  });
}