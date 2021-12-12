class Category {
  constructor(kindData, dataSource, scoreClickHandler, roundClickHandler) {
    this.kindData = kindData;
    this.dataSource = dataSource;
    this.scoreClickHandler = scoreClickHandler;
    this.roundClickHandler = roundClickHandler;
  }

  init() {
    const categoryRoot = document.querySelector(".categories");
    const categoryTemplate =
      '<div class="round"><img src="{{image}}" alt="picture"><div class="overlay {{extra}}"><h4 class="show_questions">{{title}}</h4><div class="score_div"><h6>Score</h6></div></div></div>';

    let groupsData = this.kindData.groups;
    categoryRoot.innerHTML = "";

    for (let groupData of groupsData) {
      let key = this.dataSource.getKey(this.kindData, groupData);
      let roundResult = this.getCorrectAnswersCount(key);
      let isDone = localStorage.getItem(key) !== null;

      let firstFact = this.dataSource.factsData[groupData.answers[0]];
      let imageFactPath = `images/img/${firstFact.imageNum}.jpg`;
      let groupHtml = categoryTemplate
        .replace("{{title}}", isDone ? `${roundResult}/10` : groupData.title)
        .replace("{{image}}", imageFactPath)
        .replace("{{extra}}", isDone ? "no_overlay" : "");
      const round = createElementFromHTML(groupHtml);
      categoryRoot.appendChild(round);

      const scoreStar = round.querySelector(".score_div");
      scoreStar.addEventListener("click", () =>
        this.scoreClickHandler(this.kindData, groupData)
      );

      const startQuiz = round.querySelector(".show_questions");
      startQuiz.addEventListener("click", () => {
        this.roundClickHandler(groupData, this.kindData);
      });
    }
  }

  getCorrectAnswersCount(key) {
    let stringJson = localStorage.getItem(key);
    if (stringJson === null) return 0;
    let resultArray = JSON.parse(stringJson);
    let oneQuizCount = resultArray.reduce((b, a) => b + (a ? 1 : 0), 0);
    return oneQuizCount;
  }
}

export default Category;
