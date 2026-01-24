import { resolve } from 'path'

const pages = [
  {name: 'index', path: resolve(__dirname, '../index.html')},
  {name: 'home', path: resolve(__dirname, '../pages/home.html')},
  {name: '404', path: resolve(__dirname, '../pages/404.html')},
  {name: 'blog', path: resolve(__dirname, '../pages/blog.html')},
  {name: 'workspace', path: resolve(__dirname, '../pages/workspace.html')},
  {name: 'about', path: resolve(__dirname, '../pages/about.html')},
  {name: 'professors', path: resolve(__dirname, '../pages/professors.html')},

  {name: 'style', path: resolve(__dirname, '../src/scss/style.scss')},
  {name: 'header', path: resolve(__dirname, '../src/scss/components/header.scss')},
  {name: 'footer', path: resolve(__dirname, '../src/scss/components/footer.scss')},
  {name: 'scroll-parallax', path: resolve(__dirname, '../src/scss/components/scroll-parallax.scss')},
  {name: '404-css', path: resolve(__dirname, '../src/scss/components/404.scss')},
  {name: 'navhero', path: resolve(__dirname, '../src/scss/components/navhero.scss')},
  {name: 'blog-css', path: resolve(__dirname, '../src/scss/components/blog.scss')},
  {name: 'workspace-css', path: resolve(__dirname, '../src/scss/components/workspace.scss')},
  {name: 'prefooter-css', path: resolve(__dirname, '../src/scss/components/prefooter.scss')},
  {name: 'fullhero-css', path: resolve(__dirname, '../src/scss/components/fullhero.scss')},
  {name: 'tech-cards-css', path: resolve(__dirname, '../src/scss/components/tech-cards.scss')},
  {name: 'history-css', path: resolve(__dirname, '../src/scss/components/history.scss')},
  {name: 'brands-css', path: resolve(__dirname, '../src/scss/components/brands.scss')},
  {name: 'recognize-css', path: resolve(__dirname, '../src/scss/components/recognize.scss')},
  {name: 'masters-reviews-css', path: resolve(__dirname, '../src/scss/components/masters-reviews.scss')},
  {name: 'professors-css', path: resolve(__dirname, '../src/scss/components/professors.scss')},

  {name: 'header-js', path: resolve(__dirname, '../src/js/components/header.js')},
  {name: 'footer-js', path: resolve(__dirname, '../src/js/components/footer.js')},
  {name: 'footer-js', path: resolve(__dirname, '../src/js/components/footer.js')},
  {name: 'scroll-parallax-js', path: resolve(__dirname, '../src/js/components/scroll-parallax.js')},
  {name: 'workspace-js', path: resolve(__dirname, '../src/js/components/workspace.js')},
  {name: 'history-js', path: resolve(__dirname, '../src/js/components/history.js')},
  {name: 'brands-js', path: resolve(__dirname, '../src/js/components/brands.js')},
  {name: 'masters-reviews-js', path: resolve(__dirname, '../src/js/components/masters-reviews.js')},
  {name: 'professors-js', path: resolve(__dirname, '../src/js/components/professors.js')},
];

export default pages