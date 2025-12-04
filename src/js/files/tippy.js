// Подключение функционала "Чертоги Фрилансера"
import { isMobile, FLS } from "./functions.js";

// Подключение с node_modules
import tippy from 'tippy.js';

// Подключение стилей с src/scss/libs
import "../../scss/libs/tippy.scss";
// Подключение стилей с node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей
if (!window.mhzModules) {
  window.mhzModules = {}
}
window.mhzModules.tippy = tippy('[data-tippy-content]', {

});