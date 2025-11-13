document.addEventListener('DOMContentLoaded', () => {
  const footerContainer = document.querySelector('.footer__container');
  if (footerContainer) {
    setFooterContainerBg(footerContainer);

    window.addEventListener('resize', () => setFooterContainerBg(footerContainer))
  }
})

function setFooterContainerBg(footerContainer) {
  if (!footerContainer) return;

  const gridAreas = getComputedStyle(footerContainer).getPropertyValue('grid-template-areas');
  if (!gridAreas.trim()) return;

  const is = footerContainer.querySelectorAll('i');

  const gridAreasArr = gridAreas.replaceAll('"', '').split(' ');
  for (let index = 0; index < gridAreasArr.length; index++) {
    const gridArea = gridAreasArr[index];
    if (!gridArea.includes('bg')) continue;

    const i = document.createElement('i');
    i.style = `grid-area: ${gridArea};`
    footerContainer.append(i)
  }
  
  if (is.length) is.forEach(e => e.remove());
}