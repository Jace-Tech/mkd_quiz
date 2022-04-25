let url_preset = "";

let finalActives = [];
let dataToReturn = localStorage.getItem("answers") ? JSON.parse(localStorage.getItem("answers")) : [];
let uniqueQuestionsShowed = [];
let lastQuizResponseShown;
let lastShowedQuestionId = null;
let emailFieldInProgress = false;
let minRangeVal = null;
let maxRangeVal = null;
let blank_active_count = 0;
let data = "";
let items = "";
let allItems = "";
let UserName = "";
let UserBirth = "";
let currentActiveAnswerType = null;
let currentQuestion = null;
let answer = "";
let currentQuizIndex = 0;
let totalQuizQuestions = [];
let currentQuestionCounter = 0;
let saveResponseInto = null;
let ans = "";
let city_id = "";
let tempMcqAns = "";
let tempMcqAnsValue = 0;
let tempMcqiBLActives = [];
let tempMcqBLActives = [];
let tempMcqiAns = "";
let tempMcqiAnsValue = 0;
let sliderAns = "";
let sliderBLActives = [];
let sliderVal = "";
let tempSelectionAns = [];
let isSkipStoreAnswer = false;
let isExecuted = false;
let nextBtnClicked = false;
let argument = [];
let weights = {};
let apiQues = null;
let quesResponse = null;
let responseHeader = null;
let responseBody = null;
let flag = false;
let age = "";
let allLength = "";
let eachLength = 0;
let totalQ = 0;
let increase = 0;
let progress = 0;
let timerStart = false;
let ranges = [];
let lastCurrentQuizQuesInProgress = false;
let responseOnGoing = false;
let hasNoResponse = false;
let responseClosed = false;
let closeResponseTimeout;
let mainConfigurations;
let profile_characteristics = {};
let nextQuestionTimeoutCounter = 3000;
let selectionQuestionTimeoutCounter = 6000;
let closeResponseTimeoutCounter = 5000;
let timeout;

const mainImage = $(".main-image-container img");
fetch(url_preset + "/configurations")
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            mainConfigurations = data.payload;
            mainImage.attr("src", url_preset + mainConfigurations.image.url);
        }
    });

$(document).on("click", ".beginButton", async function () {
    $("#page1").css("display", "none");
    $("#page2").css("display", "none");
    $("#page3").css("display", "none");
    $("#page4").css("display", "none");
    $("#page5").css("display", "none");
    $("#page6").css("display", "none");
    $("#page7").css("display", "none");
    await getQuizzesApi();
    showQuizTitle();
    return nextQuestion();
});

$(document).on("click", ".goBottom", function () {
    $("html, body").animate({
        scrollTop: $(document).height()
    }, "slow");
});

$(document).on("click", ".nextBtn", function () {
    nextBtnClicked = true;
});

let firstTime = true;
let oldAnswers = [];
const customerId = document.getElementById("customer-id");
const customerEmail = document.getElementById("customer-email");
if (customerId || customerEmail) {
    fetch(url_preset + "/v1/api/order/customer?id=" + customerId?.innerText + "&email=" + customerEmail?.innerText)
        .then((res) => res.json())
        .then((data) => {
            if (data.success && data.data) {
                oldAnswers = data.data;
                firstTime = false;
            }
        });
}

function getQuizzesApi() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url_preset + "/admin/api/quizzes?limit=0",
            type: "GET",
            success: function (response) {
                data = response.data; //all data in the api

                allItems = data.items; // items in the api
                allLength = allItems.length;
                for (i = 0; i < allLength; i++) {
                    var eachName = allItems[i].name;
                    eachLength = allItems[i].questions.length;
                    totalQ = totalQ + eachLength;

                    $("#progressBarSection .progressBar .progressColumnsDiv").append(`
            <button class="progressColumns">
              <p>${eachName}</p>
            </button>
        `);
                }
                return resolve();
            },
            error: function (error) {
                return reject(error);
            },
        });
    });
}

// function to show all quiz title page
function showQuizTitle() {
    $("#page1").css("display", "none");
    $("#page3").css("display", "none");
    $("#page5").css("display", "none");
    $("#page6").css("display", "none");
    $("#page7").css("display", "none");
    $("#page2").css("display", "block");
    $("#page2 .container .row").html("");
    $("#progressBarSection").css("display", "none");

    $("#page2 .container .row").append(`
      <h4>Part ${allItems[currentQuizIndex].id}: ${allItems[currentQuizIndex].name}</h4>
      <h1>${allItems[currentQuizIndex].description}</h1>
    `);
    setTimeout(function () {
        $("#page1").css("display", "none");
        $("#page2").css("display", "none");
        $("#page3").css("display", "block");
        $("#page4").css("display", "none");
        $("#page5").css("display", "none");
        $("#page6").css("display", "none");
        $("#page7").css("display", "none");
        $("#progressBarSection").css("display", "block");
    }, nextQuestionTimeoutCounter);
}

function showPreparingPage() {
    clearTimeout(closeResponseTimeout);
    $("#page1").css("display", "none");
    $("#page2").css("display", "none");
    $("#page3").css("display", "none");
    $("#page4").css("display", "none");
    $("#page5").css("display", "none");
    $("#page7").css("display", "none");
    $("#page6").css("display", "block");
    $("#progressBarSection").css("display", "none");
    showResults();
}

async function showResults() {
    const {
        accumlatedUniqueWeights,
        sortedWeightsArray
    } = getUniqueAccumlatedWeights(dataToReturn);
    const accumlatedBLActives = getUniqueBlackListActives(dataToReturn);
    const {
        activesToAdd,
        activesToRemove
    } = await getEngineRules(accumlatedUniqueWeights);
    const {
        sortedFinalActiveslist,
        sortedFinalActiveslistWithScores
    } = await calculatePrioritySelection(accumlatedUniqueWeights);
    const filteredActivesListInitial = filterBlacklistActives(sortedFinalActiveslistWithScores);
    finalActives = applyFinalCalculations(filteredActivesListInitial, activesToAdd, activesToRemove, dataToReturn);

    console.log("accumlated weights", accumlatedUniqueWeights);
    console.log("black listed actives", accumlatedBLActives);
    console.log("full actives list", sortedFinalActiveslist);
    console.log("full actives list with scores", sortedFinalActiveslistWithScores);
    console.log("after first filter", filteredActivesListInitial);
    console.log("final actives List", finalActives);

    if (accumlatedUniqueWeights) {
        await createProfile(accumlatedUniqueWeights);
    }

    $("#page6").css("display", "none");
    $("#page7 .nameDiv h5").html(localStorage.getItem("name"));
    $("#page7").css("display", "block");
} // showResults function ends here

function applyFinalCalculations(blFilterdActiveList, activesToAdd, activesToRemove, answersArray) {
    //select top 5
    //checkup here to see if it is first time or not
    let finalActivesList = [];

    blFilterdActiveList.forEach((active, index) => {
        if (index < 5) {
            finalActivesList.push(active);
        } else {
            if (active[1] >= 22) {
                finalActivesList.push(active);
            }
        }
    });

    if (activesToRemove && activesToRemove.length) {
        finalActivesList.filter((active) => !activesToRemove.includes(active[0]));
    }
    if (activesToAdd && activesToAdd.length) {
        activesToAdd.forEach((activeToAdd) => {
            finalActivesList.push([activeToAdd, 0]);
        });
    }

    //second bl active list removal
    finalActivesList = finalActivesList.slice(0, 10);
    const blackListedActives = getUniqueBlackListActives(answersArray);
    finalActivesList = finalActivesList.filter((active) => {
        return !blackListedActives.includes(active);
    });
    // if (finalActivesList.length < 10) {
    //   for (let i = finalActivesList.length; i < 11; i++) {
    //     finalActivesList.push("Blank");
    //     blank_active_count++;
    //   }
    // }
    if (firstTime) {
        finalActivesList.unshift(["Base", 100]);
    } else {
        finalActivesList.unshift(["Base Refill", 100]);
    }
    return finalActivesList;
}
async function getEngineRules(uniqueWeights) {
    let activesToAdd = [];
    let activesToRemove = [];
    const rules = await getRules();
    rules.forEach(function (rule) {
        const operator = rule.operator;
        const compareValue = rule.compare_value;
        const ruleOutputVariable = rule.output_variable_name;
        const actionTaken = rule.action;
        const activesInQuestion = JSON.parse(rule.actives);
        if (uniqueWeights[ruleOutputVariable]) {
            if (operator == 0) {
                // = eq
                if (uniqueWeights[ruleOutputVariable] == compareValue) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            } else if (operator == 1) {
                // < less than
                if (uniqueWeights[ruleOutputVariable] < compareValue) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            } else if (operator == 2) {
                // <= less than or equal
                if (uniqueWeights[ruleOutputVariable] <= compareValue) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            } else if (operator == 3) {
                // > greater than
                if (uniqueWeights[ruleOutputVariable] > compareValue) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            } else if (operator == 4) {
                // >= greater than or equal
                if (uniqueWeights[ruleOutputVariable] >= compareValue) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            } else if (operator == 5) {
                // != not
                if (uniqueWeights[ruleOutputVariable] != compareValue) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            } else if (operator == 6) {
                //between
                let min = rule.min;
                let max = rule.max;
                if (uniqueWeights[ruleOutputVariable] >= min && uniqueWeights[ruleOutputVariable] <= max) {
                    if (actionTaken == 1) {
                        //add
                        activesInQuestion.forEach((aiq) => {
                            activesToAdd.push(aiq);
                        });
                    } else if (actionTaken == 2) {
                        //remove
                        activesInQuestion.forEach((aiq) => {
                            activesToRemove.push(aiq);
                        });
                    }
                }
            }
        }
    });
    return {
        activesToAdd,
        activesToRemove
    };
}

function filterBlacklistActives(sortedActivesListWithScores) {
    //remove blActives
    const blackListedActives = getUniqueBlackListActives(dataToReturn);
    sortedActivesListWithScores = sortedActivesListWithScores.filter((active) => {
        return !blackListedActives.includes(active[0]);
    });
    return sortedActivesListWithScores;
}

function getUniqueAccumlatedWeights(answersArray) {
    //create array of unique weight and accumlated value
    let weightsArray = [];
    let accumlatedUniqueWeightsWihBase = {};
    answersArray.forEach(function (answer) {
        if (answer.weights && Object.keys(answer.weights).length) weightsArray.push(answer.weights);
    });
    if (weightsArray.length == 0) {
        return {
            accumlatedUniqueWeightsWihBase,
            sortedWeightsArray: []
        };
    }
    weightsArray.forEach(function (weight) {
        Object.keys(weight).forEach(function (key) {
            if (accumlatedUniqueWeightsWihBase.hasOwnProperty(key)) {
                accumlatedUniqueWeightsWihBase[key] = {
                    value: parseFloat(accumlatedUniqueWeightsWihBase[key].value) + parseFloat(weight[key].value),
                    base: parseFloat(accumlatedUniqueWeightsWihBase[key].base) + parseFloat(weight[key].base),
                };
            } else {
                accumlatedUniqueWeightsWihBase[key] = {
                    value: parseFloat(weight[key].value),
                    base: parseFloat(weight[key].base),
                };
            }
        });
    });

    let accumlatedUniqueWeights = {};
    Object.entries(accumlatedUniqueWeightsWihBase).forEach(([variableName, {
        value,
        base
    }]) => {
        accumlatedUniqueWeights[variableName] = parseFloat(value) / parseFloat(base);
    });
    let sortedEntries = Object.entries(accumlatedUniqueWeights).sort(function (a, b) {
        return b[1] - a[1];
    });

    return {
        accumlatedUniqueWeights,
        sortedWeightsArray: sortedEntries
    };
}
async function calculatePrioritySelection(accumlatedUniqueWeights) {
    const outputVariableList = await getFullOutputVariablesList().then((data) => data.output_variables);
    const activesList = await getFullActivesList().then((data) => data.actives);

    const finalActiveScores = {};
    for (const active of activesList) {
        //equation
        const activeName = active.name;
        let activesListWeightsScores = active.variables_scores ? JSON.parse(active.variables_scores) : {};
        //filter empty active weights score
        activesListWeightsScores = Object.entries(activesListWeightsScores).filter(([outputVarName, score]) => {
            return score;
        });
        let filteredActivesWeightScores = Object.fromEntries(activesListWeightsScores);
        Object.entries(filteredActivesWeightScores).forEach(([name, score]) => {
            const outputVariableAccumlatedWeight = accumlatedUniqueWeights[name];
            if (outputVariableAccumlatedWeight) {
                const outputVariablePriority = outputVariableList.find((ovar) => ovar.name == name).priority;
                if (finalActiveScores.hasOwnProperty(activeName)) {
                    finalActiveScores[activeName] = parseFloat(finalActiveScores[activeName]) + parseFloat(outputVariableAccumlatedWeight) * parseFloat(outputVariablePriority / 100) * parseFloat(score);
                } else {
                    finalActiveScores[activeName] = parseFloat(outputVariableAccumlatedWeight) * parseFloat(outputVariablePriority / 100) * parseFloat(score);
                }
            }
        });
    }
    //
    const finalDividedList = {};
    Object.entries(finalActiveScores).forEach(([active, score]) => {
        if (!isNaN(score)) {
            finalDividedList[active] = parseFloat(score / 1000);
        }
    });
    let sortedFinalActiveslistWithScores = Object.entries(finalDividedList).sort(([, a], [, b]) => b - a);
    let sortedFinalActiveslist = Object.keys(finalDividedList).sort((a, b) => finalDividedList[b] - finalDividedList[a]);
    return {
        sortedFinalActiveslist,
        sortedFinalActiveslistWithScores
    };
}

function getUniqueBlackListActives(answersArray) {
    let accumlatedBLActives = [];
    answersArray.forEach(function (answer) {
        if (answer.black_list_actives) {
            for (const blActive of answer.black_list_actives) {
                if (!accumlatedBLActives.includes(blActive)) {
                    accumlatedBLActives.push(blActive);
                }
            }
        }
    });
    return accumlatedBLActives;
}

async function createProfile(uniqueWeights) {
    const sections = await getProfileSections();
    const container = $("#profile-result-container");
    for (const section of sections) {
        const sectionTitle = section.section_title;
        profile_characteristics[sectionTitle] = [];
        let containerTemplate = `
      <div class="row profile-row" id="${section.id}">
        <div class="rowInner">
          <div class="main-header">
            <h1>${sectionTitle}</h1>
          </div>
          <div class="main-body">
            ${await makePercentageDivs(uniqueWeights, section.output_variable_list, sectionTitle)}
        </div>
      </div>
    `;
        container.append(containerTemplate);
    }
}
async function makePercentageDivs(uniqueWeights, output_variable_list, sectionTitle) {
    let accumlatedString = "";

    for (const item of output_variable_list) {
        let varName = item;
        let percentage = uniqueWeights[item] ?? 0;
        if (percentage > 100) {
            percentage = 100;
        }
        let tmp = `
    <div class="bodyCols">
      <div class="bodyTitle">
        <h4>${varName}</h4>
      </div>
      <div class="bodyDesc">
        <p>${await getOutputVariableRangesResponses(varName, percentage)}</p>
      </div>
      <div class="bodyProgress">
        <div id="#${varName}" class="movingBar" style="width: ${percentage}%"></div>
      </div>
    </div>
    `;
        accumlatedString += tmp;
        profile_characteristics[sectionTitle].push({
            name: varName,
            percentage: percentage
        });
    }
    return accumlatedString;
}
async function getOutputVariableRangesResponses(varName, percentage) {
    const outputVariable = await getOutputVariable(varName);
    if (outputVariable && outputVariable.ranges_response) {
        const rangesResponses = outputVariable.ranges_response;
        const requiredRange = rangesResponses.find(function (rr) {
            let minRange = parseFloat(Object.keys(rr)[0].split("-")[0]);
            let maxRange = parseFloat(Object.keys(rr)[0].split("-")[1]);
            if (Math.round(percentage) >= minRange && Math.round(percentage) <= maxRange) return rr;
        });
        if (requiredRange) {
            let currResponse = requiredRange[Object.keys(requiredRange)[0]];
            return currResponse;
        }
    }
    return "";
}

function getFullActivesList() {
    return new Promise(function (res, rej) {
        $.ajax({
            url: url_preset + "/api/v1/actives",
            type: "GET",
            success: function (response) {
                return res(response.data);
            },
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
                return rej(exception);
            },
        }); //ajax ends here
    });
}

function getFullOutputVariablesList() {
    return new Promise(function (res, rej) {
        $.ajax({
            url: url_preset + "/api/v1/output-variables",
            type: "GET",
            success: function (response) {
                return res(response.data);
            },
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
                return rej(exception);
            },
        }); //ajax ends here
    });
}

function getOutputVariable(name) {
    return new Promise(function (res, rej) {
        $.ajax({
            url: url_preset + `/api/v1/output-variable/${name}`,
            type: "GET",
            success: function (response) {
                return res(response.data);
            },
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
                return rej(exception);
            },
        }); //ajax ends here
    });
}

function getProfileSections() {
    return new Promise(function (res, rej) {
        $.ajax({
            url: url_preset + "/api/v1/profile-sections",
            type: "GET",
            success: function (response) {
                return res(response.data);
            },
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
                return rej(exception);
            },
        }); //ajax ends here
    });
}
// @parameter Array of all output variables names
function getActivesList(outputVariablesNames) {
    return new Promise(function (res, rej) {
        $.ajax({
            url: url_preset + `/api/v1/output-variables/actives-list?names_list=${outputVariablesNames.join(",")}`,
            type: "GET",
            success: function (response) {
                return res(response.data);
            },
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
                return rej(exception);
            },
        }); //ajax ends here
    });
}

function getRules() {
    return new Promise(function (res, rej) {
        $.ajax({
            url: url_preset + "/api/v1/rules",
            type: "GET",
            success: function (response) {
                return res(response.data);
            },
            error: function (jqXHR, exception) {
                console.error(jqXHR);
                console.error(exception);
                return rej(exception);
            },
        }); //ajax ends here
    });
}
// function to calculate Age
function calculateAge(year) {
    if (!year) {
        return false;
    }
    var d = 1;
    var m = 0;
    var y = year;
    var birthdate = new Date(y, m, d);
    var today = new Date();
    var diff = today - birthdate;
    var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    return age;
} // function calculateAge ends here

// function to call all the questions
async function nextQuestion(goBack, goBackFromResponse, fromDependedOn) {
    clearTimeout(timeout);
    clearTimeout(closeResponseTimeout);
    if (goBack) {
        let stepBack = uniqueQuestionsShowed.length - 2 < 0 ? 0 : uniqueQuestionsShowed.length - 2;
        let backQuizId = uniqueQuestionsShowed[stepBack].quiz;
        if (stepBack !== 0) {
            uniqueQuestionsShowed.pop();
        }
        currentQuizIndex = backQuizId - 1;
        totalQuizQuestions = allItems[currentQuizIndex].questions;
        currentQuestionCounter = uniqueQuestionsShowed[stepBack].counter;

        progress = uniqueQuestionsShowed[stepBack].progress;
        if (progress < 0) progress = 0;
        $("#myBar").css("width", progress + "%");

        var divsToHide = document.getElementsByClassName("answerRow");
        for (let i = 0; i < divsToHide.length; i++) {
            divsToHide[i].style.display = "none";
        }
        $("#questionRow").css("display", "none");
        let dependedOnQuestions = totalQuizQuestions.filter(function (qs) {
            return qs.depends_on && parseInt(qs.depends_on.split("|")[0]) == totalQuizQuestions[currentQuestionCounter].id;
        });
        if (dependedOnQuestions.length > 0) {
            dependedOnQuestions.forEach((dq) => {
                dataToReturn = dataToReturn.filter((answerObj) => {
                    return answerObj.question.id != dq.id;
                });
            });
            localStorage.setItem("answers", JSON.stringify(dataToReturn));
        }
        if (goBackFromResponse) {
            $("#page5").css("display", "none");
            $("#page4").css("display", "none");
            $("#page3").css("display", "block");
        }
        return await askQuestion(totalQuizQuestions, currentQuestionCounter, true);
    }

    increase = (1 / totalQuizQuestions.length) * 100;
    if (isNaN(increase) || increase == Infinity) increase = 0;
    else increase = increase * (1 / 3);
    progress = progress + increase;
    $("#myBar").css("width", progress + "%");

    timerStart = true; // allowing the timer to work for questions
    nextBtnClicked = false; // resetting next button is clicked to not  clicked

    //first get the answer of previous question and store it.
    if (currentActiveAnswerType && !isSkipStoreAnswer) {
        await storeAnswer(totalQuizQuestions[currentQuestionCounter - 1], currentActiveAnswerType);
    }

    weights = {};
    sliderAns = "";
    sliderBLActives = [];
    tempMcqAns = "";
    tempMcqAnsValue = 0;
    tempMcqiBLActives = [];
    tempMcqiAns = "";
    tempMcqiAnsValue = 0;
    tempMcqBLActives = [];
    minRangeVal = null;
    maxRangeVal = null;
    responseOnGoing = false;
    hasNoResponse = true;

    // displaying user's name on top  *this will be executed only once*
    if (dataToReturn[0] != null && !isExecuted) {
        isExecuted = true;
        var tempName = dataToReturn[0].answer;
        tempName = tempName.split(" ")[0]; //get first name only
        tempName = tempName.toUpperCase();
        $("#page3 .container .row .createdByDiv").html("");
        $("#page3 .container .row .createdByDiv").append(`
          Created By ${tempName}
      `);
        $("#page4 .container .row .createdByDiv").html("");
        $("#page4 .container .row .createdByDiv").append(`
          Created By ${tempName}
      `);
        $("#page5 .container .row .createdByDiv").html("");
        $("#page5 .container .row .createdByDiv").append(`
          Created By ${tempName}
      `);
    } //displaying user name on top ends here

    // first getting the first quiz
    totalQuizQuestions = allItems[currentQuizIndex].questions;

    // checking if there is any resp  onse in question or answer
    if (currentQuestionCounter != 0) {
        apiQues = totalQuizQuestions.find((ques) => ques.id == lastShowedQuestionId);
        let lastAnswerObject = dataToReturn.find(function (ansObj) {
            return ansObj.question.id == apiQues?.id;
        });

        if (lastAnswerObject && !fromDependedOn) {
            var fullAnswerObject = apiQues.answers.find(function (cAns) {
                return cAns.answer == lastAnswerObject.answer;
            });
            // quesResponse = apiQues.response;

            //when there is response with the question
            if (apiQues.id == 14) {
                //save progress if there is answer
                if (lastAnswerObject.answer) {
                    //ajax save contact
                    // const email = lastAnswerObject.answer;
                    // let fullName = localStorage.getItem("name");
                    // let firstName, lastName;
                    // if (fullName && fullName !== "You") firstName = fullName.split(" ")[0];
                    // if (fullName && fullName !== "You" && fullName.split(" ").length > 1) lastName = fullName.split(" ")[fullName.split(" ").length - 1];
                    //   try {
                    //     const newProfile = await fetch(url_preset + "/klaviyo/identity", {
                    //       method: "POST",
                    //       headers: {
                    //         "content-type": "application/json",
                    //       },
                    //       body: JSON.stringify({ email, firstName, lastName }),
                    //     }).then((res) => res.json());
                    //     const addedToList = await fetch(url_preset + "/klaviyo/list", {
                    //       method: "POST",
                    //       headers: {
                    //         "content-type": "application/json",
                    //       },
                    //       body: JSON.stringify({ email }),
                    //     }).then((res) => res.json());
                    //     console.log(newProfile);
                    //     console.log(addedToList);
                    //   } catch (error) {
                    //     console.error(error);
                    //   }
                }
            }
            if (apiQues.id == 20 && apiQues.type == 7) {
                if (Array.isArray(lastAnswerObject.answer)) {
                    if (lastAnswerObject.answer.length == 1) {
                        showResponse(null, "We’ll make sure to leave this one out");
                    } else if (lastAnswerObject.answer.length > 1) {
                        showResponse(null, "We’ll make sure to leave those out");
                    }
                }
            } else if (apiQues.type == 1 && apiQues.id == 1) {
                if (apiQues.answers.length > 0 && apiQues.answers[0].response_header) {
                    responseHeader = apiQues.answers[0].response_header;
                    var responseArguments = apiQues.answers[0].response_arguments;
                    responseArguments = JSON.parse(responseArguments);

                    var replaceWith = localStorage.getItem(responseArguments[0]);
                    if (replaceWith) {
                        replaceWith = replaceWith.toUpperCase();
                        responseHeader = inject_substitute(responseHeader, "name", replaceWith);
                        responseHeader = responseHeader.split(" ")[0];

                        $("#page3").css("display", "none");
                        $("#page4").css("display", "block");
                        $("#page4 .customImgRow .imgRowInner p").html("");
                        $("#page4 .customImgRow .imgRowInner p").css("display", "block");
                        $("#page4 .customImgRow .imgRowInner p").append(`${responseHeader}`);
                        responseOnGoing = true;
                        hasNoResponse = false;
                        closeResponseTimeout = setTimeout(async () => {
                          closeResponse();
                        }, closeResponseTimeoutCounter);
                    }
                } else if (apiQues.answers && apiQues.answers[0].responseBody) {
                    $("#page3").css("display", "none");
                    $("#page4").css("display", "block");
                    $("#page4 .customImgRow .imgRowInner p").html("");
                    $("#page4 .customImgRow .imgRowInner p").css("display", "block");
                    $("#page4 .customImgRow .imgRowInner p").append(`${responseHeader}`);
                    responseOnGoing = true;
                    hasNoResponse = false;
                    closeResponseTimeout = setTimeout(async () => {
                        closeResponse();
                    }, closeResponseTimeoutCounter);
                }
            } else if (apiQues.type == 3 && apiQues.id == 2 && age) {
                if (age < 25) age = "<25";
                else if (age >= 25 && age <= 40) age = "25-40";
                else if (age > 40) age = ">40";
                let correctAgeAnswer = apiQues.answers.find(function (cAns) {
                    return cAns.answer == age;
                });
                if (correctAgeAnswer) {
                    responseHeader = correctAgeAnswer.response_header;
                    responseBody = correctAgeAnswer.response_body;
                    showResponse(responseHeader, responseBody);
                }
            } else if ([4, 5, 6].includes(apiQues.type)) {
                if (fullAnswerObject && (fullAnswerObject.response_header || fullAnswerObject.response_body)) {
                    if (fullAnswerObject.response_arguments) {
                        responseHeader = fullAnswerObject.response_header;
                        var responseArguments = fullAnswerObject.response_arguments;
                        responseArguments = JSON.parse(responseArguments);
                        var replaceWith = localStorage.getItem(responseArguments[0]);
                        replaceWith = replaceWith.toUpperCase();
                        responseHeader = inject_substitute(responseHeader, "name", replaceWith);
                        responseBody = fullAnswerObject.response_body;
                    } else {
                        responseHeader = fullAnswerObject.response_header;
                        responseBody = fullAnswerObject.response_body;
                    }
                    showResponse(responseHeader, responseBody);
                }
            } else if (apiQues.type == 8) {
                showResponse(false, false, true);
            }
        }
    }

    // hide all answers row
    var divsToHide = document.getElementsByClassName("answerRow"); //divsToHide is an array
    for (var i = 0; i < divsToHide.length; i++) {
        divsToHide[i].style.display = "none"; // depending on what you're doing
    }

    //hide question row
    $("#questionRow").css("display", "none");

    if (hasNoResponse) {
        if (currentQuestionCounter < totalQuizQuestions.length) {
            return askQuestion(totalQuizQuestions, currentQuestionCounter);
        } else {
            if (currentQuizIndex + 1 < allItems.length) {
                currentQuizIndex++;
                currentQuestionCounter = 0;
                totalQuizQuestions = allItems[currentQuizIndex].questions;
                showQuizTitle();
                return askQuestion(totalQuizQuestions, currentQuestionCounter);
            } else {
                return showPreparingPage();
            }
        }
    }
} // nextQuestion function ends here

function showResponse(responseHead, responseBody, weatherQuestion) {
    responseOnGoing = true;
    hasNoResponse = false;
    $("#page3").css("display", "none");
    $("#page5 #weatherApi").css("display", "none");
    $("#progressBarSection").css("display", "block");
    $("#page5").css("display", "block");
    if (responseHead) {
        $("#page5 .responseRow .responseInner .responseHead").html("");
        $("#page5 .responseRow .responseInner .responseHead").css("display", "block");
        $("#page5 .responseRow .responseInner .responseHead").append(`
          <h1>${responseHead}</h1>
      `);
    } else {
        $("#page5 .responseRow .responseInner .responseHead").html("");
    }
    if (responseBody) {
        $("#page5 .responseRow .responseInner .responseBody").html("");
        $("#page5 .responseRow .responseInner .responseBody").css("display", "block");
        $("#page5 .responseRow .responseInner .responseBody").append(`
          <p>${responseBody}</p>
      `);
    } else {
        $("#page5 .responseRow .responseInner .responseBody").html("");
    }
    if (weatherQuestion) {
        $("#page5 #weatherApi").css("display", "block");
    }
    closeResponseTimeout = setTimeout(() => {
        closeResponse();
    }, closeResponseTimeoutCounter);
}

// function to close response page
function closeResponse() {
    responseOnGoing = false;
    hasNoResponse = true;
    $("#page5").css("display", "none");
    $("#page4").css("display", "none");
    $("#page3").css("display", "block");
    if (currentQuestionCounter < totalQuizQuestions.length) {
        return askQuestion(totalQuizQuestions, currentQuestionCounter);
    } else {
        if (currentQuizIndex + 1 < allItems.length) {
            currentQuizIndex++;
            currentQuestionCounter = 0;
            totalQuizQuestions = allItems[currentQuizIndex].questions;
            showQuizTitle();
            return askQuestion(totalQuizQuestions, currentQuestionCounter);
        } else {
            return showPreparingPage();
        }
    }
} // function closeResponse ends here

async function askQuestion(totalQuizQuestions, counter, fromBack) {
    clearTimeout(timeout);
    clearTimeout(closeResponseTimeout);

    var ques = totalQuizQuestions[counter];
    var dependsOn = ques.depends_on;
    argument = ques.question_arguments;
    argument = JSON.parse(argument);
    var type = 1;
    var note = ques.note;
    var noteType = ques.note_type;

    weights = {};
    sliderAns = "";
    sliderVal = 0;
    sliderBLActives = [];
    tempMcqAns = "";
    tempMcqAnsValue = 0;
    tempMcqiBLActives = [];
    tempMcqiAns = "";
    tempMcqiAnsValue = 0;
    tempMcqBLActives = [];
    tempSelectionAns = [];
    minRangeVal = null;
    maxRangeVal = null;
    isSkipStoreAnswer = false;
    saveResponseInto = "";
    responseOnGoing = false;
    hasNoResponse = true;
    lastCurrentQuizQuesInProgress = false;
    // checking if the question depends on another question or not

    if (dependsOn) {
        let dependedQuesId = dependsOn.split("|")[0];
        let wantedAnswer = dependsOn.split("|")[1];
        const userAnswerToDependedQuestion = dataToReturn.find(function (item) {
            return item.question.id == parseInt(dependedQuesId);
        });
        if (!userAnswerToDependedQuestion || !userAnswerToDependedQuestion.answer || userAnswerToDependedQuestion.answer?.toLowerCase() != wantedAnswer?.toLowerCase()) {
            currentActiveAnswerType = null;
            isSkipStoreAnswer = true;
            currentQuestionCounter++;
            if (currentQuestionCounter >= totalQuizQuestions.length) {
                currentQuizIndex++;
                currentQuestionCounter = 0;
                totalQuizQuestions = allItems[currentQuizIndex].questions;
                showQuizTitle();
            }
            return await nextQuestion(false, false, true);
        }
    }
    lastShowedQuestionId = ques.id;
    if (!fromBack) {
        uniqueQuestionsShowed.push({
            quiz: ques.quiz_id,
            question: ques.id,
            counter: currentQuestionCounter,
            progress: progress,
        });
    }
    // displaying note if it exists

    if (note) {
        $("#noteRow").css("display", "flex");
        $("#noteRow .noteDesc p").html(note);
        $("#page3 .questionRow").removeClass("no-note");
        $("#page3 .row.noteRow").removeClass("image-below");
        if (noteType == 1) {
            $("#noteRow .noteTitle h4").html("- Note -");
        } else {
            $("#noteRow .noteTitle h4").html("- Scientific Note -");
        }
    } else {
        if (!$("#page3 .questionRow.mtb").hasClass("no-note")) $("#page3 .questionRow.mtb").addClass("no-note");
        $("#noteRow").css("display", "none");
    }
    // end of displaying note
    if (dataToReturn && dataToReturn.length > 0) {
        var alreadyAnswered = dataToReturn.find(function (answer) {
            return answer.question.id == ques.id;
        });
    }
    if (oldAnswers && oldAnswers.length > 0) {
        //get the answer
        var currenQuesAnswerObj = oldAnswers.find((answerObj) => {
            return answerObj.question.id == ques.id;
        });
    }
    // displaying question
    $("#questionRow").css("display", "block");
    if (!$("#page3 .questionRow").hasClass("no-image")) $("#page3 .questionRow").addClass("no-image");
    type = ques.type;
    if (ques.id == 1) {
        if ($("#page3 .container").hasClass("mto")) $(".container").removeClass("mto");
        $("#page3 .questionRow.mtb").removeClass("mtb");
        $("#page3 .container").addClass("center-everything");
        $("#identity").addClass("hide");
        saveResponseInto = ques.save_response_into;
    } else {
        if ($("#page3 .container").hasClass("center-everything")) $("#page3 .container").removeClass("center-everything");
        if (!$("#page3 .questionRow").hasClass("mtb")) $("#page3 .questionRow").addClass("mtb");
        $("#page3 .container").addClass("mto");
        $("#identity").removeClass("hide");
    }

    // checking question type
    if (type == 1) {
        $("#typeText").css("display", "block");
        $("#typeText input").removeAttr("disabled");
        $("#typeText input").removeClass("disabled");
        currentActiveAnswerType = "typeText";
        $("#typeText input").val("");
        $("#typeText input").attr("placeholder", ques.placeholder);
        $("#typeText input").attr("name", ques.placeholder);
        $("#typeText input").attr("id", ques.placeholder);
        if (alreadyAnswered && alreadyAnswered.answer) {
            $("#typeText input").val(alreadyAnswered.answer);
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            $("#typeText input").val(currenQuesAnswerObj.answer);
        } else {
            if (ques.id == 14) {
                if (customerEmail) {
                    $("#typeText input").val($(customerEmail).text());
                }
            }
        }
        $("#typeText input").trigger("focus");
    } // type 1 ends here
    else if (type == 2 || type == 3) {
        $("#typeNum").css("display", "block");
        currentActiveAnswerType = "typeNum";
        $("#typeNum input").attr("placeholder", ques.placeholder);
        $("#typeNum input").attr("name", ques.placeholder);
        $("#typeNum input").attr("id", ques.placeholder);

        if (alreadyAnswered && alreadyAnswered.answer) {
            $("#typeNum input").val(alreadyAnswered.answer);
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            $("#typeNum input").val(currenQuesAnswerObj.answer);
        }
        if (ques.save_response_into) saveResponseInto = ques.save_response_into;
        $("#typeNum input").trigger("focus");
    } // type 2 and 3 ends here
    else if (type == 4) {
        $("#typeMcq .answerInner").html("");
        $("#typeMcq").css("display", "block");
        currentActiveAnswerType = "typeMcq";

        ques.answers.forEach((val) => {
            if (val.answer) {
                $("#typeMcq .answerInner").append(`
          <div class="mcqOptions">
            <button data-val="${val.answer}" data-id="${val.id}" data-answer-value="${val.answer_value}" data-bl-active='${val.black_list_actives}' class="multiBtns mcqBtn">${val.answer}</button>
          </div>
        `);
            }
        });
        if (alreadyAnswered && alreadyAnswered.answer) {
            $(`#typeMcq button[data-val="${alreadyAnswered.answer}"]`).addClass("highlight");
            selectAlreadyMcqAnswered(`#typeMcq button[data-val="${alreadyAnswered.answer}"]`);
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            $(`#typeMcq button[data-val="${currenQuesAnswerObj.answer}"]`).addClass("highlight");
            selectAlreadyMcqAnswered(`#typeMcq button[data-val="${currenQuesAnswerObj.answer}"]`);
        }
    } // type 4 ends here
    else if (type == 5) {
        $("#typeMcqi .answerInner").html("");
        $("#typeMcqi").css("display", "block");
        console.log(ques);

        currentActiveAnswerType = "typeMcqi";
        ques.answers.forEach((val) => {
            if (val.answer && val.image && ques.image_width && ques.image_height) {
                $("#typeMcqi .answerInner").append(`
          <div class="mcqiOptions" style="width: ${ques.image_width}px; height: ${ques.image_height}px;">
            <button data-id="${val.id}" data-val="${val.answer}" data-answer-value="${val.answer_value}" data-bl-active='${val.black_list_actives}' class="mcqiBtn">
              <img class="mcqiImg" src="${url_preset + val.image.url}" alt="image missing">
            </button>
          </div>
        `);
                if (!$("#page3 .row.noteRow").hasClass("image-below")) $("#page3 .row.noteRow").addClass("image-below");
                $("#page3 .questionRow").removeClass("no-image");
            }
        });
        if (alreadyAnswered && alreadyAnswered.answer) {
            $(`#typeMcqi button[data-val="${alreadyAnswered.answer}"]`).addClass("highlight");
            selectAlreadyMcqiAnswered(`#typeMcqi button[data-val="${alreadyAnswered.answer}"]`);
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            $(`#typeMcqi button[data-val="${currenQuesAnswerObj.answer}"]`).addClass("highlight");
            selectAlreadyMcqiAnswered(`#typeMcqi button[data-val="${currenQuesAnswerObj.answer}"]`);
        }
    } // type 5 ends here
    else if (type == 6) {
        $(".slider").removeClass("active");
        let atleastOneImage = false;
        ranges = [];
        $("#typeSlide .answerInner .sliderRanges").html("");
        $("#typeSlide .answerInner .imgDiv").html("");

        $("#typeSlide").css("display", "block");
        currentActiveAnswerType = "typeSlide";
        if (ques.save_response_into) saveResponseInto = ques.save_response_into;

        minRangeVal = parseFloat(ques.slider_range.split("-")[0]);
        maxRangeVal = parseFloat(ques.slider_range.split("-")[1]);
        $("#myRange").attr("min", minRangeVal);
        $("#myRange").attr("max", maxRangeVal);

        $("#typeSlide #myRange").val(minRangeVal);
        var numOfAnswers = ques.answers.length;

        let minStep = 0;
        let incremental = parseFloat(maxRangeVal) / parseFloat(numOfAnswers);

        ques.answers.forEach((val, index) => {
            let hasImage = false;
            if (val.image && val.image.id && val.image.url) {
                atleastOneImage = true;
                hasImage = {
                    id: val.image.id,
                    url: url_preset + val.image.url,
                    width: val.image.width,
                    height: val.image.height,
                };
                if (!$("#page3 .row.noteRow").hasClass("image-below")) $("#page3 .row.noteRow").addClass("image-below");
                $("#page3 .questionRow").removeClass("no-image");
                if (index == 0) {
                    $("#typeSlide .answerInner .imgDiv").css("display", "block");
                    $("#typeSlide .answerInner .imgDiv").append(`<img id="${hasImage.id}" src="${hasImage.url}" alt="Image missing">`);
                }
            } else {
                $("#page3 .row.noteRow").removeClass("image-below");
            }
            ranges.push({
                min: minStep,
                max: minStep + incremental,
                image: hasImage,
                answer: val.answer,
                black_list_actives: val.black_list_actives ? JSON.parse(val.black_list_actives) : [],
                output_var: ques.output_variable_name,
                weight: ques.weight,
                extra_var: ques.extra_output_variable ? JSON.parse(ques.extra_output_variable) : [],
            });

            //add ranges
            $("#typeSlide .answerInner .sliderRanges").append(`
        <div data-val="${val.answer}" data-id="${val.id}" data-min-range="${minStep}" data-max-range="${minStep + incremental}" class="ranges">
        ${val.hide_answer == 1 ? "" : val.answer}
        </div>
        `);
            minStep = minStep + incremental;
        });

        if (!atleastOneImage) {
            if (!$("#page3 .questionRow").hasClass("no-image")) $("#page3 .questionRow").addClass("no-image");
        }
        $(".sliderRanges div").css("width", `${parseFloat(1 / ques.answers.length) * 100}%`);
        if (alreadyAnswered && alreadyAnswered.answer) {
            $(`#typeSlide #myRange`).val(parseFloat(alreadyAnswered.slider_value));
            $("#myRange").trigger("input", [true]);
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            $(`#typeSlide #myRange`).val(parseFloat(currenQuesAnswerObj.slider_value));
            $("#myRange").trigger("input", [true]);
        }
    } // type 6 ends here
    else if (type == 7) {
        $("#typeSelection .answerInner").html("");
        $("#typeSelection").css("display", "block");
        currentActiveAnswerType = "typeSelection";

        ques.answers.forEach((val, index) => {
            if (val.answer) {
                $("#typeSelection .answerInner").append(`
                    <div class="selectionOptions">
                        <button data-val="${val.answer}" onclick="checkAllergie(event)" data-id="${val.id}" class="selectionBtns selectionBtn" >${val.answer}</button>
                    </div>
                `);
            }
        });

        $("#typeSelection .answerInner").append(`
            <div class="selectionOptions">
                <button  onclick="handleNoneOfTheAbove()" class="selectionBtns selectionBtn" > None of the above</button>
            </div>
        `)

        if (alreadyAnswered && alreadyAnswered.answer) {
            if (Array.isArray(alreadyAnswered.answer)) {
                alreadyAnswered.answer.forEach((answer) => {
                    if (!["Banana", "Olive", "Sunflowers"].includes(answer)) {
                        $(`#typeSelection button[data-val="${answer}"]`).trigger("click", [true]);
                    }
                });
            }
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            if (Array.isArray(currenQuesAnswerObj.answer)) {
                currenQuesAnswerObj.answer.forEach((answer) => {
                    if (!["Banana", "Olive", "Sunflowers"].includes(answer)) {
                        $(`#typeSelection button[data-val="${answer}"]`).trigger("click", [true]);
                    }
                });
            }
        }
    } //type 7 ends here
    else if (type == 8) {
        $("#typeGeo").css("display", "block");
        currentActiveAnswerType = "typeGeo";
        $("#typeGeo input#city").val("");
        $("#typeGeo input#city").attr("placeholder", ques.placeholder);

        if (alreadyAnswered && alreadyAnswered.answer) {
            $("#typeGeo input#city").val(alreadyAnswered.answer);
            $("#typeGeo #city_id").val(alreadyAnswered.city_id);
        } else if (currenQuesAnswerObj && currenQuesAnswerObj.answer && !alreadyAnswered) {
            $("#typeGeo input#city").val(currenQuesAnswerObj.answer);
            $("#typeGeo #city_id").val(currenQuesAnswerObj.city_id);
        }
        $("#typeGeo input#city").trigger("focus");
    }

    if (argument != null) {
        var newQues = ques.question;
        var replaceWith = localStorage.getItem(argument[0]);

        newQues = inject_substitute(newQues, "name", replaceWith);
        $("#questionRow h1").html(newQues);
    } else {
        $("#questionRow h1").html(ques.question);
    }
    currentQuestionCounter++;
}

async function storeAnswer(currentQuestion, currentActiveAnswerType) {
    var temp = [];
    temp["question"] = currentQuestion;
    let answerExists = dataToReturn.findIndex(function (answerObject) {
        return answerObject.question?.id == temp.question?.id;
    });
    console.log(answerExists);
    if (currentActiveAnswerType == "typeText") {
        ans = $("#" + currentActiveAnswerType + " input").val();
        if (saveResponseInto == "name") {
            if (!ans) {
                ans = "You";
            }
            localStorage.setItem("name", ans);
        }
        temp["answer"] = ans;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    } else if (currentActiveAnswerType == "typeNum") {
        ans = $("#" + currentActiveAnswerType + " input").val();
        if (saveResponseInto == "age") {
            UserBirth = ans;
            if (UserBirth) {
                age = calculateAge(UserBirth);
                weights[currentQuestion.output_variable_name] = {
                    value: parseFloat(age) * currentQuestion.weight,
                    base: currentQuestion.weight,
                };
                if (currentQuestion.extra_output_variable) {
                    let extra_var = JSON.parse(currentQuestion.extra_output_variable);
                    extra_var.forEach(function (extra) {
                        weights[extra.name] = {
                            value: parseFloat(age) * extra.weight,
                            base: extra.weight,
                        };
                    });
                }
                temp["weights"] = weights;
            }
        }

        temp["answer"] = ans;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    } else if (currentActiveAnswerType == "typeMcq") {
        ans = tempMcqAns;
        if (currentQuestion.output_variable_name) {
            weights[currentQuestion.output_variable_name] = {
                value: parseFloat(tempMcqAnsValue) * currentQuestion.weight,
                base: currentQuestion.weight,
            };
            if (currentQuestion.extra_output_variable) {
                let extra_var = JSON.parse(currentQuestion.extra_output_variable);
                extra_var.forEach(function (extra) {
                    weights[extra.name] = {
                        value: parseFloat(tempMcqAnsValue) * parseFloat(extra.weight),
                        base: parseFloat(extra.weight),
                    };
                });
            }
            temp["weights"] = weights;
        }
        temp["answer"] = ans;
        temp["black_list_actives"] = tempMcqBLActives;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    } else if (currentActiveAnswerType == "typeMcqi") {
        ans = tempMcqiAns;
        if (currentQuestion.output_variable_name) {
            weights[currentQuestion.output_variable_name] = {
                value: parseFloat(tempMcqiAnsValue) * currentQuestion.weight,
                base: currentQuestion.weight,
            };
            if (currentQuestion.extra_output_variable) {
                let extra_var = JSON.parse(currentQuestion.extra_output_variable);
                extra_var.forEach(function (extra) {
                    weights[extra.name] = {
                        value: parseFloat(tempMcqiAnsValue) * parseFloat(extra.weight),
                        base: parseFloat(extra.weight),
                    };
                });
            }
            temp["weights"] = weights;
        }
        temp["answer"] = ans;
        temp["black_list_actives"] = tempMcqiBLActives;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    } else if (currentActiveAnswerType == "typeSlide") {
        ans = sliderAns;
        temp["answer"] = ans;
        temp["slider_value"] = sliderVal;
        temp["weights"] = weights;
        temp["black_list_actives"] = sliderBLActives;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    } else if (currentActiveAnswerType == "typeSelection") {
        ans = tempSelectionAns;
        temp["answer"] = ans;
        temp["black_list_actives"] = tempSelectionAns;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    } else if (currentActiveAnswerType == "typeGeo") {
        ans = $("#typeGeo input#city").val();
        city_id = $("#typeGeo #city_id").val();
        //check if answer but not city_id
        if (!ans) {
            return false;
        }
        if (ans && !city_id) {
            await fetch(url_preset + "/api/v1/places/autocomplete?input=" + ans.replace(/ /g, ""))
                .then((res) => res.json())
                .then(function (data) {
                    city_id = data[0].id;
                });
        }
        try {
            if (!$(".lds-ring").hasClass("active")) $(".lds-ring").addClass("active");
            const payload = await fetch(url_preset + `/api/v1/weather-profile?city_id=${city_id}`).then((response) => response.json());
            if (payload.success && payload.data) {
                temp["weights"] = payload.data.weights;
                $("#humidity .info-value").html(payload.data.humidity);
                $("#temp .info-value").html(`${payload.data.temperature}${payload.data.unit}`);
                $("#sun .info-value").html(payload.data.sun);
                $("#pollution .info-value").html(payload.data.pollution);
            } else {
                throw new Error();
            }
        } catch (err) {
            $("#weatherApi").html("Couldn't get your location.");
            $("#weatherApi").css({
                font: "italic 42px 'Bradford LL'",
                "text-align": "center",
            });
        }
        $(".lds-ring").removeClass("active");
        temp["answer"] = ans;
        temp["city_id"] = city_id;
        temp = Object.assign({}, temp);
        if (temp["answer"]) {
            if (answerExists == -1) {
                dataToReturn.push(temp);
            } else {
                const dependedOnQuestions = dataToReturn.filter((ansObj, index) => {
                    if (ansObj.question.depends_on && ansObj.question.depends_on.split("|")[0] == temp["question"].id) {
                        ansObj.obj_index = index;
                        return ansObj;
                    }
                });
                if (dependedOnQuestions && temp["answer"] !== dataToReturn[answerExists].answer) {
                    dependedOnQuestions.forEach((dq) => {
                        dataToReturn.splice(dq.obj_index, 1);
                    });
                }
                dataToReturn[answerExists] = temp;
            }
        }
    }
    localStorage.setItem("answers", JSON.stringify(dataToReturn));
}

let currentSuggestIndex;
let oldVal;
let itemSelected = false;
let enterOnce = false;

$(document).on("click focus", async function (event) {
    if (!event.target.closest("#result") && !event.target.closest("#typeGeo input")) {
        $("#result").css({
            display: "none",
        });
    } else if (event.target.closest("#typeGeo input")) {
        $("#result").css({
            display: "block",
        });
    }
});

$(document).on("click", "li.autocomplete-item", async function (event) {
    enterOnce = true;
    $("#typeGeo input[type=search]").val($(this).text());
    $("#typeGeo #city_id").val($(this).attr("data-place-id"));
    $("#result").css({
        display: "none",
    });
    $("#typeGeo input[type=search]").trigger("focus");
});

$("#typeText input").on("keyup", function (evt) {
    if (["Enter"].includes(evt.key)) {
        return nextQuestion();
    }
});
$("#typeNum input").on("keyup", function (evt) {
    if (["Enter"].includes(evt.key)) {
        return nextQuestion();
    }
});
$("#typeGeo input").on("keyup", function (evt) {
    const val = $(this).val();
    if (["ArrowDown", "ArrowUp", "Enter"].includes(evt.key)) {
        if (evt.key == "Enter") {
            if (!enterOnce) {
                enterOnce = true;
            } else {
                return nextQuestion();
            }
            $("#typeGeo input").val($("#suggestion-list li.active.selected").text());
            $("#typeGeo #city_id").val($("#suggestion-list li.active.selected").attr("data-place-id"));
            $("#result").css({
                display: "none",
            });
            return false;
        }
        enterOnce = false;
        $("#result").css({
            display: "block",
        });
        $(`#suggestion-list li`).removeClass("active");
        $(`#suggestion-list li`).removeClass("selected");

        let listLength = $("#suggestion-list li").length;
        if (evt.key == "ArrowDown") {
            currentSuggestIndex = currentSuggestIndex ? currentSuggestIndex + 1 : 1;
            if (currentSuggestIndex > listLength) {
                currentSuggestIndex = 1;
            }
        } else if (evt.key == "ArrowUp") {
            currentSuggestIndex = currentSuggestIndex ? currentSuggestIndex - 1 : listLength;
            if (currentSuggestIndex < 1) {
                currentSuggestIndex = listLength;
            }
        }
        $(`#suggestion-list li:nth-child(${currentSuggestIndex})`).addClass("active");
        $(`#suggestion-list li:nth-child(${currentSuggestIndex})`).addClass("selected");
        return false;
    }

    if (val == oldVal) {
        return false;
    } else {
        oldVal = val;
    }
    res = $("#result").css({
        display: "block",
    });
    res.html("");
    if (val == "") {
        return;
    }
    let list = "";
    fetch(url_preset + "/api/v1/places/autocomplete?input=" + val.replace(/ /g, ""))
        .then((res) => res.json())
        .then(function (data) {
            for (i = 0; i < data.length; i++) {
                list += `<li class='autocomplete-item' data-place-id='${data[i].id}' tabindex='${i + 1}'>` + data[i].name + "</li>";
            }
            res.html(`<ul id='suggestion-list'>` + list + `</ul>`);
            return true;
        })
        .catch(function (err) {
            console.warn("Something went wrong.", err);
            return false;
        });
});

//handlers
$(document).on("input", "#myRange", async function (event, isCustom) {
    clearTimeout(timeout);
    sliderVal = parseFloat($(this).val());
    let currRange = ranges.find(function (range) {
        return sliderVal >= range.min && sliderVal <= range.max;
    });
    sliderAns = currRange.answer;

    let percentageMultiplier = (1 / (maxRangeVal - minRangeVal)) * 100;
    weights[currRange.output_var] = {
        value: (sliderVal - minRangeVal) * percentageMultiplier * currRange.weight,
        base: currRange.weight,
    };
    if (currRange.extra_var && currRange.extra_var.length) {
        currRange.extra_var.forEach(function (extra) {
            weights[extra.name] = {
                value: sliderVal * parseFloat(extra.weight),
                base: parseFloat(extra.weight),
            };
        });
    }
    sliderBLActives = currRange.black_list_actives;
    if (currRange.image) {
        if ($("#typeSlide .answerInner .imgDiv img").length == 0) {
            $("#typeSlide .answerInner .imgDiv").append(`<img id="${currRange.image.id}" src="${currRange.image.url}" alt="Image missing">`);
        } else {
            $("#typeSlide .answerInner .imgDiv img").attr("id", currRange.image.id);
            $("#typeSlide .answerInner .imgDiv img").attr("src", currRange.image.url);
        }
    } else {
        $("#typeSlide .answerInner .imgDiv").html("");
    }
    if (!isCustom) {
        timeout = setTimeout(function () {
            nextQuestion();
        }, nextQuestionTimeoutCounter);
    }
});

$(document).on("click", ".selectionBtn", function (evt, isCustom) {
    clearTimeout(timeout);
    var val = $(this).attr("data-val");
    if ($(this).hasClass("active")) {
        tempSelectionAns.splice(tempSelectionAns.indexOf(val), 1);
        $(this).removeClass("active");
        $(this).removeClass("highlight");
    } else {
        tempSelectionAns.push(val);
        if (!$(this).hasClass("active")) $(this).addClass("active");
        if (!$(this).hasClass("highlight")) $(this).addClass("highlight");
    }
    if (!isCustom) {
        timeout = setTimeout(function () {
            nextQuestion();
        }, selectionQuestionTimeoutCounter);
    }
});

$(document).on("click", ".mcqiBtn", async function () {
    tempMcqiAns = $(this).attr("data-val");
    tempMcqiAnsValue = $(this).attr("data-answer-value");
    if ($(this).attr("data-bl-active")) {
        tempMcqiBLActives = JSON.parse($(this).attr("data-bl-active"));
    }
    return await nextQuestion();
});

$(document).on("click", ".mcqBtn", async function () {
    tempMcqAns = $(this).attr("data-val");
    tempMcqAnsValue = $(this).attr("data-answer-value");
    if ($(this).attr("data-bl-active")) {
        tempMcqBLActives = JSON.parse($(this).attr("data-bl-active"));
    }
    return await nextQuestion();
});

function inject_substitute(text, normalKey, value) {
    text = text.replace(new RegExp("<<<" + normalKey + ">>>", "g"), value);
    return text;
}

function selectAlreadyMcqAnswered(self) {
    tempMcqAns = $(self).attr("data-val");
    tempMcqAnsValue = $(self).attr("data-answer-value");
    if ($(self).attr("data-bl-active")) {
        tempMcqBLActives = JSON.parse($(self).attr("data-bl-active"));
    }
}

function selectAlreadyMcqiAnswered(self) {
    tempMcqiAns = $(self).attr("data-val");
    tempMcqiAnsValue = $(self).attr("data-answer-value");
    if ($(self).attr("data-bl-active")) {
        tempMcqiBLActives = JSON.parse($(self).attr("data-bl-active"));
    }
}

$(".slider").on("input change", function () {
    if (!$(this).hasClass("active")) $(this).addClass("active");
});

async function addToCart() {
    if (!$(".lds-ring").hasClass("active")) $(".lds-ring").addClass("active");
    let existingProducts = [],
        lineItems = [],
        cart;
    const response = await fetch(url_preset + "/v1/api/get-shopify-products");
    const data = await response.json();
    if (response.ok && data) {
        const products = data.products;
        existingProducts = products.filter((product) => {
            let inFinalList = finalActives.find((active) => active[0] == product.title);
            if (inFinalList) {
                product.score = inFinalList[1];
                return product;
            }
        });
    }

    existingProducts.forEach((prod) => {
        lineItems.push({
            id: prod.variants[0].id,
            quantity: 1,
            properties: {
                score: prod.score ? parseFloat(prod.score).toFixed(2) : -1
            },
        });
        // }
    });
    console.log(lineItems);
    cart = {
        items: lineItems,
        attributes: {
            answers: JSON.stringify(
                dataToReturn.map((item) => {
                    item.question = {
                        id: item.question.id
                    };
                    return item;
                })
            ),
            profile: JSON.stringify(profile_characteristics),
            actives: JSON.stringify(finalActives.map((active) => active[0])),
        },
    };

    await fetch("/cart/clear").then((res) => {
        res.ok ? console.log("cart cleared") : "Something went wrong";
    });

    const cartResponse = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
    });

    const cartData = await cartResponse.json();
    console.log(cartResponse);
    console.log(cartData);
    $(".lds-ring").removeClass("active");
    if (cartResponse.ok) {
        window.location.href = "/cart";
    }
}

function handleNoneOfTheAbove() {
    isSkipStoreAnswer = true;
    nextQuestion();
}

function handleImageMissing(self) {
    $(self).addClass("image-missing");
}

function checkAllergie(event) {
    const values = ["Banana", "Olive", "Sunflowers"]
    const value = event.target.dataset.val
    if(values.includes(value)) teminateQuiz()
}

async function teminateQuiz () {
    const request = await fetch("http://127.0.0.1:3001/admin/api/terminate")
    const response = await request.json() 

    if(response?.id) {
        const fadedMessageBox = document.querySelector(".fadedMessage")
        fadedMessageBox.classList.add("show")
        fadedMessageBox.querySelector("[data-message]").innerHTML = response.message
        fadedMessageBox.querySelector("[data-timer]").innerHTML = response.counter

        setCountDown(fadedMessageBox.querySelector("[data-timer]"), response.counter)
    }
    else {
        console.log("Something went wrong")
    }
}

function setCountDown(element, counter) {
    const interval = setInterval(() => {
        counter--
        element.innerHTML = counter
        if(counter === 0) {
            clearInterval(interval)
            location.href = "/"
        }
    }, 1000)
}