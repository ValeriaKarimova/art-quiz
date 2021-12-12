import QuizKind from "./QuizKind.js";
import DataSource from "./DataSource.js";
import Category from "./Category.js";
import Question from "./Question.js";
import ScoreView from "./ScoreView.js";

class Application {
  async init() {
    this.correctAnswers = 0;

    const mainPage = document.querySelector(".main");
    this.currentPage = mainPage;

    const homeButton = document.querySelectorAll(".home_btn");

    homeButton.forEach((button) =>
      button.addEventListener("click", () => this.openPage(".main"))
    );

    const settingsButton = document.querySelectorAll(".settings_btn");

    for (let elem of settingsButton) {
      elem.addEventListener("click", function () {
        const settingsOverlay = document.querySelector(".settings_overlay");
        settingsOverlay.classList.toggle("hide");
      });
    }

    this.dataSource = new DataSource();
    await this.dataSource.loadData();

    this.showKinds();
  }

  showKinds() {
    for (let kindData of this.dataSource.structureData) {
      const kind = new QuizKind(kindData, this.dataSource, (data) =>
        this.showCategory(data)
      );
      kind.init();
    }
  }

  showCategory(kindData) {
    const category = new Category(
      kindData,
      this.dataSource,
      (kindData, groupData) => this.showScores(kindData, groupData),
      (groupData, kindData) => this.startRound(groupData, kindData)
    );

    this.answerIndex = 0;
    this.answerHistory = [];
    category.init();

    this.openPage(".artists_main");
  }

  showScores(kindData, groupData) {
    const currentKey = this.dataSource.getKey(kindData, groupData);
    const keyArray = localStorage.getItem(currentKey);
    const resultArray = JSON.parse(keyArray);
    const imageAnswers = groupData.answers;

    const scoreView = new ScoreView(imageAnswers, this.dataSource, resultArray);
    scoreView.init();

    this.openPage(".scores_page");
  }

  startRound(groupData, kindData) {
    this.showQuestion(groupData, kindData);
    this.answerIndex = 0;
  }

  handleNextClick(groupData, kindData) {
    this.answerIndex++;

    if (this.answerIndex < groupData.answers.length) {
      this.showQuestion(groupData, kindData);
    } else {
      this.showResults(kindData);
      this.saveQuizResults(kindData, groupData);
    }
  }

  showQuestion(groupData, kindData) {
    const question = new Question(
      groupData,
      kindData,
      this.dataSource,
      this.answerHistory,
      this.answerIndex,
      (groupData, kindData) => this.handleNextClick(groupData, kindData),
      (value) => this.handleOptionClick(value)
    );
    question.init();

    this.openPage(".quiz_main");
  }

  handleOptionClick(isCorrectAnswer) {
    this.answerHistory[this.answerIndex] = isCorrectAnswer;
    if (isCorrectAnswer) {
      this.correctAnswers++;
    }
  }

  showResults(kindData) {
    const resultTemplate =
      '<div class="result_overlay">\
            <div class="result_basis">\
            <div class="results_description">\
            <p>Congratulations!</p>\
            <p>Правильных ответов: {{result}}</p>\
            </div>\
            <div>\
            <img src="images/other/finish.png" alt="img">\
            </div>\
            <div><button class="ok_button"><span>Ok</span></button></div></div>\
        </div>';

    const resultHtml = resultTemplate.replace(
      "{{result}}",
      this.correctAnswers
    );
    const resultOverlay = createElementFromHTML(resultHtml);
    const bodyDiv = document.querySelector("body");
    bodyDiv.appendChild(resultOverlay);
    const okBtn = document.querySelector(".ok_button");
    okBtn.addEventListener("click", () => {
      this.showCategory(kindData);
      bodyDiv.removeChild(resultOverlay);
      this.correctAnswers = 0;
    });
  }

  saveQuizResults(kindData, groupData) {
    const key = this.dataSource.getKey(kindData, groupData);
    localStorage.setItem(key, JSON.stringify(this.answerHistory));
  }

  openPage(className) {
    const pageElement = document.querySelector(className);

    if (pageElement == this.currentPage) return;

    pageElement.classList.add("active");
    pageElement.classList.remove("hide");
    this.currentPage.classList.add("hide");

    this.currentPage = pageElement;
  }
}

export default Application;
