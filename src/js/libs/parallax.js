class Parallax {
	constructor(elements) {
		if (elements.length) {
			this.elements = Array.from(elements).map((el) => (
				new Parallax.Each(el, this.options)
			));
		}
	}
	destroyEvents() {
		this.elements.forEach(el => {
			el.destroyEvents();
		})
	}
	setEvents() {
		this.elements.forEach(el => {
			el.setEvents();
		})
	}

}
Parallax.Each = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll('[data-prlx]');
		this.animation = this.animationFrame.bind(this);
		this.offset = 0;
		this.value = 0;
		this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
    this.isStarted = true;

    this.mediaHandler();
		// this.setEvents();
	}
  mediaHandler() {
    const attr = this.parent.getAttribute('data-prlx-parent');
    if (!attr) {
      this.setEvents();
      return;
    }

    const attrArr = attr.split(',').map(str => str.trim());
    const media = window.matchMedia(`(${attrArr[1]}-width: ${attrArr[0]}px)`);
    if (media.matches) {
      this.setEvents();
    }

    media.addEventListener('change', (e) => {
      if (e.matches) {
        if (!this.isStarted) {
          this.setEvents();
        }
      } else {
        if (this.isStarted) {
          this.destroyEvents();
        }
      }
    })
  }
	setEvents() {
    this.animationID = window.requestAnimationFrame(this.animation);
    this.isStarted = true;
	}
	destroyEvents() {
    window.cancelAnimationFrame(this.animationID);
    this.elements.forEach(el => el.style.removeProperty('transform'));
    this.isStarted = false;
	}
	animationFrame() {
		const topToWindow = this.parent.getBoundingClientRect().top;
		const heightParent = this.parent.offsetHeight;
		const heightWindow = window.innerHeight;
		const positionParent = {
			top: topToWindow - heightWindow,
			bottom: topToWindow + heightParent,
		}
		const centerPoint = this.parent.dataset.prlxCenter ?
			this.parent.dataset.prlxCenter : 'center';

		if (positionParent.top < 30 && positionParent.bottom > -30) {
			//Элемент в исходном положении (0,0), когда отец находится по отношению к экрану:
			switch (centerPoint) {
				// верхней точке (начало родителя сталкивается верхнего края экрана)
				case 'top':
					this.offset = -1 * topToWindow;
					break;
				// центре экрана (середина родителя внутри экрана)
				case 'center':
					this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
					break;
				// Начало: нижняя часть экрана = верхняя часть родителя
				case 'bottom':
					this.offset = heightWindow - (topToWindow + heightParent);
					break;
			}
		}

		this.value += (this.offset - this.value) / this.smooth;
		this.animationID = window.requestAnimationFrame(this.animation);

		this.elements.forEach(el => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : 'v',
				direction: el.dataset.direction ? el.dataset.direction + '1' : '-1',
				coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
				additionalProperties: el.dataset.properties ? el.dataset.properties : '',
			}
			this.parameters(el, parameters);
		})
	}
	parameters(el, parameters) {
		if (parameters.axis == 'v') {
			el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`
		} else if (parameters.axis == 'h') {
			el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`
		}
	}
}
if (document.querySelector('[data-prlx-parent]')) {
  if (!window.mhzModules) {
    window.mhzModules = {}
  }
	window.mhzModules.parallax = new Parallax(document.querySelectorAll('[data-prlx-parent]'));
}
