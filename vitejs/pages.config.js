import { resolve } from 'path'

const pages = [
  {name: 'index', path: resolve(__dirname, '../index.html')},
  {name: 'home', path: resolve(__dirname, '../pages/home.html')},
  {name: '404', path: resolve(__dirname, '../pages/404.html')},

  {name: 'style', path: resolve(__dirname, '../src/scss/style.scss')},
  {name: 'header', path: resolve(__dirname, '../src/scss/components/header.scss')},
  {name: 'footer', path: resolve(__dirname, '../src/scss/components/footer.scss')},

  {name: 'headerjs', path: resolve(__dirname, '../src/js/components/header.js')},
  {name: 'footerjs', path: resolve(__dirname, '../src/js/components/footer.js')},
];

export default pages