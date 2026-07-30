const coursePopupId = String(window.coursePopupId ?? 82).match(/^\d+$/)?.[0] ?? '82';
let coursePopupObserver;

const getCoursePopupLink = () => [...document.querySelectorAll('.b24-form-sign-abuse-link')].find((link) => (
  new URL(link.href, window.location.href).searchParams.get('b24_form_id') === coursePopupId
));

const customizeCoursePopup = () => {
  const coursePopupLink = getCoursePopupLink();
  const coursePopup = coursePopupLink?.closest('.b24-form');
  const title = coursePopup?.querySelector('.b24-form-header-title');
  const content = coursePopup?.querySelector('.b24-form-content');
  const form = content?.querySelector('form');
  const submitButton = form?.querySelector('.b24-form-btn[type="submit"]');

  if (!coursePopup || !title || !content || !form || !submitButton) return false;

  coursePopup.classList.add('course-b24-popup');

  if (title.textContent.trim() !== 'Дайте нам знать — и мы предложим лучшее') {
    title.textContent = 'Дайте нам знать — и мы предложим лучшее';
  }

  if (submitButton.textContent.trim() !== 'Оставить заявку') {
    submitButton.textContent = 'Оставить заявку';
    submitButton.setAttribute('aria-label', 'Оставить заявку');
  }

  if (!content.querySelector('.course-b24-popup__schedule')) {
    const schedule = document.createElement('div');
    const workTime = document.createElement('p');
    const responseTime = document.createElement('p');

    schedule.className = 'course-b24-popup__schedule';
    workTime.textContent = 'Работаем пн-пт с 9:00 до 18:00 по Мск';
    responseTime.textContent = 'Свяжемся с вами в течение часа';
    schedule.append(workTime, responseTime);
    form.insertAdjacentElement('afterend', schedule);
  }

  return true;
}

const observeCoursePopup = () => {
  if (customizeCoursePopup() || coursePopupObserver) return;

  coursePopupObserver = new MutationObserver(() => {
    if (!customizeCoursePopup()) return;

    coursePopupObserver.disconnect();
    coursePopupObserver = null;
  });
  coursePopupObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

window.addEventListener('b24:form:init', (event) => {
  if (String(event.detail?.object?.identification?.id) !== coursePopupId) return;

  observeCoursePopup();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const coursePopupLoader = document.querySelector(
      `[data-b24-form^="click/${coursePopupId}/"], [data-b24-form^="inline/${coursePopupId}/"]`
    );
    const coursePopupLink = getCoursePopupLink();

    if (coursePopupLoader || coursePopupLink) {
      observeCoursePopup();
    }
  }, {once: true});
} else if (
  document.querySelector(`[data-b24-form^="click/${coursePopupId}/"], [data-b24-form^="inline/${coursePopupId}/"]`)
  || getCoursePopupLink()
) {
  observeCoursePopup();
}
