// Подключение функционала "Чертоги Фрилансера"
import { isMobile, menuClose, getHash, FLS } from "../functions.js";
// Подключение дополнения для увеличения возможностей
// Документация: https://github.com/cferdinandi/smooth-scroll
// import SmoothScroll from 'smooth-scroll';
//================================================== ================================================== ================================================== ================================================== ================================================== ================================================== ==================

// Модуль плавной проктутки к блоку
export let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = typeof targetBlock === 'string' ? document.querySelector(targetBlock) : targetBlock;
	if (targetBlockElement) {
		let headerItem = '';
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = 'header.header';
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains('_header-scroll')) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add('_header-scroll');
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove('_header-scroll');
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else {
				headerItemHeight = headerElement.offsetHeight;
			}
		}
		let options = {
			speedAsDuration: true,
			speed: speed,
			header: headerItem,
			offset: offsetTop,
			easing: 'easeOutQuad',
		};
		// Закрываем меню, если оно открыто
		document.documentElement.classList.contains("menu-open") ? menuClose() : null;

    const isPopup = targetBlockElement.closest('.popup');
    let parentElement = window;
    if (isPopup) {
      const md3 = window.matchMedia('(width < 768px)');
      parentElement = isPopup;

      if (md3.matches) {
        if (isPopup.querySelector('.popup__body')) {
          parentElement = isPopup.querySelector('.popup__body')
        }
      }
    }

    // console.log('parentElement.scrollTop',parentElement.scrollTop);
    // console.log('window.scrollTop',window.scrollTop);
    const scrollTop = isPopup ? (parentElement.scrollTop - 80) : scrollY;

    // Прокрутка стандартными средствами
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollTop;
    console.log(targetBlockElementPosition);
    targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
    targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
    parentElement.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
		console.log(`[gotoBlock]: Юхуу...едем в ${targetBlock}`);
	} else {
		console.log(`[gotoBlock]: Ей... Такого блока нет на странице: ${targetBlock}`);
	}
};