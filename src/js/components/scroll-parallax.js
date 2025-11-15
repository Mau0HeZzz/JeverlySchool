document.addEventListener('DOMContentLoaded', () => {
  const parallaxBgEls = document.querySelectorAll('[data-parallax-bg]');
  if (parallaxBgEls.length) {
    parallaxBgEls.forEach(parallaxBgEl => parallaxBgActions(parallaxBgEl))
  }
})

function parallaxBgActions(parallaxBgEl) {
  if (!parallaxBgEl) return;

  const wrapper = parallaxBgEl.querySelector('[data-parallax-bg-wrapper]');
  const bg = parallaxBgEl.querySelector('[data-parallax-bg-bg]');

  if (!wrapper||!bg) return;

  let percents = 1;
  const percentsAttr = wrapper.getAttribute('data-parallax-bg-offset-percents');
  if (percentsAttr&&!isNaN(Number(percentsAttr))) {
    percents = Number(percentsAttr);

    if (percents > 1) {
      percents = 1
    }
    if (percents < 0) {
      percents = 0.1
    }
  }

  let direction = -1;
  const directionAttr = wrapper.getAttribute('data-parallax-bg-bg-direction');
  if (directionAttr === 'up') {
    direction = 1;
  }

  let bgOffset = 0.2;
  const bgOffsetAttr = bg.getAttribute('data-parallax-bg-bg-offset');
  if (bgOffsetAttr&&!isNaN(Number(bgOffsetAttr))) {
    bgOffset = Number(bgOffsetAttr);

    if (bgOffset > 1) bgOffset = 1;
    if (bgOffset < 0) bgOffset = 0;
  }

  bg.style.setProperty('--bg-offset', `${bgOffset * 100}%`);

  setTimeout(() => {
    setParallaxBgOffset({wrapper, bg, percents, bgOffset, direction});
    window.addEventListener('scroll', () => setParallaxBgOffset({wrapper, bg, percents, bgOffset, direction}))
  }, 0);
}

function setParallaxBgOffset({wrapper, bg, percents, bgOffset, direction}) {
  const { height, top } = wrapper.getBoundingClientRect();
  const maxOffset = height * bgOffset;
  const minOffset = height * bgOffset * -1;

  let headerHeight = 0;
  const header = document.querySelector('.header');
  if (header) {
    const headerPos = getComputedStyle(header).getPropertyValue('position');
    if (headerPos === 'fixed') {
      headerHeight = 130;
    }
  }
  
  let offset = (top - headerHeight) * percents;
  if (offset > maxOffset) offset = maxOffset;
  if (offset < minOffset) offset = minOffset;

  bg.style.setProperty('--offset', `${offset * direction}px`);
}