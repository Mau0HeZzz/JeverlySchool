import { Splide as ProfessorsSplide } from "@splidejs/splide";
import { 
  indexInParent as professorsIndexInParent, 
  isMobile as professorsIsMobile
} from "../files/functions";
// import { da } from "../libs/dynamic_adapt";

const professorsDebounce = (callback, interval = 0) => {
  let prevTimeoutId;

  return (...args) => {
    clearTimeout(prevTimeoutId);
    prevTimeoutId = setTimeout(() => callback(...args), interval);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const professorsEl = document.querySelector('[data-professors]');
  if (professorsEl) {
    new MhzProfessors(professorsEl)
  }
})

class MhzProfessors {
  md1 = matchMedia('(width < 1500px)');
  md2 = matchMedia('(width < 992px)');
  md3 = matchMedia('(width < 768px)');
  md670 = matchMedia('(width < 670px)');
  md4 = matchMedia('(width < 480px)');

  constructor(parent) {
    this.parent = parent;
    this.init();
  }

  init() {
    if (!this.parent) return;
    this.isIncapsulated = this.parent.closest('.professor-incapsulated');
    this.getEls();
    
    if (!this.sliderEl||!window.professors) return;

    this.setProfessorsObj();

    if (this.bgEl) {
      this.setBg();

      window.addEventListener('resize', () => {
        professorsDebounce(this.setBg.bind(this), 100)()
      })
    }

    this.setSlider();
    this.setHandlers();
    this.checkSlider();
  }

  setProfessorsObj() {
    if (!window.courses?.length) return;

    for (let index = 0; index < window.courses.length; index++) {
      const newCourse = window.courses[index];
      if (!newCourse?.professors?.length) continue;

      for (let index = 0; index < newCourse.professors.length; index++) {
        const professorId = newCourse.professors[index];
        const currProfessorIdx = window.professors.findIndex(el => el.id == professorId);
        if (currProfessorIdx < 0) continue;
        if (!window.professors[currProfessorIdx].courses) {
          window.professors[currProfessorIdx].courses = [newCourse];
        } else {
          window.professors[currProfessorIdx].courses.push(newCourse);
        }
      }
    }

    console.log('new professors', window.professors);
  }

  getEls() {
    this.bgEl = this.parent.querySelector('[data-professors-bg]');
    this.sliderEl = this.parent.querySelector('[data-professors-slider]');
    this.detailEl = document.querySelector('[data-professors-detail]');
    this.coursesTitle = document.querySelector('[data-professors-courses-title]');
    this.coursesItems = document.querySelector('[data-professors-courses-items]')
    this.coursesBody = document.querySelector('[data-professors-courses-body]')
  }

  setBg() {
    const is = this.bgEl.querySelectorAll('i');
    for (let index = 0; index < is.length; index++) {
      const i = is[index];
      i.remove();
    }

    let count = 10;
    if (this.md1.matches) count = 7
    if (this.md2.matches) count = 6
    if (this.md3.matches) count = 5
    if (this.md4.matches) count = 4

    for (let index = 0; index < count; index++) {
      const i = document.createElement('i');
      this.bgEl.appendChild(i)
    }
  }

  setSlider() {
    const activeSlide = this.sliderEl.querySelector('.is-active') || this.sliderEl.querySelector('.splide__slide');
    this.activeIndex = 0;
    if (activeSlide) {
      this.activeIndex = professorsIndexInParent(activeSlide.parentElement, activeSlide);
    }

    this.slider = new ProfessorsSplide(this.sliderEl, {
      gap: 20,
      autoWidth: true,
      pagination: false,
      start: this.activeIndex,
      breakpoints: {
        670: {
          destroy: true,
        }
      }
    })

    this.slider.mount();

    if (activeSlide) {
      this.setDetail();
    }
  }

  setDetail() {
    if (this.activeIndex < 0||!this.detailEl) return;

    let slides = this.slider.Components.Slides.get(true);
    if (!slides.length) {
      slides = [...this.sliderEl.querySelectorAll('.splide__slide')].map(slide => ({slide: slide}));
    }
    const id = slides[this.activeIndex]?.slide?.dataset.id;
    if (!id) return;

    const currentProfessor = window.professors.find(el => el.id == id.trim());
    if (!currentProfessor) return;
    this.hideDetail();

    setTimeout(() => {
      let html = this.setDetailHtml(currentProfessor, slides[this.activeIndex].slide);
  
      this.detailEl.innerHTML = html;
      this.showDetail();
    }, 350);
  }

  setDetailHtml(currentProfessor, slide) {
    let answer = '';

    let name = currentProfessor.name;
    if (!name) {
      name = slide.querySelector('.slider-professors__name span').innerHTML;
      currentProfessor.name = name;
    }
    const shortInfo = currentProfessor.shortInfo;
    if (name||shortInfo) {
      answer += `<div class="detail-professors__indmarquee marquee"><div class="marquee__track"><div class="marquee__content"><span>${name}</span><span>${name}</span><span>${name}</span><span>${name}</span><span>${name}</span></div></div></div>`
      answer += `<div class="detail-professors__head">${name ? `<div class="detail-professors__name">${name}</div>` : ''}${shortInfo ? `<div class="detail-professors__shortinfo">${shortInfo}</div>` : ''}</div>`
    }

    const info = currentProfessor.info;
    let imagePath = currentProfessor.image || slide.querySelector('img').src;
    const hasCourses = currentProfessor.courses?.length > 0;

    answer += '<div class="detail-professors__body">'

    if (info) {
      answer += `<div class="detail-professors__info">${info}</div>`
    } else {
      answer += '<div></div>'
    }
    answer += `<div class="detail-professors__image"><img src="${imagePath}"></div>`;
    if (hasCourses) {
      if (this.isIncapsulated) {
        answer += `<a href="#" data-popup="#coursesPopup" class="detail-professors__button btn btn-black">Все курсы ${name.split(' ')[0]}</a>`
      } else {
        if (window.innerWidth >= 670) {
          answer += `<a href="#" data-popup="#coursesPopup" class="detail-professors__button btn btn-white">Все курсы ${name.split(' ')[0]}</a>`
        } else {
          answer += `<button data-professors-scrollto-courses class="detail-professors__button btn btn-black"><span>Курсы ${name.split(' ')[0]}</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_704_14562)"><path d="M8 11L12 15L16 11" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_704_14562"><rect width="24" height="24" rx="12" fill="white"/></clipPath></defs></svg></button>`
        }
      }

      this.setDetailCourses(currentProfessor)
    } else {
      answer += '<div></div>'
    }

    answer += '</div>'

    return answer;
  }

  setDetailCourses(currentProfessor) {
    if (!this.coursesItems) return;
    
    this.coursesTitle.innerHTML = `Программы ${currentProfessor.name}`;
    if (!currentProfessor.courses.length) return;

    const coursesHtml = this.setCoursesHtml(currentProfessor.courses);
    this.coursesItems.innerHTML = coursesHtml;
  }

  setCoursesHtml(courses) {
    let answer = '';

    for (let index = 0; index < courses.length; index++) {
      const course = courses[index];

      const { image, name, info, linkPath } = course;
      let rowCount = 1;
      let itemHtml = '';

      itemHtml += `<div class="coursesPopup__name">${name}</div>`
      if (info?.trim()) {
        itemHtml += `<div class="coursesPopup__info">${info}</div>`;
        rowCount++;
      }
      if (linkPath) {
        itemHtml += `<a href="${linkPath}" class="coursesPopup__button btn btn-dark">Подробнее о курсе</a>`
        rowCount++;
      }
      if (image) {
        itemHtml = `<div class="coursesPopup__image" style="--rows: ${rowCount};"><img src="${image}"></div>${itemHtml}`
      } else {
        itemHtml = `<div></div>${itemHtml}`
      }

      answer += `<div class="coursesPopup__item">${itemHtml}</div>`
    }
    return answer
  }

  hideDetail() {
    if (!this.detailEl) return;
    this.detailEl.classList.add('_hide');
  }

  showDetail() {
    if (!this.detailEl) return;
    setTimeout(() => {
      this.detailEl.classList.remove('_hide');
    }, 0);
  }

  setHandlers() {
    if (this.slider) {
      this.slider.on('moved', () => professorsDebounce(this.onSliderMoved.bind(this), 300)())
      this.slider.on('click', this.onSlideClick.bind(this))
    }

    this.parent.addEventListener('click', (e) => {
      const slideEl = e.target.closest('[data-id]');
      if (!slideEl) return;

      this.onProfessorClick(slideEl);
    })

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-professors-scrollto-courses]')) {
        this.scrollToCourses();
      }
    })

    window.addEventListener('resize', this.checkSlider.bind(this));

    if (this.isIncapsulated) return;

    const obj = {
      breakpoint: '670',
      destination: this.coursesBody,
      element: this.detailEl,
      index: 1,
      parent: this.detailEl.parentNode,
      place: 'first'
    }

    const matchMedia = window.matchMedia("(width < 670px)");

    matchMedia.addListener(function () {
      da?.mediaHandler(matchMedia, [obj]);
    });
    da?.mediaHandler(matchMedia, [obj]);
  }

  checkSlider() {
    if (this.isIncapsulated&&this.sliderEl) this.sliderEl.hidden = true;
  }

  onSliderMoved() {
    const activeIndex = this.slider.Components.Controller.getIndex();
    // console.log(activeIndex);
    this.activeIndex = activeIndex;
    this.setDetail();
  }

  onSlideClick(e) {
    if (!e.slide||!e.index) return;

    const index = e.index;

    this.slider.Components.Controller.go(index);
  }

  onProfessorClick(target) {
    if (!this.md670.matches) return;
    const activeIndex = professorsIndexInParent(target.parentElement, target);
    this.activeIndex = activeIndex;
    this.setDetail();
    window.mhzModules.popup.open('#coursesPopup')
  }

  scrollToCourses() {
    if (!this.coursesBody||!this.coursesItems) return;

    this.coursesBody.scrollTo({
      top: this.coursesItems.offsetTop,
      behavior: 'smooth'
    })
  }
}