class ScoreView {
  constructor(imageAnswers, dataSource, resultArray) {
    this.imageAnswers = imageAnswers;
    this.dataSource = dataSource;
    this.resultArray = resultArray;
  }

  init() {
    const scorePageTemplate =
      '<div class="score_round" {{style}}>\
      <div class="true_false">\
      <img src={{true_false}} alt="icon">\
      </div>\
      <div class="image_score_description hide">\
      <p>{{title}}</p><p>{{name}}</p><p>{{year}}</p></div>\
      </div>';

    const scorePageRoot = document.querySelector(".score_root");

    scorePageRoot.innerHTML = "";

    for (let item of this.imageAnswers) {
      let selectedRound = this.dataSource.factsData[item];
      let scoreHtml;
      let imageFactPath = `images/img/${item}.jpg`;
      let index = this.imageAnswers.indexOf(item);

      if (this.resultArray[index]) {
        scoreHtml = scorePageTemplate
          .replace(
            "{{style}}",
            `style="background-image: url(${imageFactPath}); background-size: contain"`
          )
          .replace("{{true_false}}", "images/other/true.png")
          .replace("{{title}}", selectedRound.author)
          .replace("{{name}}", selectedRound.name)
          .replace("{{year}}", selectedRound.year);
      } else {
        scoreHtml = scorePageTemplate
          .replace(
            "{{style}}",
            `style="background-image: url(${imageFactPath}); background-size: contain; filter: grayscale(1)"`
          )
          .replace("{{true_false}}", "images/other/false.png")
          .replace("{{title}}", selectedRound.author)
          .replace("{{name}}", selectedRound.name)
          .replace("{{year}}", selectedRound.year);
      }

      const round = createElementFromHTML(scoreHtml);
      scorePageRoot.appendChild(round);
      const scoreOverlay = round.querySelector(".image_score_description");

      round.addEventListener("click", function () {
        scoreOverlay.classList.toggle("hide");
      });
    }
  }
}

export default ScoreView 