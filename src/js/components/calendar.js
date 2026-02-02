const MS_PER_DAY = 24 * 60 * 60 * 1000;

window.MhzSchedule = class {
  constructor({
    parentSelector,
    filtersSelector,
    bodySelector,
    initialDate = new Date(),
    ajaxPath,
    method,
    idPrefix = 'mhz-event-'
  }) {
    if (!parentSelector||!filtersSelector||!bodySelector) return;

    this.parent = typeof parentSelector === 'string' ? document.querySelector(parentSelector) : parentSelector;
    if (!this.parent) return;
    this.filters = typeof filtersSelector === 'string' ? this.parent.querySelector(filtersSelector) : filtersSelector;
    this.body = typeof bodySelector === 'string' ? this.parent.querySelector(bodySelector) : bodySelector;
    this.date = new Date(initialDate);
    this.idPrefix = idPrefix;

    this.isDevMode = this.parent.hasAttribute('data-dev');

    this.path = ajaxPath;
    this.method = method.toUpperCase();

    if (!this.isValidDate(this.date)) return;

    this.init();
  }

  isValidDate(value) {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);

      if (isNaN(date.getTime())) return false;

      if (typeof value === 'string') {
        return !Number.isNaN(Date.parse(value));
      }

      return true;
    }

    return false;
  }

  init() {
    this.body.innerHTML = '';
    this.createHead();
    this.createGrid();
    this.createEventsEl();
    this.action();
    this.setHandlers();
  }

  async action() {
    await this.getEvents();
    this.days = this.buildMonthGrid(this.date);
    this.fillMonthGrid();

    this.splittedEvents = this.splitEventsForGrid(this.events, this.date);
    this.fillGridEvents();
    
    this.fillEvents();
  }

  setHandlers() {
    this.parent.addEventListener('selectCallback', this.action.bind(this));

    this.prevArrow.addEventListener('click', () => {
      this.date.setMonth(this.date.getMonth() - 1);
      this.action();
    })
    this.nextArrow.addEventListener('click', () => {
      this.date.setMonth(this.date.getMonth() + 1);
      this.action();
    })
  }

  createHead() {
    this.head = document.createElement('div');
    this.head.classList.add('mhz-calendar__head');

    this.prevArrow = document.createElement('div');
    this.prevArrow.classList.add('mhz-calendar__arrow');
    this.prevArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_766_15664)"><path d="M5 12H19" stroke="white" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12L11 18" stroke="white" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12L11 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_766_15664"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>`;


    this.title = document.createElement('div');
    this.title.classList.add('mhz-calendar__title');

    this.nextArrow = document.createElement('div');
    this.nextArrow.classList.add('mhz-calendar__arrow');
    this.nextArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_766_15666)"><path d="M19 12H5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12L13 18" stroke="white" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12L13 6" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_766_15666"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>`;

    
    this.head.appendChild(this.prevArrow);
    this.head.appendChild(this.title);
    this.head.appendChild(this.nextArrow);

    this.body.appendChild(this.head);
  }

  createGrid() {
    this.gridEl = document.createElement('div');
    this.gridEl.classList.add('mhz-calendar__grid');
    this.body.appendChild(this.gridEl);

    this.gridEl.style.setProperty('--cell-size', `${this.gridEl.offsetWidth / 7}px`)
  }

  createEventsEl() {
    this.eventsEl = document.createElement('div');
    this.eventsEl.classList.add('mhz-calendar__events');
    this.body.appendChild(this.eventsEl);
  }

  async getEvents() {
    this.parent.classList.add('_pen');
    if (this.isDevMode) {
      const monthStr = this.date.getMonth() + 1;
      const year = this.date.getFullYear();
      this.events = [
        {
          id: 0,
          begin: `${year}-${monthStr}-09`,
          end: `${year}-${monthStr}-12`,
          name: 'MicroPave: базовый курс закрепки бриллиантов',
          format: 'Оффлан',
          lang: 'Русский, Английский',
          link: '#',
          price: 80000
        },
        {
          id: 1,
          begin: `${year}-${monthStr}-22`,
          end: `${year}-${monthStr}-26`,
          name: 'Курс подготовки профессинальных закрепщиков',
          format: 'Оффлан',
          lang: 'Русский, Английский',
          link: '#',
          price: 190000
        },
        // {
        //   id: 2,
        //   begin: `${year}-${monthStr}-09`,
        //   end: `${year}-${monthStr}-12`,
        //   name: 'MicroPave: базовый курс закрепки бриллиантов',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 80000
        // },
        // {
        //   id: 3,
        //   begin: `${year}-${monthStr}-22`,
        //   end: `${year}-${monthStr}-26`,
        //   name: 'Курс подготовки профессинальных закрепщиков',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 190000
        // },
        // {
        //   id: 4,
        //   begin: `${year}-${monthStr}-09`,
        //   end: `${year}-${monthStr}-12`,
        //   name: 'MicroPave: базовый курс закрепки бриллиантов',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 80000
        // },
        // {
        //   id: 5,
        //   begin: `${year}-${monthStr}-22`,
        //   end: `${year}-${monthStr}-26`,
        //   name: 'Курс подготовки профессинальных закрепщиков',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 190000
        // },
        // {
        //   id: 6,
        //   begin: `${year}-${monthStr}-09`,
        //   end: `${year}-${monthStr}-12`,
        //   name: 'MicroPave: базовый курс закрепки бриллиантов',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 80000
        // },
        // {
        //   id: 7,
        //   begin: `${year}-${monthStr}-22`,
        //   end: `${year}-${monthStr}-26`,
        //   name: 'Курс подготовки профессинальных закрепщиков',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 190000
        // },
        // {
        //   id: 8,
        //   begin: `${year}-${monthStr}-09`,
        //   end: `${year}-${monthStr}-12`,
        //   name: 'MicroPave: базовый курс закрепки бриллиантов',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 80000
        // },
        // {
        //   id: 9,
        //   begin: `${year}-${monthStr}-22`,
        //   end: `${year}-${monthStr}-26`,
        //   name: 'Курс подготовки профессинальных закрепщиков',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 190000
        // },
        // {
        //   id: 10,
        //   begin: `${year}-${monthStr}-09`,
        //   end: `${year}-${monthStr}-12`,
        //   name: 'MicroPave: базовый курс закрепки бриллиантов',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 80000
        // },
        // {
        //   id: 11,
        //   begin: `${year}-${monthStr}-22`,
        //   end: `${year}-${monthStr}-26`,
        //   name: 'Курс подготовки профессинальных закрепщиков',
        //   format: 'Оффлан',
        //   lang: 'Русский, Английский',
        //   link: '#',
        //   price: 190000
        // },
      ]
    } else {
      const body = this.getAjaxBody();
      let url = this.path;
      const options = {
        method: this.method
      }
  
      if (this.method === 'GET') {
        const params = new URLSearchParams(body).toString();
        url = `${url}?${params}`;
      } else {
        options.body = body;
      }
  
      await fetch(url, options)
        .then(res => res.json())
        .then(res => {
          this.events = res;
        })
        .catch(err => {
          console.warn(err)
          this.events = [];
        })
    }

    setTimeout(() => {
      this.parent.classList.remove('_pen');
    }, 0);
  }

  getAjaxBody() {
    let filtersEl;
    if (this.filters.tagName === 'FORM') {
      filtersEl = this.filters
    } else {
      filtersEl = document.createElement('form');
      filtersEl.innerHTML = this.filters.innerHTML;
    }

    const fd = new FormData(filtersEl);

    fd.set('date', this.date);

    return fd;
  }

  buildMonthGrid(input) {
    const baseDate = new Date(input);
    if (isNaN(baseDate)) return [];

    const year = baseDate.getUTCFullYear();
    const month = baseDate.getUTCMonth();

    const result = [];

    const firstOfMonth = new Date(Date.UTC(year, month, 1));
    const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));

    // 1 (пн) ... 7 (вс)
    const getColumn = (date) =>
      date.getUTCDay() === 0 ? 7 : date.getUTCDay();

    // сегодня в UTC (обрезаем время)
    const now = new Date();
    const todayUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )).getTime();

    // начало сетки
    const start = new Date(firstOfMonth);
    start.setUTCDate(start.getUTCDate() - (getColumn(start) - 1));

    // конец сетки
    const end = new Date(lastOfMonth);
    end.setUTCDate(end.getUTCDate() + (7 - getColumn(end)));

    let row = 2;
    let current = new Date(start);

    while (current <= end) {
      const column = getColumn(current);

      if (column === 1 && current.getTime() !== start.getTime()) {
        row++;
      }

      const currentDayUTC = new Date(Date.UTC(
        current.getUTCFullYear(),
        current.getUTCMonth(),
        current.getUTCDate()
      )).getTime();

      result.push({
        date: current.toISOString(),
        column,
        row,
        isToday: currentDayUTC === todayUTC,
        // опционально:
        isCurrentMonth: current.getUTCMonth() === month
      });

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return result;
  }

  fillMonthGrid() {
    if (!this.days.length||!this.gridEl) return;

    const currDay = this.days.find(day => day.isCurrentMonth);
    const monthName = new Date(currDay.date).toLocaleDateString('ru-RU', {month: 'long'});
    let title = monthName.replace(monthName[0], monthName[0].toUpperCase())
    if (new Date(currDay.date).getFullYear() !== new Date().getFullYear()) title += ` ${new Date(currDay.date).getFullYear()}`;
    this.title.innerHTML = title;

    this.gridEl.innerHTML = `<div class="mhz-calendar__weekday">Пн</div><div class="mhz-calendar__weekday">Вт</div><div class="mhz-calendar__weekday">Ср</div><div class="mhz-calendar__weekday">Чт</div><div class="mhz-calendar__weekday">Пт</div><div class="mhz-calendar__weekday">Сб</div><div class="mhz-calendar__weekday">Вс</div>`

    for (let index = 0; index < this.days.length; index++) {
      const day = this.days[index];

      const dayEl = document.createElement('div');
      dayEl.classList.add('mhz-calendar__day');
      if (day.isToday) {
        dayEl.classList.add('_today');
      }
      dayEl.setAttribute('data-date', day.date);

      dayEl.style.setProperty('--row-start', day.row);
      dayEl.style.setProperty('--column-start', day.column);

      if (day.isCurrentMonth) {
        dayEl.innerHTML = new Date(day.date).getDate();
      }

      this.gridEl.appendChild(dayEl);
    }
  }

  normalizeToUTCDate(value) {
    if (value instanceof Date) {
      return new Date(Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      ));
    }

    if (typeof value === 'string') {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(Date.UTC(y, m - 1, d));
    }

    return null;
  }

  splitEventsForGrid(events, gridMonthDate) {
    const result = [];
    if (!events.length || !this.isValidDate(gridMonthDate)) return result;

    const monthStart = new Date(Date.UTC(
      gridMonthDate.getUTCFullYear(),
      gridMonthDate.getUTCMonth(),
      1
    ));

    events.forEach(event => {
      const startDate = this.normalizeToUTCDate(event.begin);
      const endDate = this.normalizeToUTCDate(event.end);

      if (!startDate || !endDate || startDate > endDate) return;

      let current = new Date(startDate);

      while (current <= endDate) {
        const columnStart = current.getUTCDay() === 0 ? 7 : current.getUTCDay();

        const diffDays = Math.floor((current - monthStart) / MS_PER_DAY);
        const firstCol = monthStart.getUTCDay() === 0 ? 7 : monthStart.getUTCDay();
        const row = Math.floor((diffDays + firstCol - 1) / 7) + 2;

        const daysToWeekEnd = 7 - columnStart;
        const segmentEnd = new Date(
          Math.min(
            current.getTime() + daysToWeekEnd * MS_PER_DAY,
            endDate.getTime()
          )
        );

        const columnEnd =
          (segmentEnd.getUTCDay() === 0 ? 7 : segmentEnd.getUTCDay()) + 1;

        result.push({
          ...event,

          segmentBegin: current.toISOString(),
          segmentEnd: segmentEnd.toISOString(),

          style: {
            '--row-start': row,
            '--column-start': columnStart,
            '--column-end': columnEnd,
          },
        });

        current = new Date(segmentEnd.getTime() + MS_PER_DAY);
      }
    });

    return result;
  }

  fillGridEvents() {
    if (!this.splittedEvents.length||!this.gridEl) return;

    for (let index = 0; index < this.splittedEvents.length; index++) {
      const event = this.splittedEvents[index];
      if (!event.style) continue;

      const gridEventEl = document.createElement('div');
      gridEventEl.classList.add('mhz-calendar__gridevent');

      for (let index = 0; index < Object.keys(event.style).length; index++) {
        const key = Object.keys(event.style)[index];
        const value = event.style[key];
        gridEventEl.style.setProperty(key, value);
      }

      const isPopup = this.parent.closest('.popup');
      gridEventEl.setAttribute('data-goto', `#${this.idPrefix}${event.id}`);
      if (!isPopup) {
        gridEventEl.setAttribute('data-goto-header', ``);
      }

      const startDay = new Date(event.begin).getDate();
      const endDay = new Date(event.end).getDate();

      let dateStr = startDay;
      if (endDay !== startDay) {
        dateStr += ` - ${endDay}`
      }
      dateStr += ` ${this.getMonthGenitive(new Date(event.begin))}`

      gridEventEl.innerHTML = `<div class="mhz-calendar__eventdate">${dateStr}</div><div class="mhz-calendar__eventname">${event.name}</div>`;

      this.gridEl.appendChild(gridEventEl);
    }
  }

  getMonthGenitive(date) {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
      .format(date)
      .replace(/^\d+\s/, '');
  }

  fillEvents() {
    if (!this.eventsEl) return;

    this.eventsEl.innerHTML = '';

    for (let index = 0; index < this.events.length; index++) {
      const event = this.events[index];

      const eventEl = document.createElement('div');
      eventEl.className = 'mhz-calendar__event event-mhz-calendar';
      eventEl.id = `${this.idPrefix}${event.id}`;
      
      const startDay = new Date(event.begin).getDate();
      const endDay = new Date(event.end).getDate();

      let dateStr = startDay;
      if (endDay !== startDay) {
        dateStr += ` - ${endDay}`
      }
      dateStr += ` ${this.getMonthGenitive(new Date(event.begin))}`;
      if (new Date(event.begin).getFullYear() !== new Date().getFullYear()) {
        dateStr += ` ${new Date(event.begin).getFullYear()}`;
      }

      eventEl.innerHTML = `<div class="event-mhz-calendar__name"><div class="event-mhz-calendar__date"><i><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_997_31842)"><path d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#0F1C2E" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3V7" stroke="#0F1C2E" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 3V7" stroke="#0F1C2E" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 11H20" stroke="#0F1C2E" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_997_31842"><rect width="24" height="24" fill="white"/></clipPath></defs></svg></i><span>${dateStr}</span></div><p>${event.name}</p></div><ul class="event-mhz-calendar__info">${event.format ? `<li><span>Формат:</span><span>${event.format}</span></li>` : ''}${event.lang ? `<li><span>Язык:</span><span>${event.lang}</span></li>` : ''}</ul>${event.price ? `<div class="event-mhz-calendar__price">${typeof event.price === 'string' ? event.price : this.formatPrice(event.price)}</div>` : ''}${event.link ? `<a href="${event.link}" class="event-mhz-calendar__button btn btn-black">Подробнее о курсе</a>` : '<i></i>'}`

      this.eventsEl.appendChild(eventEl)
    }
  }

  formatPrice(value) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(value);
  }
}

document.addEventListener('click', (e) => e.target.closest('[data-calendar-settings]') && onCalendarSettingsClick(e.target.closest('[data-calendar-settings]')))

function onCalendarSettingsClick(target) {
  if (!window.mhzScheduleInPopup) return;

  const attr = target.getAttribute('data-calendar-settings');
  let settings;
  try {
    settings = JSON.parse(attr);
  } catch (error) {
    console.warn(error);
  }

  if (!settings) return;

  const filtersEl = window.mhzScheduleInPopup.filters;

  for (let index = 0; index < Object.keys(settings).length; index++) {
    const key = Object.keys(settings)[index];
    const value = settings[key];

    const el = filtersEl.querySelector(`[name="${key}"]`);
    if (!el) continue;

    el.value = value;

    el.dispatchEvent(new CustomEvent('change', {bubbles: true, detail:{isCustom: true}}))
  }

  window.mhzScheduleInPopup.getEvents();
}