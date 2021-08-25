import App from './app.js';
const app = new App();

const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  document.getElementById('menu').classList.add('display-none');
  document.getElementById('gesture-learning-container').classList.remove('display-none');
  app.init();
})
