/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2019*/
var mkd_events = (function () {
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function (topic, listener) {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: function () {
          delete topics[topic][index];
        },
      };
    },
    publish: function (topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function (item) {
        item(info != undefined ? info : {});
      });
    },
  };
})();

function mkd_is_number(evt, obj) {
  var charCode = evt.which ? evt.which : event.keyCode;
  var value = obj.value;

  var minuscontains = value.indexOf("-") != -1;
  if (minuscontains) {
    if (charCode == 45) {
      return false;
    }
  }
  if (charCode == 45) {
    return true;
  }

  var dotcontains = value.indexOf(".") != -1;
  if (dotcontains) {
    if (charCode == 46) {
      return false;
    }
  }
  if (charCode == 46) {
    return true;
  }
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

function mkd_export_table(url) {
  if (url.indexOf("?") > -1) {
    url = url + "&format=csv";
  } else {
    url = url + "?format=csv";
  }
  window.location.href = url;
}
$(document).ready(function () {
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
  });

  //import csv code
  $("#btn-choose-csv").on("click", function (e) {
    e.preventDefault();
    $("#csv-file").trigger("click");
  });

  $("#csv-file").on("change", function () {
    $("#import-csv").trigger("submit");
  });

  $("#import-csv").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action");

    $(this).addClass("d-none");
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (res) {
        var body_html = "";
        var head_html = "";
        if (res.preview == true) {
          var data = res.data;
          var header = data[0];
          data.shift();
          for (let headerItem of header) {
            head_html += `<th>${headerItem}</th>`;
          }
          for (let row of data) {
            body_html += "<tr>";
            for (let item of row) {
              body_html += `<td>${item} </td>`;
            }
            body_html += "</tr>";
          }

          $("#csv-table-head").html(head_html);
          $("#csv-table-body").html(body_html);
          $("#csv-table").removeClass("d-none");
          $("#btn-save-csv").removeClass("d-none");
        } else if (res.saved == true) {
          alert("Imported Successfully");
          location.reload();
        }
      },
    });
  });

  $("#btn-save-csv").on("click", function (e) {
    e.preventDefault();
    var model = $("#btn-csv-upload-dialog").data("model");
    console.log(model);
    $("#import-csv").attr("action", "/v1/api/file/import/" + model);
    $("#import-csv").trigger("submit");
  });

  $(".modal-image").on("click", function () {
    var src = $(this).attr("src");
    $("#modal-image-slot").attr("src", src);
    $("#modal-image-show").modal("show");
  });
});

const selectedRows = [];
// Buk Actions
const bulkSelectAll = document.getElementById("bulkSelectAll");

const deleteButton = document.getElementById("bulkDeleteButton");
const editButton = document.getElementById("bulkEditButton");
const originalDeleteHref = deleteButton?.href ?? "";

// Select All click
if (bulkSelectAll) {
  bulkSelectAll.addEventListener("click", (event) => {
    selectedRows.length = 0;

    const bulkSelectRows = document.querySelectorAll(".bulkSelect");

    const isSelectAll = event.target.checked;
    bulkSelectRows.forEach((item) => {
      item.checked = isSelectAll;
      if (isSelectAll) {
        selectedRows.push(item.dataset.id);
      }
    });
    // Update delete link
    if (isSelectAll) {
      if (deleteButton) deleteButton.style.display = "inline-block";
      if (deleteButton) deleteButton.href = originalDeleteHref + selectedRows.join("|");
      if (editButton) editButton.style.display = "inline-block";
    } else {
      if (deleteButton) deleteButton.style.display = "none";
      if (deleteButton) deleteButton.href = originalDeleteHref;
      if (editButton) editButton.style.display = "none";
    }
  });
}

// Handle Individual Select
const handleBulkSelectChange = function (event) {
  const id = event.dataset.id;
  if (event.checked) {
    selectedRows.push(id);
  } else {
    const findIndex = selectedRows.findIndex((item) => item === id);
    if (findIndex > -1) {
      selectedRows.splice(findIndex, 1);
    }
  }
  deleteButton.href = originalDeleteHref + selectedRows.join("|");

  deleteButton.style.display = selectedRows.length > 0 ? "inline-block" : "none";
  editButton.style.display = selectedRows.length > 0 ? "inline-block" : "none";
};
const orderContainer = document.getElementById("order-container");
if (orderContainer) {
  (async () => {
    const quizzes = await fetch("/admin/api/quizzes?limit=0")
      .then((res) => res.json())
      .then((data) => data.data.items);

    // Store listitems
    const listItems = [];

    let dragStartIndex;
    let dragStartQuiz;

    createList();

    // Insert list items into DOM
    function createList() {
      quizzes.forEach((quiz) => {
        const quizContainer = document.createElement("div");
        const quizHeadTag = document.createElement("h2");
        quizHeadTag.className = "font-weight-bold mb-3";
        quizHeadTag.innerHTML = `Quiz: ${quiz.name}`;
        quizContainer.id = `${quiz.name.replace(/ /g, "_")}_id`;
        quizContainer.className = "quiz-container mb-5";

        const draggable_list = document.createElement("ul");
        draggable_list.id = `draggable-list-${quiz.id}`;
        draggable_list.className = "draggable-list";

        quizContainer.appendChild(quizHeadTag);
        quizContainer.appendChild(draggable_list);
        quiz.questions.forEach((questionObject, index) => {
          const listItem = document.createElement("li");

          listItem.setAttribute("data-index", index);
          listItem.setAttribute("data-quiz", quiz.id);

          listItem.innerHTML = `
              <span class="number">${questionObject.order}</span>
              <div class="draggable" draggable="true">
                <p class="question-text" data-question-id="${questionObject.id}" data-question-new-order="${questionObject.order}">${questionObject.question}</p>
                <i class="fas fa-grip-lines"></i>
              </div>
            `;

          listItems.push(listItem);

          draggable_list.appendChild(listItem);
        });
        orderContainer.appendChild(quizContainer);
      });
      addEventListeners();
    }

    function dragStart() {
      dragStartIndex = +this.closest("li").getAttribute("data-index");
      dragStartQuiz = +this.closest("li").getAttribute("data-quiz");
    }

    function dragEnter() {
      this.classList.add("over");
    }

    function dragLeave() {
      this.classList.remove("over");
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragDrop() {
      const dragEndIndex = +this.getAttribute("data-index");
      const dragEndQuiz = +this.getAttribute("data-quiz");
      swapItems(dragStartIndex, dragStartQuiz, dragEndIndex, dragEndQuiz);

      this.classList.remove("over");
    }

    // Swap list items that are drag and drop
    function swapItems(fromIndex, fromQuiz, toIndex, toQuiz) {
      const itemOne = listItems.find((item) => {
        return item.getAttribute("data-quiz") == fromQuiz && item.getAttribute("data-index") == fromIndex;
      });
      const itemTwo = listItems.find((item) => {
        return item.getAttribute("data-quiz") == toQuiz && item.getAttribute("data-index") == toIndex;
      });

      const movableItemOne = itemOne.querySelector(".draggable");
      const movableItemTwo = itemTwo.querySelector(".draggable");

      itemOne.appendChild(movableItemTwo);
      itemTwo.appendChild(movableItemOne);

      const itemOneOrder = movableItemOne.querySelector(".question-text").getAttribute("data-question-new-order");
      const itemTwoOrder = movableItemTwo.querySelector(".question-text").getAttribute("data-question-new-order");

      movableItemOne.querySelector(".question-text").setAttribute("data-question-new-order", itemTwoOrder);
      movableItemTwo.querySelector(".question-text").setAttribute("data-question-new-order", itemOneOrder);
    }

    function addEventListeners() {
      const draggables = document.querySelectorAll(".draggable");
      const dragListItems = document.querySelectorAll(".draggable-list li");

      draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", dragStart);
      });

      dragListItems.forEach((item) => {
        item.addEventListener("dragover", dragOver);
        item.addEventListener("drop", dragDrop);
        item.addEventListener("dragenter", dragEnter);
        item.addEventListener("dragleave", dragLeave);
      });
    }
  })();
}

async function submitChanges(el, e) {
  e.preventDefault();
  el.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
  const questions = document.querySelectorAll(".question-text");
  const payload = [];
  questions.forEach((question) => {
    payload.push({
      id: question.getAttribute("data-question-id"),
      order: question.getAttribute("data-question-new-order"),
    });
  });
  const response = await fetch("/questions/order/save", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
  console.log(response);
  el.innerHTML = `Submit changes`;
}

function weightScoreInputChange(el, event) {
  if (el.value && el.value.trim()) {
    if (!el.classList.contains("has-value")) el.classList.add("has-value");
  } else {
    el.classList.remove("has-value");
  }
}

async function updateMainPicture(self, evt) {
  evt.preventDefault();
  const imageId = document.getElementById("file_image").value;
  if (!imageId) {
    return false;
  }
  self.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
  const response = await fetch("/main-image/update", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageId,
    }),
  }).then((res) => res.json());
  console.log(response);
  self.innerHTML = `Update image`;
}

function printSpecific(divId) {
  let divToPrint = document.getElementById(divId);
  let printBtn = document.querySelector(".print-btn");
  divToPrint.classList.add("print");
  printBtn.classList.add("print");
  window.print();
  printBtn.classList.remove("print");
  divToPrint.classList.remove("print");
}
