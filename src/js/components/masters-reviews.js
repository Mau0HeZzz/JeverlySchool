import {Splide} from '@splidejs/splide';

window.addEventListener('load', () => {
  const galleryMastersReviews = document.querySelector('.gallery-masters-reviews');
  if (galleryMastersReviews) {
    let contentSlider;

    if (document.querySelector('.content-masters-reviews')) {
      contentSlider = new Splide('.content-masters-reviews', {
        type: 'loop',
        isNavigation: true,
        pagination: false,
        perPage: 1,
        perMove: 1,
        gap: 20
      })
    }

    let gallerySlider = new Splide(galleryMastersReviews, {
      type: 'fade',
      perPage: 1,
      arrows: false,
      pagination: false,
      wheel: true,
      rewind: true
    })

    if (contentSlider) {
      const pagEl = contentSlider?.root?.querySelector('.content-masters-reviews__pagination');
      if (pagEl) {
        // setPagination(contentSlider, pagEl);
        contentSlider.on('active', () => {
          setPagination(contentSlider, pagEl);
        })
      }
    }

    if (contentSlider) gallerySlider.sync(contentSlider);
    gallerySlider.mount();
    if (contentSlider) contentSlider.mount();
  }
})

function setPagination(contentSlider, pagEl) {
  // console.log(contentSlider);
  const slidesCount = contentSlider.Components.Slides.get(true).length;
  if (!slidesCount) return;
  
  const currentIndex = contentSlider.Components.Controller.getIndex()+1;

  pagEl.innerHTML = `<span>${currentIndex}</span><span>${slidesCount}</span>`
}