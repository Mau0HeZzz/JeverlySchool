/* Маски для полей (в работе)*/

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

document.addEventListener('DOMContentLoaded', () => {
  const inputMasks = document.querySelectorAll('input');
  if (inputMasks.length) {
    if (!window.mhzModules) {
      window.mhzModules = {}
    }
    window.mhzModules.inputmask = Inputmask().mask(inputMasks);
  }
})