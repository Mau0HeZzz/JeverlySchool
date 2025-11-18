document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.workplace__row');
  if (rows.length) {
    rows.forEach(row=> {
      const items = row.querySelectorAll('.workplace__item');
      if (items.length) {
        items.forEach((item, index) => {
          item.style.setProperty('--i', index+1);
        })
      }
    })
  }
})