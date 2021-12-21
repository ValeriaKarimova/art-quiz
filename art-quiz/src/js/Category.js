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

    const groupsData = this.kindData.groups;
    categoryRoot.innerHTML = "";

    for (let groupData of groupsData) {
      const key = this.dataSource.getKey(this.kindData, groupData);
      const roundResult = this.getCorrectAnswersCount(key);
      const isDone = localStorage.getItem(key) !== null;

      const firstFact = this.dataSource.factsData[groupData.answers[0]];
      const imageFactPath = `images/img/${firstFact.imageNum}.jpg`;
      const groupHtml = categoryTemplate
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
    const stringJson = localStorage.getItem(key);
    if (stringJson === null || stringJson === undefined) return 0;
    const resultArray = JSON.parse(stringJson);
    const oneQuizCount = resultArray.reduce((b, a) => b + (a ? 1 : 0), 0);
    return oneQuizCount;
  }
}

export default Category;
