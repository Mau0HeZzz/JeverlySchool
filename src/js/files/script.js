// Подключение функционала "Чертоги Фрилансера"
import { isMobile } from "./functions.js";


document.addEventListener('DOMContentLoaded', () => {
  const mds = [...document.querySelectorAll('[class*="_md-"]'), ...document.querySelectorAll('[class*="_mmd-"]')];
  if (mds.length) {
    setMdStyles(mds)
  }
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

function setMdStyles(mds) {
  if (!mds.length) return;
  const style = document.createElement('style');
  const mdClasses = [];
  const mmdClasses = [];

  mds.forEach(md => {
    const classes = Array.from(md.classList)
    for (let index = 0; index < classes.length; index++) {
      const className = classes[index];
      if (className.startsWith('_md')&&!mdClasses.includes(className)) {
        mdClasses.push(className)
      }
      if (className.startsWith('_mmd')&&!mmdClasses.includes(className)) {
        mmdClasses.push(className)
      }
    }
  })

  const mdString = mdClasses.map(mdClass => {
    const size = mdClass.split('-')[1];
    return `@media (width < ${size}px){.${mdClass} {display: none;}}`
  })
  const mmdString = mmdClasses.map(mmdClass => {
    const size = mmdClass.split('-')[1];
    return `@media (width >= ${size}px){.${mmdClass}{display: none;}}`
  })

  style.innerHTML = `${mdString.join('\n')}\n${mmdString.join('\n')}`;
  document.body.appendChild(style);
}