const mcqiImageDimensionBox = document.getElementById("demo-box");
const addQuestionForm = document.getElementById("add-question-form");
const editQuestionForm = document.getElementById("edit-question-form");
const extraOutputsContainer = document.getElementById("extra-outputs");
const sliderSelectContainer = document.getElementById("slider-select");
const typeSelect = document.getElementById("select_mapping_type");
const sliderRangeInput = document.getElementById("text_slider_range");
const minSlideRange = document.getElementById("min-slide-range");
const maxSlideRange = document.getElementById("max-slide-range");
const imageDimensions = document.getElementById("image-dimensions");
const imageWidth = document.getElementById("image-width");
const imageHeight = document.getElementById("image-height");

const dependsOnMainInput = document.getElementById("text_depends_on");
const dependsOnQuestionId = document.getElementById("depended_question_id");
const dependsOnAnswer = document.getElementById("depended_answer");

const outputVariableInput = document.getElementById("text_extra_output_variable");

if (addQuestionForm) {
  addQuestionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (dependsOnQuestionId.value && dependsOnAnswer.value) {
      let joinedStr = `${dependsOnQuestionId.value}|${dependsOnAnswer.value}`;
      dependsOnMainInput.value = joinedStr.trim();
    } else {
      dependsOnMainInput.value = "";
    }
    if (minSlideRange.value && maxSlideRange.value) {
      sliderRangeInput.value = `${minSlideRange.value}-${maxSlideRange.value}`;
    }
    let arrayOfExtras = [];

    const outputVariableExtrasContainer = document.querySelectorAll(".output-variable-container");
    outputVariableExtrasContainer.forEach(function (extraContainer) {
      //get names and weights
      let currentExtraName = extraContainer.querySelector("select").value;
      let currentExtraWeight = extraContainer.querySelector(".extra-output-weight").value;
      if (currentExtraName && currentExtraWeight) {
        arrayOfExtras.push({
          name: currentExtraName,
          weight: currentExtraWeight,
        });
      }
    });
    if (arrayOfExtras.length > 0) {
      outputVariableInput.value = JSON.stringify(arrayOfExtras);
    } else {
      outputVariableInput.value = "[]";
    }
    this.submit();
  });
}

if (editQuestionForm) {
  editQuestionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("stopped");
    if (dependsOnQuestionId.value && dependsOnAnswer.value) {
      let joinedStr = `${dependsOnQuestionId.value}|${dependsOnAnswer.value}`;
      dependsOnMainInput.value = joinedStr.trim();
    } else {
      dependsOnMainInput.value = "";
    }
    if (minSlideRange.value && maxSlideRange.value) {
      sliderRangeInput.value = `${minSlideRange.value}-${maxSlideRange.value}`;
    }
    let arrayOfExtras = [];
    const outputVariableExtrasContainer = document.querySelectorAll(".output-variable-container");
    outputVariableExtrasContainer.forEach(function (extraContainer) {
      //get names and weights
      let currentExtraName = extraContainer.querySelector("select").value;
      let currentExtraWeight = extraContainer.querySelector(".extra-output-weight").value;
      if (currentExtraName && currentExtraWeight) {
        arrayOfExtras.push({
          name: currentExtraName,
          weight: currentExtraWeight,
        });
      }
    });
    if (arrayOfExtras.length > 0) {
      outputVariableInput.value = JSON.stringify(arrayOfExtras);
    } else {
      outputVariableInput.value = "[]";
    }
    this.submit();
  });
}

typeSelect.addEventListener("change", function () {
  let type = this.value;
  if (type == 6) {
    sliderSelectContainer.removeAttribute("hidden");
    if (!sliderSelectContainer.classList.contains("required")) sliderSelectContainer.classList.add("required");
    minSlideRange.setAttribute("required", "required");
    maxSlideRange.setAttribute("required", "required");
  } else if (type == 5) {
    imageDimensions.removeAttribute("hidden");
    if (!imageDimensions.classList.contains("required")) imageDimensions.classList.add("required");
    imageWidth.setAttribute("required", "required");
    imageHeight.setAttribute("required", "required");
  } else {
    sliderSelectContainer.setAttribute("hidden", "true");
    sliderSelectContainer.classList.remove("required");
    minSlideRange.removeAttribute("required");
    maxSlideRange.removeAttribute("required");

    imageDimensions.setAttribute("hidden", "true");
    imageDimensions.classList.remove("required");
    imageWidth.removeAttribute("required");
    imageHeight.removeAttribute("required");
  }
});

function addExtraOutputVariable() {
  let options = "";
  outputVariables.forEach(function (oV) {
    options += `<option value="${oV}">${oV}</option>`;
  });
  let htmlTemplate = `
  <div class="output-variable-container mb-2 d-flex flex-lg-row flex-column flex-lg-wrap col-lg-12 px-0 ">          
    <div class="d-flex mr-2 flex-column px-0 col-lg col-12">
      <label for="extra-output-var">Output variable</label>
      <select class="custom-select extra-output-var custom-picker d-block w-100" id="extra-output-var" data-style="btn-light" data-live-search="true">
        <option class="select_mapping_status_option" value=""></option>
        ${options}     
      </select>
    </div>
    <div class="d-flex mr-2 flex-column px-0 col-lg col-12">
      <label for="extra-output-weight">Weight</label>
      <input type="number" class="form-control data-input extra-output-weight"/>
    </div>
  </div>
  `;
  $(htmlTemplate).insertBefore(".add-another-extra");
}

function questionSelectionChanged(el, event) {
  const shown_number_order = document.getElementById("shown_number_order");
  const number_order = document.getElementById("number_order");
  shown_number_order.value = parseInt(el.options[el.selectedIndex].dataset.lastOrder) + 1;
  number_order.value = parseInt(el.options[el.selectedIndex].dataset.lastOrder) + 1;
}

const questionSelect = document.getElementById("select_mapping_type");
const hideAnswerSelect = $(".hide-answer-select");
const answerValueInput = $(".answer-value");
const imageInput = $(".answer-image");

if (questionSelect) {
  questionSelect.addEventListener("change", function (e) {
    const selectedIndex = this.selectedIndex;
    const type = parseInt(this.options[selectedIndex].dataset.type);
    if ([4, 5].includes(type)) {
      if (!answerValueInput.hasClass("show")) answerValueInput.addClass("show");
    } else {
      answerValueInput.removeClass("show");
    }

    if ([5, 6].includes(type)) {
      if (!imageInput.hasClass("show")) imageInput.addClass("show");
    } else {
      imageInput.removeClass("show");
    }

    if ([6].includes(type)) {
      if (!hideAnswerSelect.hasClass("show")) hideAnswerSelect.addClass("show");
    } else {
      hideAnswerSelect.removeClass("show");
    }
  });
}

const successflashMessage = document.querySelector(".custom-flash-message.success");
const errorflashMessage = document.querySelector(".custom-flash-message.error");

const el = document.getElementById("sortable-list");
if (el) {
  var sortable = new Sortable(el, {
    group: "list-1",
    ghostClass: "blue-background-class",
    sort: true,
    animation: 150,
    dataIdAttr: "data-id",
    draggable: ".accordion",
    handle: ".accordion",
    chosenClass: "active",
    onChoose: function (evt) {},
    onEnd: function (evt) {},
    onChange: function (evt) {},
  });
}

function showMessage(message, type, errorObj = {}) {
  if (type == "error") {
    if (Object.keys(errorObj).length > 0) {
      let errors = ``;
      Object.keys(errorObj).forEach(function (key) {
        errors += errorObj[key];
        errors += "</br>";
      });
      errorflashMessage.innerHTML = errors;
    } else {
      errorflashMessage.innerText = message;
    }
    errorflashMessage.classList.add("show");
    setTimeout(() => {
      errorflashMessage.classList.remove("show");
    }, 5000);
  } else if (type == "success") {
    successflashMessage.classList.add("show");
    successflashMessage.innerText = message;
    setTimeout(() => {
      successflashMessage.classList.remove("show");
    }, 5000);
  }
}

function submitAddAnswerForm() {
  //check for required
  const addAnswerForm = document.getElementById("add-answer-modal-form");
  const questionType = addAnswerForm.querySelector("#add_form_question_type").value;
  const answer = addAnswerForm.querySelector("#add_form_answer").value;
  const answerValue = addAnswerForm.querySelector("#add_form_answer_value").value;
  const image = addAnswerForm.querySelector("input[data-target='add_form_image']").value;
  if (!answer) {
    return showMessage("Answer field is missing", "error");
  }
  if (questionType == 5 || questionType == 4) {
    if (!answerValue) {
      return showMessage("Answer value field is missing", "error");
    }
  }
  if (questionType == 5) {
    if (!image) {
      return showMessage("Image field is missing", "error");
    }
  }
  addAnswerForm.submit();
}

function clearImage(el) {
  el.parentElement.querySelector("#file_image_id").value = "";
  el.parentElement.querySelector("#media_image_id").src = "/image/placeholder-image.png";
}

function confirmDelete(self) {
  if (confirm("Are you sure you want to delete this answer?")) window.location.href = self.getAttribute("href");
}

function changeDimension(type, self) {
  if (type == "width") {
    mcqiImageDimensionBox.style.width = `${self.value ? self.value : 0}px`;
  } else if (type == "height") {
    mcqiImageDimensionBox.style.height = `${self.value ? self.value : 0}px`;
  }
}
