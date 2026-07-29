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

  document.querySelectorAll('.learn-course').forEach((learnCourse) => {
    const slider = learnCourse.querySelector('[data-learn-course-slider]');
    const circlesHolder = learnCourse.querySelector('.learn-course__circles');
    const circles = Array.from(learnCourse.querySelectorAll('.learn-course__circles a'));
    const slides = Array.from(learnCourse.querySelectorAll('.learn-course__slide'));

    if (!slider || !circles.length || !slides.length) return;

    circlesHolder?.setAttribute('role', 'tablist');
    circles.forEach((circle) => circle.setAttribute('role', 'tab'));
    slides.forEach((slide) => slide.setAttribute('role', 'tabpanel'));

    const setActiveCircle = (activeIndex) => {
      circles.forEach((circle, index) => {
        const isActive = index === activeIndex;

        circle.classList.toggle('is-active', isActive);
        circle.setAttribute('aria-current', isActive ? 'true' : 'false');
        circle.setAttribute('aria-selected', isActive ? 'true' : 'false');

        if (isActive) {
          circle.style.setProperty('--bg', 'linear-gradient(183.83deg, #ededed 3.14%, #f7f7f7 87.56%)');
        } else {
          circle.style.removeProperty('--bg');
        }
      });
    }

    if (typeof Splide !== 'function') {
      slider.classList.add('is-fallback');

      const setActiveSlide = (activeIndex) => {
        slides.forEach((slide, index) => {
          const isActive = index === activeIndex;
          slide.classList.toggle('is-active', isActive);
          slide.hidden = !isActive;
        });
      }

      circles.forEach((circle, index) => {
        circle.addEventListener('click', (e) => {
          e.preventDefault();
          setActiveSlide(index);
          setActiveCircle(index);
        });
      });

      setActiveSlide(0);
      setActiveCircle(0);
      return;
    }

    const splide = new Splide(slider, {
      type: 'slide',
      perPage: 1,
      perMove: 1,
      arrows: false,
      pagination: false,
      rewind: slides.length > 1,
      drag: slides.length > 1,
      speed: 350,
      waitForTransition: true
    });

    circles.forEach((circle, index) => {
      circle.addEventListener('click', (e) => {
        e.preventDefault();
        splide.go(index);
        setActiveCircle(index);
      });
    });

    splide.on('mounted', () => setActiveCircle(splide.index));
    splide.on('move', (newIndex) => setActiveCircle(newIndex));
    splide.mount();
  });
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
