import LazyLoad from "vanilla-lazyload";


document.addEventListener('DOMContentLoaded', () => {
  // Работает с объектами с классом ._lazy
  const lazyMedia = new LazyLoad({
    elements_selector: '[data-src],[data-srcset]',
    class_loaded: '_lazy-loaded',
    use_native: false
  });

  if (!window.mhzModules) window.mhzModules = {};

  window.mhzModules.lazyMedia = lazyMedia;
})

// Обновить модуль
//lazyMedia.update();