// this module contains functions pertaining to follow up questions
// user is asked which other sections they would like to include, then sections are rendered and other questions are prompted based on that answer.

// renders table of contents to include new sections
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

// renders sections array to be passed into render sections function
// function renderSectArr(arr) {
//     var newArr = [];
//     for (var i = 0; i < arr.length; i++) {
//         if (arr[i].body == undefined ||
//             arr[i].body.includes("undefined")) {

//         } else {
//             newArr.push(arr[i]);
//         }
//     }
//     return newArr;
// };

// renders sections in readme
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

// ask follow up questions based on what sections user wants to include
function extraQarr(arr) {

    let questionsArr = [];

    let licenseQ = {
        type: "list",
        name: "license",
        message: "What kind of license should your project have? ",
        choices: ["MIT", "GNU GPLv3", "ISC", "Apache License 2.0"]
    };

    let testQ = {
        type: "input",
        name: "test",
        message: "What command should be run to run tests? ",
        default: "npm test"
    };

    let contributingQ = {
        type: "input",
        name: "contributing",
        message: "What does the user need to know about contributing to the repo? "
    };

    if (arr.includes("License")) {
        questionsArr.push(licenseQ);
    } if (arr.includes("Contributing")) {
        questionsArr.push(contributingQ);
    } if (arr.includes("Tests")) {
        questionsArr.push(testQ);
    };

    return questionsArr;
};

module.exports = {renderTOC, renderSections, extraQarr, Section};