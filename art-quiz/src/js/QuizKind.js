class QuizKind {
  kindTemplate =
    '<div class="kind_item"><img src="{{image}}" alt="picture"><h2>{{title}}</h2></div>';

  constructor(kindData, dataSource, kindClickHandler) {
    this.kindClickHandler = kindClickHandler;
    this.kindData = kindData;
    this.dataSource = dataSource;
  }

  init() {
    const kindsRoot = document.querySelector(".quizes_kinds");
    const kindHtml = this.kindTemplate
      .replace("{{image}}", this.kindData.image)
      .replace("{{title}}", this.kindData.title);

    const element = createElementFromHTML(kindHtml);
    kindsRoot.appendChild(element);
    element.addEventListener("click", () =>
      this.kindClickHandler(this.kindData)
    );
  }
}

export default QuizKind;
