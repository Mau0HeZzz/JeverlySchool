import Splide from "@splidejs/splide";
import { debounce, indexInParent, isMobile } from "../files/functions";

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
  md4 = matchMedia('(width < 480px)');

  constructor(parent) {
    this.parent = parent;
    this.init();
  }

  init() {
    if (!this.parent) return;
    this.getEls();

    if (!this.sliderEl||!window.professors) return;

    if (this.bgEl) {
      this.setBg();

      window.addEventListener('resize', () => {
        debounce(this.setBg.bind(this), 100)()
      })
    }

    this.setSlider();
    this.setHandlers();
  }

  getEls() {
    this.bgEl = this.parent.querySelector('[data-professors-bg]');
    this.sliderEl = this.parent.querySelector('[data-professors-slider]');
    this.detailEl = document.querySelector('[data-professors-detail]');
    this.coursesTitle = document.querySelector('[data-professors-courses-title]');
    this.coursesItems = document.querySelector('[data-professors-courses-items]')
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
    const activeSlide = this.sliderEl.querySelector('.is-active');
    this.activeIndex = 0;
    if (activeSlide) {
      this.activeIndex = indexInParent(activeSlide.parentElement, activeSlide);
    }

    this.slider = new Splide(this.sliderEl, {
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
    
    // name: 'Лейла Мурадова',
    // shortInfo: 'Потомственный ювелир. Мастер закрепки с опытом',
    // info: `<ul><li><span>Базируется: </span><span>в России</span></li><li><span>Образование: </span><span>Костромской гос. университет</span></li><li><span>Опыт:</span><span>+ 10 лет практики</span></li><li><span>Достижения:</span><span>автор более 5 программ обучения</span></li></ul>`,
    // image: '/img/professors/professors_6.png',

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
      answer += `<a href="#" data-popup="#coursesPopup" class="detail-professors__button btn btn-white">Все курсы Владимира</a>`
      this.setDetailCourses(currentProfessor)
    } else {
      answer += '<div></div>'
    }

    answer += '</div>'

    return answer;
  }

  setDetailCourses(currentProfessor) {
    console.log(currentProfessor);
    if (!this.coursesItems) return;

    this.coursesTitle.innerHTML = `Программы ${currentProfessor.name}`;
    if (!currentProfessor.courses.length) return;

    const coursesHtml = this.setCoursesHtml(currentProfessor.courses);
    this.coursesItems = coursesHtml;
  }

  setCoursesHtml(courses) {
    return 'Доделаю до 26.01.2026'
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
      this.slider.on('moved', () => debounce(this.onSliderMoved.bind(this), 300)())
      this.slider.on('click', this.onSlideClick.bind(this))
    }

    this.parent.addEventListener('click', (e) => {
      const slideEl = e.target.closest('[data-id]');
      if (!slideEl) return;

      this.onProfessorClick(slideEl);
    })
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
    if (!isMobile.any()) return;
    const activeIndex = indexInParent(target.parentElement, target);
    this.activeIndex = activeIndex;
    this.setDetail();
    window.mhzModules.popup.open('#coursesPopup')
  }
}