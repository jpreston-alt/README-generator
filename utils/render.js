// this module contains functions that render extra sections or extra questions based on user input
const questions = require("./questions");

// 1. user is asked which extra sections they want to include... 

// 1A. asks follow up questions based on what sections user wants to include
function extraQarr(arr) {
    let questionsArr = [];

    if (arr.includes("License")) {
        questionsArr.push(questions.licenseQ);
    } if (arr.includes("Installation")) {
        questionsArr.push(questions.installQ);
    } if (arr.includes("Contributing")) {
        questionsArr.push(questions.contributingQ);
    } if (arr.includes("Tests")) {
        questionsArr.push(questions.testQ);
    } if (arr.includes("Credits")) {
        questionsArr.push(questions.creditsQ);
    };

    return questionsArr;
};

// 1B. renders table of contents according to answers
function renderTOC(arr) {
    let list;
    if (arr === []) {
        list = "";
    } else {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = `* [${arr[i]}](#${arr[i]})\n`
        };
        list = arr.join("");
    };
    return list;
};

// 1C. creates a new Section object based on answers
function Section(header, body) {
    this.header = header;
    this.body = body;
    this.validate = function (arr) {
        if (this.body == undefined ||
            this.body.includes("undefined")) {
        } else {
            arr.push(this);
        }
    }
};

// 1D. renders those Sections into the README
function renderSections(arr) {
    let list = "";
    if (arr === []) {
        list = "";
    } else {
        for (var i = 0; i < arr.length; i++) {
            list += `## ${arr[i].header}\n${arr[i].body}\n\n`;
        }
    }
    return list;
};


// renders technologies list based on user input
function renderTechs(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = `* ${arr[i]}\n`
    };
    let list = arr.join("");
    return list;
};

// replaces spaces with dashes from user input
function noSpaces(str) {
    const trimStr = str.trim();
    const newStr = trimStr.replace(" ", "-");
    return newStr;
};

module.exports = {renderTOC, renderSections, extraQarr, Section, noSpaces, renderTechs};