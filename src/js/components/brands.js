import { Splide as BrandsSplide } from "@splidejs/splide";
import { AutoScroll as BrandsAutoScroll } from '@splidejs/splide-extension-auto-scroll';

window.addEventListener('load', () => {
  const sliderBrands = document.querySelector('.slider-brands');
  if (sliderBrands) {
    const splide = new BrandsSplide(sliderBrands, {
      type: 'loop',
      arrows: false,
      pagination: false,
      autoWidth: true,
      fixedHeight: 70,
      gap: 80,
      autoScroll: {
        pauseOnHover: false,
        pauseOnFocus: false,
      },
      breakpoints: {
        960: {
          fixedHeight: 60,
          gap: 70,
        },
        768: {
          fixedHeight: 40,
          gap: 45,
        }
      }
    })

    splide.mount({BrandsAutoScroll})
  }
})