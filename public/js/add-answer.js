const hideAnswerSelect = document.getElementById("hide-answer-select");
const questionSelect = document.getElementById("select_mapping_type");
const answerValueInput = document.querySelectorAll("answer-value");
const imageInput = document.getElementById("answer-image");

if (questionSelect) {
  questionSelect.addEventListener("change", function (e) {
    const selectedIndex = this.selectedIndex;
    const type = parseInt(this.options[selectedIndex].dataset.type);
    if ([4, 5].includes(type)) {
      if (!answerValueInput.classList.contains("show")) answerValueInput.classList.add("show");
    } else {
      if (answerValueInput.classList.contains("show")) answerValueInput.classList.remove("show");
    }

    if ([5, 6].includes(type)) {
      if (!imageInput.classList.contains("show")) imageInput.classList.add("show");
    } else {
      if (imageInput.classList.contains("show")) imageInput.classList.remove("show");
    }

    if ([6].includes(type)) {
      if (!hideAnswerSelect.classList.contains("show")) hideAnswerSelect.classList.add("show");
    } else {
      if (hideAnswerSelect.classList.contains("show")) hideAnswerSelect.classList.remove("show");
    }
  });
}
