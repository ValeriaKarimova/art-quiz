//imports

// import './css/style.css';


//variables

const settingsButton = document.querySelector('.settings');
const bodyDiv = document.querySelector("body");
const homeButton = document.querySelectorAll('.home');
const mainPage = document.querySelector('.main');
const artistsPage = document.querySelector('.artists_main');
const picturePage = document.querySelector('.picture_main')
const quizPage = document.querySelector('.quiz_main');
const artists = document.querySelector('.artists');
const pictures = document.querySelector('.pictures');
const kindTemplate = '<div class="kind_item"><img src="{{image}}" alt="picture"><h2>{{title}}</h2></div>';
const kindsRoot = document.querySelector('.quizes_kinds');
const categoryTemplate = '<div class="round"><img src="{{image}}" alt="picture"><div class="overlay {{extra}}"><h4>{{title}}</h4></div></div>';
const categoryRoot = document.querySelector('.categories');
const quizTemplate = '<div class="picture_question"><img src="{{image}}" alt="picture">{{pagination}}</div><div class="answers">{{options}}</div>';
const optionTemplate = '<div class="option" data-image-num={{imageNum}}><h5>{{title}}</h5></div>';
const quizRoot = document.querySelector('.quiz');
const rightOverlayTemplate = '<div class="answer_overlay"><div class="basis"><div><img class="icon" src="images/other/true.png" alt="img"></div><div><img class="basis_img" src="{{img}}" alt="image"></div><div class="image_description"><p>{{title}}</p><p>{{name}}</p><p>{{year}}</p></div><div><button><span>next</span></button></div></div></div>';
const falseOverlayTemplate = '<div class="answer_overlay"><div class="basis"><div><img class="icon" src="images/other/false.png" alt="img"></div><div><img class="basis_img" src="{{img}}" alt="image"></div><div class="image_description"><p>{{title}}</p><p>{{name}}</p><p>{{year}}</p></div><div><button><span>next</span></button></div></div></div>';
const resultTemplate = '<div class="result_overlay"><div class="result_basis"><div class="results_description"><p>Congratulations!</p><p>Правильных ответов: {{result}}</p></div><div><img src="images/other/finish.png" alt="img"></div><div><button class="ok_button"><span>Ok</span></button></div></div></div>';




let structureData;
let factsData;
let currentPage = mainPage;
let answerIndex = 0;
let answerHistory = [];
let correctAnswers = 0;
let savedResults;
let pagination = document.createElement('div');
pagination.classList.add('pagination');


for(let i = 0; i < 10; i++){
  const emptyCircle = document.createElement('div');
  emptyCircle.classList.add('empty');
  pagination.append(emptyCircle);
}




//events


for(let i of homeButton) {
  i.addEventListener('click', () => openPage(mainPage));
}



//functions 

function openPage(pageElement) {
  if (pageElement == currentPage) return;

  pageElement.classList.add('active');
  pageElement.classList.remove('hide');
  currentPage.classList.add('hide')

  currentPage = pageElement;
};

function createElementFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div; 
};

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getUniqueIndex(input, indexes) {
  let index = Math.floor(Math.random()*(input.length - 1));

  while (indexes.includes(index)) {
    index = Math.floor(Math.random()*(input.length - 1));
  }
  return index;
}

function getOptions (factsData, factIndex) {
  let fact = factsData[factIndex];
  let randomIndex1 = getUniqueIndex(factsData, [factIndex]);
  let randomFact1 = factsData[randomIndex1];
  let randomIndex2 = getUniqueIndex(factsData, [factIndex, randomFact1]);
  let randomFact2 = factsData[randomIndex2];
  let randomIndex3 = getUniqueIndex(factsData, [factIndex, randomFact1, randomIndex2]);
  let randomFact3 = factsData[randomIndex3];
  let factsArray = [fact, randomFact1, randomFact2, randomFact3];
  shuffle(factsArray);
  return factsArray;
}

function getOptionHtml(options, factFieldName){
  let quizOptionHTML = '';

  for(let option of options) {
    let authorName = `${option[factFieldName]}`;
    quizOptionHTML += optionTemplate.replace('{{title}}', authorName).replace('{{imageNum}}', option.imageNum);
  }

  return quizOptionHTML;
}

function fillQuizCategory(kindData) {
  let groupsData = kindData.groups;
  categoryRoot.innerHTML = "";
  answerIndex = 0;
  answerHistory = [];
  for(let groupData of groupsData) {
    let key = getKey(kindData, groupData);
    let roundResult = getCorrectAnswersCount(key);
    let isDone = localStorage.getItem(key) !== null;
    let firstFact = factsData[groupData.answers[0]];
    let imageFactPath = `images/img/${firstFact.imageNum}.jpg`
    let groupHtml = categoryTemplate.replace('{{title}}', isDone ? `${roundResult}/10` : groupData.title)
      .replace('{{image}}', imageFactPath)
      .replace('{{extra}}', isDone ? 'no_overlay' : "");
    const round = createElementFromHTML(groupHtml);
    categoryRoot.appendChild(round);
    
    round.addEventListener('click', () => {
      answerIndex = 0;
      showQuestion(groupData, kindData)
    })
  }

  openPage(artistsPage);
}

function showQuestion(groupData, kindData) {
  quizRoot.innerHTML = "";
  
  let factIndex = groupData.answers[answerIndex];
  let correctFact = factsData[factIndex];
  let options = getOptions(factsData, factIndex);
  let quizOptionHTML = getOptionHtml(options, kindData.factFieldName);
  let imagePath = `images/img/${correctFact.imageNum}.jpg`;
  let quizHTML = quizTemplate.replace('{{image}}', imagePath)
    .replace('{{options}}', quizOptionHTML)
    .replace('{{pagination}}', pagination.outerHTML);

  const oneQuestion = createElementFromHTML(quizHTML);
  quizRoot.appendChild(oneQuestion);

  let paginationCircles = document.querySelectorAll('.empty');

  for (let index = 0; index < answerHistory.length; index++){

    let isCorrectAnswer = answerHistory[index];

    if (isCorrectAnswer) {
      paginationCircles[index].classList.add('green');
     } else {
      paginationCircles[index].classList.add('red');
     }

  }

  const variants = document.querySelectorAll('.option');
  for(let selectedOptionDiv of variants) {
    selectedOptionDiv.addEventListener('click', () => handleVariantClick(selectedOptionDiv, correctFact, kindData, groupData));
  }

  openPage(quizPage)
}


function handleVariantClick(selectedOptionDiv, correctFact, kindData, groupData) {
  
  let paginationCircles = document.querySelectorAll('.empty');

  let isCorrectAnswer = selectedOptionDiv.dataset.imageNum == correctFact.imageNum;
  answerHistory[answerIndex] = isCorrectAnswer;

  

  if(isCorrectAnswer) {
    showRightOverlay(correctFact, groupData, kindData);
    correctAnswers++;
    
  } else {
    showFalseOverlay (correctFact, groupData, kindData);
    answerHistory[answerIndex] = false;
  }   

  if (isCorrectAnswer) {
    paginationCircles[answerIndex].classList.add('green');
   } else {
    paginationCircles[answerIndex].classList.add('red');
   }

  
}

function handleNextClick(groupData, kindData, correctAnswers){

  answerIndex++;

  if (answerIndex < groupData.answers.length){
    showQuestion(groupData, kindData);
  }
  else{
    showResults(correctAnswers, kindData);
    saveQuizResults(kindData, groupData);
  }
}

function saveQuizResults(kindData, groupData) {
  let key = getKey(kindData, groupData);
  localStorage.setItem(key, JSON.stringify(answerHistory));
}

function getCorrectAnswersCount (key) {
  let stringJson = localStorage.getItem(key);
  if (stringJson === null) return 0;
  let resultArray = JSON.parse(stringJson);
  let oneQuizCount = resultArray.reduce((b, a) => b + (a ? 1 : 0), 0)
  return oneQuizCount;
}

function getKey (kindData, groupData) {
  let kindIndex = structureData.indexOf(kindData);
  let groupIndex = kindData.groups.indexOf(groupData);
  let key = `${kindIndex}_${groupIndex}`;
  return key;
}

function showRightOverlay (correctFact, groupData, kindData) {
  let imagePath = `images/img/${correctFact.imageNum}.jpg`;
  let overlayHtml = rightOverlayTemplate.replace('{{img}}', imagePath).replace('{{title}}', correctFact.author).replace('{{name}}', correctFact.name).replace('{{year}}', correctFact.year);
  let rightOverlay = createElementFromHTML(overlayHtml);
  bodyDiv.appendChild(rightOverlay);
  const nextBtn = document.querySelector('button');
  nextBtn.addEventListener('click', () => {
    handleNextClick(groupData, kindData, correctAnswers);
    bodyDiv.removeChild(rightOverlay);
  });
}

function showFalseOverlay (correctFact, groupData, kindData)  {
  let imagePath = `images/img/${correctFact.imageNum}.jpg`;
  let overlayHtml = falseOverlayTemplate.replace('{{img}}', imagePath).replace('{{title}}', correctFact.author).replace('{{name}}', correctFact.name).replace('{{year}}', correctFact.year);
  let falseOverlay = createElementFromHTML(overlayHtml);
  bodyDiv.appendChild(falseOverlay);
  const nextBtn = document.querySelector('button');
  nextBtn.addEventListener('click', () => {
    handleNextClick(groupData, kindData, correctAnswers);
    bodyDiv.removeChild(falseOverlay);
  });
}

function showResults(result, kindData) {
  let resultHtml = resultTemplate.replace('{{result}}', result);
  let resultOverlay = createElementFromHTML(resultHtml);
  bodyDiv.appendChild(resultOverlay);
  const okBtn = document.querySelector('.ok_button');
  okBtn.addEventListener('click', () => {
    fillQuizCategory(kindData);
    bodyDiv.removeChild(resultOverlay);
    correctAnswers = 0;
  });
}



















//async functions 

async function getJsonData(path) {
  const response = await fetch(path);
  const data = await response.json()
  return data;
}

async function fillQuizKinds() {
   structureData = await getJsonData('js/structure.json');
  factsData = await getJsonData('js/images.json');  
  for (let kindData of structureData) {
    let kindHtml = kindTemplate.replace('{{image}}', kindData.image).replace('{{title}}', kindData.title);
    const element = createElementFromHTML(kindHtml);
    kindsRoot.appendChild(element);
    element.addEventListener('click', () => fillQuizCategory(kindData))
  }
}











fillQuizKinds();