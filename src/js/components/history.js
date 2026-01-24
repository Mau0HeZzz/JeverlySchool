import {Splide} from '@splidejs/splide';

window.addEventListener('load', () => {
  if (document.querySelector('.content-history')) {
    let datesSlider;

    const startIndex = document.querySelector('.content-history').getAttribute('data-start') || 2;

    if (document.querySelector('.dates-history')) {
      datesSlider = new Splide('.dates-history', {
        // type: 'loop',
        arrows: false,
        pagination: false,
        rewind: true,
        gap: 20,
        direction: 'ttb',
        autoHeight: true,
        focus: 'center',
        isNavigation: true,
        wheel: true,
        height: '100%',
        start: startIndex,

        breakpoints: {
          900: {
            direction: 'ltr',
            autoWidth: true,
            autoHeight: false,
            height: 'auto',
          }
        }
      })
    }

    let contentSlider = new Splide('.content-history', {
      type: 'fade',
      perPage: 1,
      perMove: 1,
      arrows: false,
      pagination: false,
      wheel: true,
      rewind: true,
      start: startIndex,
    })

    if (datesSlider) {
      contentSlider.sync(datesSlider)
    }

    contentSlider.mount();

    if (datesSlider) datesSlider.mount();
  }
})