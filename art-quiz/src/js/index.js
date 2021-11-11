//imports

// import './css/style.css';


//variables

const settingsButton = document.querySelector('.settings');
const homeButton = document.querySelectorAll('.home');
const mainPage = document.querySelector('.main');
const artistsPage = document.querySelector('.artists_main');
const picturePage = document.querySelector('.picture_main')
const quizPage = document.querySelector('.quiz_main');
const artists = document.querySelector('.artists');
const pictures = document.querySelector('.pictures')


let currentPage = mainPage;

//events

artists.addEventListener('click', () => openPage(artistsPage));
for(let i of homeButton) {
  i.addEventListener('click', () => openPage(mainPage));
}
pictures.addEventListener('click', () => openPage(picturePage));


//functions 

function openPage(pageElement) {
  pageElement.classList.add('active');
  pageElement.classList.remove('hide');
  currentPage.classList.add('hide')

  currentPage = pageElement;
};

