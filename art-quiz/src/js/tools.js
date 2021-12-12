
function createElementFromHTML(htmlString) {
    let div = document.createElement("div");
    div.innerHTML = htmlString.trim();
  
    return div;
  }
  
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  }
  
    function getUniqueIndex(input, authors) {
    let index = Math.floor(Math.random() * (input.length - 1));
  
    while (authors.includes(input[index].author)) {
      index = Math.floor(Math.random() * (input.length - 1));
    }
    return index;
  }
  