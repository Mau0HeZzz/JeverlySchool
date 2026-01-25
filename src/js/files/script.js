// Подключение функционала "Чертоги Фрилансера"
import { isMobile } from "./functions.js";


document.addEventListener('DOMContentLoaded', () => {

})

export function setMaxHeight(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.removeProperty('--min-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.max(...heights);
  
    els.forEach(el => el.style.setProperty('--min-height', `${max}px`));
  })
}

export function setMinHeight(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.remoiveProperty('--max-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.min(...heights);
  
    els.forEach(el => el.style.setProperty('--max-height', `${max}px`));
  })
}

export function setMaxWidth(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.removeProperty('--min-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.max(...heights);
  
    els.forEach(el => el.style.setProperty('--min-height', `${max}px`));
  })
}

export function setMinWidth(selector, parentSelector) {
  const parents = parentSelector ? document.querySelectorAll(parentSelector) : [document];
  if (!parents.length) return;

  parents.forEach(parent => {
    const els = parent.querySelectorAll(selector);
  
    if (!els.length) return;
    els.forEach(el => el.style.remoiveProperty('--max-height'));
  
    const heights = [...els].map(el => el.offsetHeight);
    const max = Math.min(...heights);
  
    els.forEach(el => el.style.setProperty('--max-height', `${max}px`));
  })
}