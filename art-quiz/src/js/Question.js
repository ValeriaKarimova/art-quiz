class Question {
  constructor(
    groupData,
    kindData,
    dataSource,
    answerHistory,
    answerIndex,
    nextClickHandler,
    optionClickHandler
  ) {
    this.groupData = groupData;
    this.kindData = kindData;
    this.dataSource = dataSource;
    this.answerHistory = answerHistory;
    this.answerIndex = answerIndex;
    this.nextClickHandler = nextClickHandler;
    this.optionClickHandler = optionClickHandler;
  }

  init() {
    const quizTemplate =
      '<div class="picture_question">\
            <img src="{{image}}" alt="picture">\
            {{pagination}}\
        </div>\
        <div class="answers">\
            {{options}}\
        </div>';

    let pagination = document.createElement("div");
    pagination.classList.add("pagination");

    for (let i = 0; i < 10; i++) {
      const emptyCircle = document.createElement("div");
      emptyCircle.classList.add("empty");
      pagination.append(emptyCircle);
    }
    const quizRoot = document.querySelector(".quiz");
    quizRoot.innerHTML = "";

    let factIndex = this.groupData.answers[this.answerIndex];
    let correctFact = this.dataSource.factsData[factIndex];
    let options = this.receiveRandomOptions(factIndex);
    let quizOptionHTML = this.getOptionHtml(
      options,
      this.kindData.factFieldName
    );
    let imagePath = `images/img/${correctFact.imageNum}.jpg`;
    let quizHTML = quizTemplate
      .replace("{{image}}", imagePath)
      .replace("{{options}}", quizOptionHTML)
      .replace("{{pagination}}", pagination.outerHTML);

    const oneQuestion = createElementFromHTML(quizHTML);
    quizRoot.appendChild(oneQuestion);

    let paginationCircles = document.querySelectorAll(".empty");

    for (let index = 0; index < this.answerHistory.length; index++) {
      let isCorrectAnswer = this.answerHistory[index];
      const paginationCircleColor = isCorrectAnswer ? "green" : "red";
      paginationCircles[index].classList.add(paginationCircleColor);
    }

    const variants = document.querySelectorAll(".option");
    for (let selectedOptionDiv of variants) {
      selectedOptionDiv.addEventListener("click", () =>
        this.handleVariantClick(
          selectedOptionDiv,
          correctFact,
          this.kindData,
          this.groupData
        )
      );
    }
  }

  receiveRandomOptions(factIndex) {
    let fact = this.dataSource.factsData[factIndex];
    let randomIndex1 = getUniqueIndex(this.dataSource.factsData, [fact.author]);
    let randomFact1 = this.dataSource.factsData[randomIndex1];

    let randomIndex2 = getUniqueIndex(this.dataSource.factsData, [
      fact.author,
      randomFact1.author,
    ]);

    let randomFact2 = this.dataSource.factsData[randomIndex2];
    let randomIndex3 = getUniqueIndex(this.dataSource.factsData, [
      fact.author,
      randomFact1.author,
      randomFact2.author,
    ]);

    let randomFact3 = this.dataSource.factsData[randomIndex3];
    let factsArray = [fact, randomFact1, randomFact2, randomFact3];

    shuffleOptions(factsArray);

    return factsArray;
  }

  getOptionHtml(options, factFieldName) {
    const optionTemplate =
      '<div class="option" data-image-num={{imageNum}}>\
            <h5>{{title}}</h5>\
        </div>';

    let quizOptionHTML = "";

    for (let option of options) {
      let authorName = `${option[factFieldName]}`;
      quizOptionHTML += optionTemplate
        .replace("{{title}}", authorName)
        .replace("{{imageNum}}", option.imageNum);
    }

    return quizOptionHTML;
  }

  handleVariantClick(selectedOptionDiv, correctFact, kindData, groupData) {
    let paginationCircles = document.querySelectorAll(".empty");

    let isCorrectAnswer =
      selectedOptionDiv.dataset.imageNum == correctFact.imageNum;

    this.optionClickHandler(isCorrectAnswer);

    if (isCorrectAnswer) {
      selectedOptionDiv.classList.add("green");
      setTimeout(
        () => this.showOverlay(correctFact, groupData, kindData, true),
        300
      );
    } else {
      selectedOptionDiv.classList.add("red");
      setTimeout(
        () => this.showOverlay(correctFact, groupData, kindData, false),
        300
      );
    }

    if (isCorrectAnswer) {
      paginationCircles[this.answerIndex].classList.add("green");
    } else {
      paginationCircles[this.answerIndex].classList.add("red");
    }
  }

  showOverlay(correctFact, groupData, kindData, isCorrect) {
    const rightOverlayTemplate =
      '<div class="answer_overlay">\
                <div class="basis">\
                    <div>\
                        <img class="icon" src="images/other/true.png" alt="img">\
                    </div>\
                <div>\
                    <img class="basis_img" src="{{img}}" alt="image">\
                </div>\
                <div class="image_description">\
                    <p>{{title}}</p>\
                    <p>{{name}}</p>\
                    <p>{{year}}</p>\
                </div>\
                <div>\
                    <button>\
                        <span>next</span>\
                    </button>\
                </div>\
            </div>\
        </div>';

    const falseOverlayTemplate =
      '<div class="answer_overlay">\
            <div class="basis">\
                <div>\
                    <img class="icon" src="images/other/false.png" alt="img">\
                </div>\
            <div>\
            <img class="basis_img" src="{{img}}" alt="image">\
        </div>\
        <div class="image_description">\
            <p>{{title}}</p>\
            <p>{{name}}</p>\
            <p>{{year}}</p>\
        </div>\
        <div>\
            <button><span>next</span></button></div></div>\
        </div>';

    let imagePath = `images/img/${correctFact.imageNum}.jpg`;
    let template = isCorrect ? rightOverlayTemplate : falseOverlayTemplate;
    let overlayHtml = template
      .replace("{{img}}", imagePath)
      .replace("{{title}}", correctFact.author)
      .replace("{{name}}", correctFact.name)
      .replace("{{year}}", correctFact.year);

    let rightOverlay = createElementFromHTML(overlayHtml);
    const bodyDiv = document.querySelector("body");
    bodyDiv.appendChild(rightOverlay);
    const nextBtn = document.querySelector("button");
    nextBtn.addEventListener("click", () => {
      bodyDiv.removeChild(rightOverlay);
      this.nextClickHandler(groupData, kindData);
    });
  }
}

export default Question;
