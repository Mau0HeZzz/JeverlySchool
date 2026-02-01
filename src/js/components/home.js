import Cookies from "js-cookie";
import { bodyLock, bodyUnlock, getDigFromString, setIndex } from "../files/functions";
import { gotoBlock } from "../files/scroll/gotoblock";
import { Splide as HomeSplide } from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  const cardsItems = document.querySelectorAll('.cards__item');
  cardsItems.length > 0 && setIndex(cardsItems);

  const resultsItems = document.querySelectorAll('.results__item');
  resultsItems.length > 0 && setIndex(resultsItems)

  const homeFigure = document.querySelector('.home-figure');
  homeFigure && homeFigureHandler(homeFigure)

  const approachSlider = document.querySelector('.approach__slider');
  approachSlider && initApproach(approachSlider);

  const partnersMain = document.querySelector('.partners__main');
  partnersMain && initPartners(partnersMain)
})

window.addEventListener('load', () => {
  const pathEl = document.querySelector('.path');
  if (pathEl) {
    setMaxWidth(pathEl.querySelector('.path__body'))
    setPathTippyPos(pathEl)
  }

  if (document.querySelector('.students__slider')) {
    const splide = new HomeSplide('.students__slider', {
      type: 'slide',
      perMove: 1,
      perPage: 1,
      gap: 12,
    })

    splide.mount();
  }
  
  const homeFigureContainer = document.querySelector('.home-figure__container');
  if (homeFigureContainer) {
    const width = homeFigureContainer.offsetWidth;
    let padding = getDigFromString(window.getComputedStyle(homeFigureContainer).getPropertyValue('padding-left'));
    if (!padding||isNaN(padding)) padding = 0;

    const currentWidth = width - (padding * 2)

    homeFigureContainer.style.setProperty('--container-size', `${currentWidth}px`);
  }
})

document.addEventListener('click', (e) => {
  if (e.target.closest('.path__tippy i')) {
    hidePathTippy();
  }
  if (e.target.closest('.sidebar-experts__close')) {
    hideExpertsSidebar();
  }
})

window.addEventListener('resize', () => {
  const homeFigureContainer = document.querySelector('.home-figure__container');
  if (homeFigureContainer) {
    const width = homeFigureContainer.offsetWidth;
    let padding = getDigFromString(window.getComputedStyle(homeFigureContainer).getPropertyValue('padding-left'));
    if (!padding||isNaN(padding)) padding = 0;

    const currentWidth = width - (padding * 2);

    homeFigureContainer.style.setProperty('--container-size', `${currentWidth}px`);
  }
})

document.addEventListener('watcherCallback', (e) => {
  const { entry } = e.detail;

  if (entry.isIntersecting) {
    if (entry.target.closest('.path')) {
      showPathTippy();
    }
    if (entry.target.closest('.experts')) {
      showExpertsSidebar(entry.target.closest('.experts'))
    }
    if (entry.target.closest('.home-figure')) {
      gotoBlock(entry.target.closest('.home-figure'), true);
      bodyLock();
    }
  }
})

function setPathTippyPos(pathEl) {
  const pathTippy = pathEl?.querySelector('.path__tippy');
  if (!pathTippy) return;

  // pathTippy.classList.add('_hide');

  const isPathTippyClosed = Cookies.get('isPathTippyClosed');
  if (isPathTippyClosed) {
    return pathTippy.remove();
  }

  const activeLink = pathEl?.querySelector('.path__row._active');
  if (!activeLink) {
    return;
  }

  const top = activeLink.offsetTop;
  const left = activeLink.offsetLeft;

  const translate = window.getComputedStyle(activeLink).getPropertyValue('translate')
  let [ translateX, translateY ] = translate.split(' ').map(el => getDigFromString(el));

  if (!translateX||isNaN(translateX)) translateX = 0;
  if (!translateY||isNaN(translateY)) translateY = 0;

  pathEl.style.setProperty('--tippy-left', `${left + translateX}px`);
  pathEl.style.setProperty('--tippy-top', `${top + translateY}px`);
  
}

function setMaxWidth(el) {
  if (!el) return;

  const childrensWidths = [...el.children].filter(el => {
    const style = window.getComputedStyle(el).getPropertyValue('position');

    if (style === 'absolute' || style === 'fixed') return false;

    return true;
  }).map(el => el.offsetWidth);

  
  const maxWidth = Math.max(...childrensWidths);

  el.style.setProperty('--max-width', `${maxWidth + 10}px`);
}

function showPathTippy() {
  const pathTippy = document.querySelector('.path__tippy');
  if (!pathTippy) return;

  const isPathTippyClosed = Cookies.get('isPathTippyClosed');
  if (isPathTippyClosed) {
    return;
  }

  bodyLock();
  const path = pathTippy.closest('.path');
  document.documentElement.classList.add('pathtippy-show');

  gotoBlock(path, true);
  pathTippy.classList.remove('_hide');
}

function hidePathTippy() {
  document.documentElement.classList.remove('pathtippy-show');
  bodyUnlock();

  const pathTippy = document.querySelector('.path__tippy');
  if (!pathTippy) return;
  
  pathTippy.classList.add('_hide');
  if (!pathTippy.hasAttribute('data-no-cookies')) {
    Cookies.set('isPathTippyClosed', 'y');
  }
  
  setTimeout(() => {
    pathTippy.remove();
  }, 1000);
}

function showExpertsSidebar(parent) {
  if (!parent) return;
  
  const isExpertsSidebarClosed = Cookies.get('isExpertsSidebarClosed');
  if (isExpertsSidebarClosed) {
    return;
  }
  
  bodyLock();
  document.documentElement.classList.add('sidebar-experts-open');
  gotoBlock(parent);
}

function hideExpertsSidebar() {
  document.documentElement.classList.remove('sidebar-experts-open');
  bodyUnlock();

  const sidebarExperts = document.querySelector('.sidebar-experts');
  if (!sidebarExperts) return;

  
  if (!sidebarExperts.hasAttribute('data-no-cookies')) {
    Cookies.set('isExpertsSidebarClosed', 'y');
  }
  
  setTimeout(() => {
    sidebarExperts.remove();
  }, 1000);
}

function homeFigureHandler(homeFigure = document.querySelector('.home-figure')) {
  if (!homeFigure) return;
  let percent = 0;
  let touchStartY = null;

  homeFigure.addEventListener('wheel', (e) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    const speed = 5;
    percent = homeFigureAction(percent, direction, speed, homeFigure);
  })

  homeFigure.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  })
  homeFigure.addEventListener('touchmove', (e) => {
    const md3 = window.matchMedia('(width < 769px)');
    if (!touchStartY) return;
    const currentY = e.touches[0].clientY;

    const deltaY = touchStartY - currentY;
    const direction = deltaY > 0 ? 1 : -1;
    const speed = md3.matches ? 8 : 3;
    percent = homeFigureActionThrottle(percent, direction, speed, homeFigure);
  })
  homeFigure.addEventListener('touchend', (e) => {
    touchStartY = null;
  })
}

function homeFigureAction(percent, direction, speed, homeFigure) {
  const md3 = window.matchMedia('(width < 769px)');
  if (percent >= 100) {
    bodyUnlock();
    return percent;
  }

  const figures = homeFigure.querySelectorAll('.home-figure__figure');
  if (!figures.length) {
    bodyUnlock();
    return percent;
  }

  const homeFigureContainer = homeFigure.querySelector('.home-figure__container');
  if (!homeFigureContainer) return percent;

  const baseRotate = 360;

  let targetPercent = percent += (speed * direction);
  if (targetPercent < 0) targetPercent = 0;
  if (targetPercent > 100) targetPercent = 100;

  
  // if (md3.matches) {
  //   bodyUnlock();
  //   return percent;
  // }

  figures.forEach((figure, index) => {
    const baseSize = getDigFromString(window.getComputedStyle(homeFigure).getPropertyValue('--base-size')) * 16;
    const width = homeFigureContainer.offsetWidth;
    let padding = getDigFromString(window.getComputedStyle(homeFigureContainer).getPropertyValue('padding-left'));
    if (!padding||isNaN(padding)) padding = 0;

    const containerWidth = width - (padding * 2);
    
    const translateSize = getDigFromString(window.getComputedStyle(figure).getPropertyValue('--translate-size')) * 16;
    let baseTranslate = 0;

    if (!md3.matches) {
      if (index === 0) {
        baseTranslate = (containerWidth / 2) - translateSize + (baseSize * 0.3);
      } else {
        baseTranslate = (containerWidth / -2) + translateSize;
      }
    } else {
      if (index === 0) {
        baseTranslate = baseSize * -1.22
      } else {
        baseTranslate = baseSize * 0.92
      }
    }

    const rotate = (baseRotate * targetPercent) / 100;
    const translate = (baseTranslate * targetPercent) / 100;

    figure.style.setProperty('rotate', `${index > 0 ? '-' : ''}${rotate}deg`);
    figure.style.setProperty('translate', md3.matches ? `0 ${translate}px` : `${translate}px 0`);
  })

  return targetPercent;
}

function throttleEveryFifth(callback) {
  let callCount = 0;
  
  return function(...args) {
    callCount++;
    
    // Вызываем callback только на каждом 5-м вызове
    if (callCount % 5 === 0) {
      return callback.apply(this, args);
    }
    
    // Для остальных вызовов можно вернуть undefined или что-то ещё
    // Или ничего не возвращать
    return args[0];
  };
}

const homeFigureActionThrottle = throttleEveryFifth(homeFigureAction)

function initApproach(approachSlider) {
  let rotate = 0;
  const splide = new HomeSplide(approachSlider, {
    type: 'fade',
    perPage: 1,
    perMove: 1,
    arrows: false,
    pagination: false,
    wheel: true,
    waitForTransition: true,
  })

  const parent = approachSlider.closest('.approach');
  const circle = parent?.querySelector('.approach__circle');
  if (circle) {
    splide.on('move', (newIndex, prevIndex) => {
      const direction = newIndex - prevIndex;

      const i = circle.querySelector('i');
      if (i) {
        i.innerHTML = newIndex+1;
      }
      
      const imgs = circle.querySelectorAll('img');
      if (imgs.length) {
        rotate += (90 * direction);
        imgs.forEach((img, index) => {
          const dop = index === 1 ? '-' : ''
          img.style.setProperty('rotate', `${dop}${rotate}deg`);
        })
      }
    })
  }

  splide.mount()
}

function initPartners(mainSliderEl) {
  if (!mainSliderEl) return;
  let mainSlider, thumbSlider;

  const thumbSliderEl = document.querySelector('.partners__thumb');
  if (thumbSliderEl) {
    thumbSlider = new HomeSplide(thumbSliderEl, {
      type: 'slide',
      perMove: 1,
      perPage: 1,
      isNavigation: true,
      gap: 10,
      pagination: false
    })
  }

  mainSlider = new HomeSplide(mainSliderEl, {
    type: 'slide',
    perMove: 1,
    perPage: 1,
    gap: 10,
    arrows: false,
    pagination: false
  })

  if (thumbSlider) {
    mainSlider.sync(thumbSlider);

    const pagEl = thumbSlider.root?.querySelector('.partners__pagination');
    if (pagEl) {
      thumbSlider.on('active', () => {
        const slidesCount = thumbSlider.Components.Slides.get(true).length;
        const currIndex = thumbSlider.Components.Controller.getIndex() + 1;

        pagEl.innerHTML = `<span>${currIndex}</span><span>${slidesCount}</span>`
      })
    }
  }
  mainSlider.mount();
  thumbSlider?.mount?.();
}